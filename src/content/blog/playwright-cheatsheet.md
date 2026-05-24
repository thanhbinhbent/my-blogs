---
title: "Playwright Cheatsheet: The Complete Reference"
description: "A comprehensive, copy-paste-ready reference for Playwright — from selectors and assertions to network mocking, authentication, and CI configuration."
date: 2024-11-15
tags: ["playwright", "testing", "automation", "typescript"]
slug: playwright-cheatsheet
---

Playwright is the gold standard for end-to-end browser testing. This cheatsheet covers everything from basic setup to advanced patterns. Keep it open while you write tests.

## Setup & Installation

```bash
# Install Playwright with browsers
npm init playwright@latest

# Add to an existing project
npm install -D @playwright/test
npx playwright install
```

**`playwright.config.ts` essentials:**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## Locators

Playwright recommends role-based and user-facing locators. Avoid CSS/XPath where possible.

### Preferred locators

```ts
// By role (most resilient)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'About' })
page.getByRole('heading', { name: 'Dashboard' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('checkbox', { name: 'Remember me' })

// By label (form inputs)
page.getByLabel('Email address')
page.getByLabel('Password')

// By placeholder
page.getByPlaceholder('Search...')

// By text content
page.getByText('Welcome back')
page.getByText('Terms of Service', { exact: true })

// By test id (add data-testid to your HTML)
page.getByTestId('submit-button')
```

### CSS and XPath (when needed)

```ts
page.locator('.card-title')
page.locator('#main-nav')
page.locator('[data-status="active"]')
page.locator('xpath=//button[@type="submit"]')
```

### Chaining and filtering

```ts
// Scoped locators
const dialog = page.locator('[role="dialog"]');
dialog.getByRole('button', { name: 'Confirm' });

// Filter by another locator
page.getByRole('listitem').filter({ hasText: 'In Progress' })
page.getByRole('listitem').filter({ has: page.getByRole('checkbox', { checked: true }) })

// Nth element
page.getByRole('row').nth(2)
page.getByRole('row').first()
page.getByRole('row').last()
```

---

## Actions

```ts
// Click
await locator.click()
await locator.click({ button: 'right' })
await locator.click({ modifiers: ['Shift'] })
await locator.dblclick()

// Keyboard
await locator.fill('hello@example.com')     // clears then types
await locator.pressSequentially('Hello')    // types char by char (triggers keydown)
await locator.press('Enter')
await locator.press('Control+A')
await locator.clear()

// Focus and blur
await locator.focus()
await locator.blur()

// Select
await locator.selectOption('value')
await locator.selectOption({ label: 'Option Label' })
await locator.selectOption(['val1', 'val2'])  // multi-select

// Checkbox & radio
await locator.check()
await locator.uncheck()
await locator.setChecked(true)

// File upload
await locator.setInputFiles('path/to/file.pdf')
await locator.setInputFiles(['file1.jpg', 'file2.jpg'])

// Drag and drop
await page.dragAndDrop('#source', '#target')
await locator.dragTo(page.locator('#target'))

// Hover
await locator.hover()

// Scroll
await locator.scrollIntoViewIfNeeded()
await page.mouse.wheel(0, 500)
```

---

## Assertions

All assertions auto-wait (retry until passing or timeout).

### Element state

```ts
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()
await expect(locator).toBeChecked()
await expect(locator).toBeFocused()
await expect(locator).toBeEmpty()
await expect(locator).toBeEditable()
await expect(locator).toBeAttached()
```

### Content assertions

```ts
await expect(locator).toHaveText('Exact text')
await expect(locator).toHaveText(/partial regex/)
await expect(locator).toContainText('substring')
await expect(locator).toHaveValue('input value')
await expect(locator).toHaveValues(['opt1', 'opt2'])  // multi-select
await expect(locator).toHaveAttribute('href', '/about')
await expect(locator).toHaveClass('active')
await expect(locator).toHaveCSS('color', 'rgb(0, 0, 0)')
await expect(locator).toHaveCount(5)
```

### Page assertions

```ts
await expect(page).toHaveURL('https://example.com/dashboard')
await expect(page).toHaveURL(/dashboard/)
await expect(page).toHaveTitle('Dashboard')
```

### Soft assertions (don't stop on failure)

```ts
await expect.soft(locator).toBeVisible();
await expect.soft(locator).toHaveText('Expected');
// Test continues; all soft failures reported at the end
```

---

## Navigation

```ts
await page.goto('/')
await page.goto('/login', { waitUntil: 'networkidle' })
await page.goBack()
await page.goForward()
await page.reload()

// Wait for navigation triggered by an action
await Promise.all([
  page.waitForURL('/dashboard'),
  page.getByRole('button', { name: 'Login' }).click(),
]);
```

---

## Waiting

Playwright auto-waits for most actions, but explicit waits are sometimes needed.

```ts
// Wait for element state
await locator.waitFor()                    // visible
await locator.waitFor({ state: 'hidden' })
await locator.waitFor({ state: 'attached' })
await locator.waitFor({ state: 'detached' })

// Wait for URL / navigation
await page.waitForURL('/success')
await page.waitForURL(/confirmation/)

// Wait for arbitrary condition
await page.waitForFunction(() => document.readyState === 'complete')
await page.waitForFunction(
  (selector) => document.querySelector(selector) !== null,
  '.my-element'
)

// Wait for response
const response = await page.waitForResponse('**/api/users');
const data = await response.json();

// Wait for request
await page.waitForRequest('**/api/submit');
```

---

## Network Interception

### Route & mock

```ts
// Block requests
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

// Mock API response
await page.route('**/api/users', route =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Alice' }]),
  })
);

// Modify request headers
await page.route('**/api/**', async route => {
  await route.continue({
    headers: { ...route.request().headers(), 'X-Test': 'true' },
  });
});

// Use HAR for playback
await page.routeFromHAR('mocks/api.har', { update: false });
```

### Monitor network activity

```ts
// Capture response
page.on('response', response => {
  if (response.url().includes('/api/')) {
    console.log(response.status(), response.url());
  }
});

// Assert a specific request was made
const requestPromise = page.waitForRequest('**/api/search');
await searchInput.fill('query');
const request = await requestPromise;
expect(request.postDataJSON()).toEqual({ q: 'query' });
```

---

## Authentication

### Session storage (fastest approach)

```ts
// auth.setup.ts — run once, save session
import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/dashboard');
  await page.context().storageState({ path: 'auth/user.json' });
});
```

```ts
// playwright.config.ts — reuse session across tests
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'authenticated',
      use: { storageState: 'auth/user.json' },
      dependencies: ['setup'],
    },
  ],
});
```

### API-based auth (skip the UI)

```ts
test.beforeEach(async ({ request, page }) => {
  const response = await request.post('/api/auth/login', {
    data: { email: 'user@example.com', password: 'secret' },
  });
  const { token } = await response.json();

  await page.context().addCookies([{
    name: 'auth-token',
    value: token,
    domain: 'localhost',
    path: '/',
  }]);
});
```

---

## Page Object Model

```ts
// pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}

// usage in tests
const login = new LoginPage(page);
await login.goto();
await login.login('user@example.com', 'secret');
await expect(page).toHaveURL('/dashboard');
```

---

## Fixtures

```ts
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

---

## Visual Testing (Screenshots)

```ts
// First run creates the baseline
await expect(page).toHaveScreenshot('homepage.png');
await expect(locator).toHaveScreenshot('button-hover.png');

// With options
await expect(page).toHaveScreenshot('dashboard.png', {
  maxDiffPixels: 100,
  threshold: 0.2,
  mask: [page.locator('.timestamp')],  // mask dynamic content
});

// Update snapshots
// npx playwright test --update-snapshots
```

---

## API Testing

```ts
import { test, expect } from '@playwright/test';

test('POST /api/users creates a user', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'Alice', email: 'alice@example.com' },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body).toMatchObject({ name: 'Alice' });
});

test('GET /api/users returns list', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();
  const users = await response.json();
  expect(users).toHaveLength(expect.any(Number));
});
```

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/login.spec.ts

# Run tests matching name
npx playwright test -g "login flow"

# Run in UI mode (interactive)
npx playwright test --ui

# Debug mode (step through)
npx playwright test --debug

# Headed mode (see the browser)
npx playwright test --headed

# Specific project (browser)
npx playwright test --project=chromium

# Last failed tests only
npx playwright test --last-failed

# Update visual snapshots
npx playwright test --update-snapshots

# Show HTML report
npx playwright show-report
```

---

## CI Configuration

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## Useful Snippets

```ts
// Intercept dialog (alert/confirm/prompt)
page.on('dialog', dialog => dialog.accept());
page.on('dialog', async dialog => {
  expect(dialog.message()).toBe('Are you sure?');
  await dialog.dismiss();
});

// New tab/popup handling
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  page.getByRole('link', { name: 'Open in new tab' }).click(),
]);
await newPage.waitForLoadState();

// Clipboard
await page.evaluate(() => navigator.clipboard.writeText('hello'));
const text = await page.evaluate(() => navigator.clipboard.readText());

// Local storage
await page.evaluate(() => localStorage.setItem('token', 'abc123'));
const token = await page.evaluate(() => localStorage.getItem('token'));

// Emulate timezone / locale
await page.emulateMedia({ colorScheme: 'dark' });
// or in config: use: { timezoneId: 'America/New_York', locale: 'en-US' }

// Slow down for debugging
// use: { launchOptions: { slowMo: 500 } }

// Console logs from page
page.on('console', msg => console.log('PAGE:', msg.text()));

// Trace viewer (record and inspect)
await context.tracing.start({ screenshots: true, snapshots: true });
// ... run your test
await context.tracing.stop({ path: 'trace.zip' });
// npx playwright show-trace trace.zip
```
