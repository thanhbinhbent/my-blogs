---
title: "Playwright: Hướng dẫn kiểm thử E2E cho người mới bắt đầu"
description: "Giới thiệu toàn diện về Playwright — công cụ kiểm thử end-to-end mạnh mẽ nhất hiện nay. Cài đặt, viết test đầu tiên và các pattern cơ bản."
date: 2024-12-10
lang: vi
tags: ["playwright", "testing", "automation"]
slug: huong-dan-playwright
---

Playwright là framework kiểm thử end-to-end (E2E) do Microsoft phát triển, hỗ trợ Chromium, Firefox và WebKit. Đây là lựa chọn hàng đầu cho kiểm thử trình duyệt hiện đại nhờ API trực quan, tốc độ nhanh và độ tin cậy cao.

## Tại sao chọn Playwright?

Playwright nổi bật so với các công cụ khác vì:

- **Hỗ trợ đa trình duyệt** — chạy trên Chrome, Firefox, Safari chỉ với một bộ test
- **Auto-wait thông minh** — tự động chờ element sẵn sàng, không cần `waitForTimeout`
- **Isolation mạnh mẽ** — mỗi test có browser context riêng biệt, không ảnh hưởng nhau
- **Tracing & debugging** — ghi lại toàn bộ quá trình test để phân tích lỗi

## Cài đặt

```bash
# Khởi tạo Playwright trong project có sẵn
npm init playwright@latest

# Cài đặt thủ công
npm install -D @playwright/test
npx playwright install
```

## Viết test đầu tiên

```ts
// tests/home.spec.ts
import { test, expect } from '@playwright/test';

test('trang chủ hiển thị đúng', async ({ page }) => {
  await page.goto('/');

  // Kiểm tra tiêu đề
  await expect(page).toHaveTitle(/Blog/);

  // Kiểm tra navigation
  await expect(page.getByRole('navigation')).toBeVisible();

  // Kiểm tra có bài viết
  await expect(page.getByRole('article')).toHaveCount(expect.any(Number));
});

test('điều hướng đến trang bài viết', async ({ page }) => {
  await page.goto('/');

  // Click vào bài viết đầu tiên
  const firstPost = page.getByRole('listitem').first();
  const title = await firstPost.getByRole('heading').textContent();
  await firstPost.getByRole('link').click();

  // Xác nhận đã vào trang bài viết
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title!);
});
```

## Locators — Cách tìm phần tử đúng cách

Playwright khuyến khích dùng locator theo vai trò (role-based) thay vì CSS/XPath:

```ts
// ✅ Được khuyến dùng — theo role
page.getByRole('button', { name: 'Đăng nhập' })
page.getByRole('textbox', { name: 'Email' })
page.getByLabel('Mật khẩu')
page.getByTestId('submit-btn')

// ⚠️ Chỉ dùng khi cần thiết — CSS/XPath dễ hỏng khi UI thay đổi
page.locator('.btn-primary')
page.locator('[data-status="active"]')
```

## Assertions quan trọng

```ts
// Trạng thái element
await expect(locator).toBeVisible()
await expect(locator).toBeEnabled()
await expect(locator).toBeChecked()

// Nội dung
await expect(locator).toHaveText('Xin chào')
await expect(locator).toContainText('hello')
await expect(locator).toHaveValue('input value')

// Trang
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle('Trang chủ')
```

## Cấu hình cơ bản

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
});
```

## Chạy test

```bash
# Chạy tất cả test
npx playwright test

# Chạy với UI mode (khuyến dùng khi phát triển)
npx playwright test --ui

# Chạy test cụ thể
npx playwright test tests/home.spec.ts

# Xem báo cáo HTML
npx playwright show-report
```

## Bước tiếp theo

Sau khi nắm vững cơ bản, bạn có thể tìm hiểu thêm về:

- **Page Object Model** — tổ chức code test gọn gàng hơn
- **API Testing** — kiểm thử REST API trực tiếp trong Playwright
- **Authentication fixtures** — lưu session để tái sử dụng giữa các test
- **Visual testing** — so sánh screenshot để phát hiện thay đổi UI

Xem bài viết [Playwright Cheatsheet](/post/playwright-cheatsheet) (tiếng Anh) để có tài liệu tham khảo đầy đủ.
