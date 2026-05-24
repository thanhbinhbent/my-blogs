---
title: "AI Agent Architecture for Testing Automation"
description: "How to design multi-agent systems that write, execute, and heal tests autonomously — from single LLM calls to full orchestration pipelines."
date: 2024-12-01
tags: ["ai", "testing", "automation", "architecture"]
slug: ai-agent-architecture-testing
---

Test automation is ripe for AI augmentation. Not because engineers can't write tests, but because the cost of maintaining them at scale is enormous. Every UI change breaks selectors. Every refactor cascades into dozens of failing tests. Flaky tests erode confidence. The gap between what's tested and what should be tested keeps growing.

AI agents can close that gap. This post walks through how to design them well.

---

## What Makes Testing a Good Fit for AI Agents

Before diving into architecture, it's worth understanding *why* testing and agents pair well.

**Tests have clear success criteria.** A test either passes or fails. An AI agent can observe the outcome and iterate — unlike open-ended creative tasks, there's an objective ground truth to optimize toward.

**Test failures carry rich signal.** Stack traces, DOM snapshots, network logs, and console output give an agent concrete evidence to reason about.

**The action space is bounded.** Agents don't need unlimited browser access or system permissions. They need to: write code, execute a test runner, read output, and edit files. That's a small, safe sandbox.

**Repair patterns are learnable.** Most test failures fall into a handful of categories — stale selectors, timing issues, data mismatches, environment drift. These are recognizable, fixable patterns.

---

## The Core Abstraction: Tools + Reasoning Loop

Every useful testing agent is built on the same foundation:

```
while not done:
    observation = perceive(environment)
    thought = reason(observation, goal, history)
    action = select_action(thought)
    environment = execute(action)
```

The agent perceives (reads test output, DOM, code), reasons (what went wrong, what fix to try), acts (edits a file, reruns a test), and observes the result. It loops until the test passes or it hits a stopping condition.

The tools available to the agent define what it can do:

```ts
const testingTools = [
  {
    name: 'read_file',
    description: 'Read the content of a source or test file',
    parameters: { path: 'string' },
  },
  {
    name: 'write_file',
    description: 'Write or update a file with new content',
    parameters: { path: 'string', content: 'string' },
  },
  {
    name: 'run_tests',
    description: 'Run a specific test file and return the output',
    parameters: { testFile: 'string', filter?: 'string' },
  },
  {
    name: 'get_dom_snapshot',
    description: 'Capture the current DOM of a running page at a URL',
    parameters: { url: 'string' },
  },
  {
    name: 'search_codebase',
    description: 'Grep the codebase for a pattern',
    parameters: { pattern: 'string', fileGlob?: 'string' },
  },
];
```

Keep the tool set small. Every additional tool is a decision branch the model must navigate, and extra tools introduce more surface for mistakes.

---

## Architecture Patterns

### Pattern 1: Single Agent (Simple Tasks)

For isolated, well-scoped tasks, a single agent loop is sufficient.

```
[Task] → [Agent] → [Tools] → [Output]
```

**Good for:**
- Fixing one failing test given its error output
- Generating a test for a single component from its source
- Adding assertions to an existing test

**Implementation:**

```ts
async function fixTest(testFile: string, errorOutput: string): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are a Playwright test engineer. Fix failing tests using the provided tools.
      Always run the test after each fix to verify it passes.`,
    },
    {
      role: 'user',
      content: `This test is failing:\n\nFile: ${testFile}\n\nError:\n${errorOutput}\n\nFix it.`,
    },
  ];

  while (true) {
    const response = await llm.chat(messages, { tools: testingTools });

    if (response.stopReason === 'end_turn') break;

    // Execute tool calls
    for (const call of response.toolCalls) {
      const result = await executeTool(call.name, call.parameters);
      messages.push({ role: 'tool', toolCallId: call.id, content: result });
    }

    messages.push(response.message);
  }

  return 'done';
}
```

### Pattern 2: Orchestrator + Subagents (Complex Tasks)

When a task spans multiple concerns — generate tests, verify coverage, fix flakiness — split it across specialized agents coordinated by an orchestrator.

```
                    [Orchestrator]
                   /      |       \
          [Generator] [Executor] [Healer]
```

- **Orchestrator**: Understands the high-level goal, breaks it down, delegates, collects results
- **Generator**: Writes new test cases from specs, source code, or user stories
- **Executor**: Runs tests, captures traces, summarizes results
- **Healer**: Diagnoses failures, applies fixes, verifies

```ts
async function orchestrate(target: string): Promise<Report> {
  // Step 1: Generate tests
  const generatedTests = await generatorAgent.run({
    prompt: `Generate comprehensive Playwright tests for ${target}`,
  });

  // Step 2: Run them
  const results = await executorAgent.run({
    tests: generatedTests,
  });

  // Step 3: Heal failures in parallel
  const healingTasks = results.failures.map(failure =>
    healerAgent.run({ failure })
  );
  const healed = await Promise.all(healingTasks);

  return buildReport(results, healed);
}
```

**Key design decision:** should subagents share context, or be isolated? Isolated agents are simpler and more predictable. Shared context enables better reasoning but adds coordination complexity.

### Pattern 3: Reflection Loop

After an agent completes a task, a second pass critiques the output.

```
[Agent] → [Draft Output] → [Critic] → [Revised Output]
```

For test generation, this is powerful: the generator writes tests, the critic checks them for common anti-patterns (hard-coded waits, fragile selectors, missing assertions), and the generator revises based on feedback.

```ts
async function generateWithReflection(spec: string): Promise<string> {
  const draft = await generatorAgent.run({ spec });

  const critique = await criticAgent.run({
    prompt: `Review these Playwright tests for quality issues:

${draft}

Check for:
- Hard-coded timeouts (await page.waitForTimeout)
- CSS/XPath selectors that should be role-based
- Missing assertions after actions
- No cleanup / state leakage between tests
- Overly broad assertions`,
  });

  if (critique.issues.length === 0) return draft;

  return generatorAgent.run({
    spec,
    previousDraft: draft,
    feedback: critique.issues,
  });
}
```

---

## Handling Context: What the Agent Needs to Know

An agent writing tests for a UI component needs:

1. **The component's source** — what props it accepts, what it renders
2. **Existing tests** — to avoid duplication and follow established patterns
3. **The live DOM** — what's actually rendered, including data-testid attributes
4. **Recent failures** — if tests exist and are failing, why
5. **Project conventions** — the test file naming pattern, fixture setup, utility helpers

Don't dump everything into the prompt. Use retrieval. A vector search over your test suite, combined with targeted file reads, gives the agent relevant context without overwhelming the context window.

```ts
async function buildContext(component: string): Promise<string> {
  const [source, existingTests, conventions] = await Promise.all([
    readFile(`src/components/${component}.tsx`),
    vectorSearch(`tests for ${component}`, topK=3),
    readFile('tests/CONVENTIONS.md'),
  ]);

  return `
## Component source
${source}

## Similar existing tests (for reference)
${existingTests}

## Project conventions
${conventions}
  `.trim();
}
```

---

## Self-Healing Tests in Production

The most operationally valuable agent pattern: automatically fix failing tests in CI.

```
[CI Failure] → [Triage Agent] → [Is it flaky? Code change? Env issue?]
                                         |
                              [Fix Agent] → [PR with fix]
```

**Triage first.** Not every failure needs an agent fix. Classify the failure:

- **Selector mismatch** → DOM changed, fix the locator
- **Timing issue** → race condition, add proper wait
- **Data dependency** → test data stale, fix seed/mock
- **Env issue** → CI configuration, not a code fix
- **Genuine regression** → the app broke, alert the team

```ts
async function triageFailure(failure: TestFailure): Promise<TriageResult> {
  const { errorMessage, stackTrace, screenshot, networkLogs } = failure;

  const classification = await llm.classify({
    input: { errorMessage, stackTrace },
    categories: [
      'selector_mismatch',
      'timing_issue',
      'data_dependency',
      'env_issue',
      'genuine_regression',
    ],
  });

  if (classification === 'genuine_regression') {
    return { action: 'alert', reason: 'Possible real bug — do not auto-fix' };
  }

  return { action: 'fix', classification };
}
```

Never auto-merge AI-generated fixes to production. Open a PR. The diff is small and reviewable in 30 seconds, and human review is the safety net that makes self-healing trustworthy.

---

## Guardrails and Reliability

Agents fail. Design for it.

**Iteration limits.** Cap the number of fix attempts. An agent stuck in a loop will hallucinate solutions and make things worse.

```ts
const MAX_ITERATIONS = 5;
let iterations = 0;
while (!testPasses && iterations < MAX_ITERATIONS) {
  // ...
  iterations++;
}
```

**Scope constraints.** Tell the agent what it may not touch. A test-fixing agent should never modify the application code.

```ts
const systemPrompt = `
You are a test engineer. You may ONLY modify files in the /tests directory.
Never modify source files in /src, /lib, or /app.
If fixing a test requires changing application code, stop and explain why.
`;
```

**Dry-run mode.** Show the agent's proposed changes before applying them. Especially useful when onboarding a new agent into an existing test suite.

**Determinism.** Set `temperature: 0` for fix agents. Creativity is not a virtue when you need reproducible, correct code.

**Evaluation.** Measure agent quality systematically:
- Fix success rate (% of failures the agent resolves correctly)
- False positive rate (% of fixes that break other tests)
- Mean time to fix
- Human rejection rate on PRs

Without metrics, you can't tell if the agent is getting better or worse as you iterate on its prompts and tools.

---

## Practical Starting Point

Don't start with multi-agent orchestration. Start with a single agent that does one thing well.

**Week 1:** Build a script that takes a failing test file + error output, calls an LLM, and outputs a fixed file. No tool calls yet, just prompting.

**Week 2:** Add tool calls: read a file, write a file, run the test. The agent iterates until the test passes.

**Week 3:** Add context retrieval: give the agent access to the DOM snapshot of the failing page.

**Week 4:** Integrate with CI. When a test fails, open a PR with the agent's fix.

From there, you have a real system to iterate on — and a clear feedback loop from production data.

---

## Further Reading

- [Playwright Documentation](https://playwright.dev) — the baseline; start here
- *Building AI Agents* — Anthropic's guide on agent design patterns
- *ReAct: Synergizing Reasoning and Acting in Language Models* — the foundational paper behind tool-using agents
- LangGraph, CrewAI, AutoGen — higher-level frameworks if you outgrow a hand-rolled loop
