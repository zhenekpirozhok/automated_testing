import { test, expect, Page } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com/";

test.describe("Sauce Demo Application Tests", () => {
  // Common login function
  const login = async (
    page: Page,
    username = "standard_user",
    password = "secret_sauce"
  ) => {
    await page.goto(BASE_URL);
    const usernameInput = page.locator("[data-test='username']");
    await usernameInput.fill(username);
    const passwordInput = page.locator("[data-test='password']");
    await passwordInput.fill(password);
    const loginButton = page.locator("[data-test='login-button']");
    await loginButton.click();
  };

  test("Test Case 1: Verify User Login", async ({ page }) => {
    await login(page);
    const appLogo = page.locator(".app_logo");
    await expect(appLogo).toHaveText("Swag Labs");
  });

  test("Test Case 2: Verify Adding Item to Cart", async ({ page }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    const cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    await page.click(".shopping_cart_link");
    const cartItems = page.locator(".cart_item");
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems).toContainText("Sauce Labs Backpack");
  });

  test("Test Case 3: Verify Adding Multiple Items to Cart", async ({
    page,
  }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    const cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(cartBadge).toHaveText("2");
    await page.click(".shopping_cart_link");
    const cartItems = page.locator(".cart_item");
    await expect(cartItems).toHaveCount(2);
    const item1 = cartItems.locator("[data-test='item-4-title-link']");
    await expect(item1).toContainText("Sauce Labs Backpack");
    const item2 = cartItems.locator("[data-test='item-0-title-link']");
    await expect(item2).toContainText("Sauce Labs Bike Light");
  });

  test("Test Case 4: Verify Removing Item from Cart", async ({ page }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click(".shopping_cart_link");
    const cartItems = page.locator(".cart_item");
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems).toContainText("Sauce Labs Backpack");
    await page.click('button[data-test="remove-sauce-labs-backpack"]');
    await expect(cartItems).toHaveCount(0);
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
  });

  test("Test Case 5: Verify Checkout Process", async ({ page }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click(".shopping_cart_link");
    await page.click('button[data-test="checkout"]');
    await page.fill("[data-test='firstName']", "John");
    await page.fill("[data-test='lastName']", "Dou");
    await page.fill("[data-test='postalCode']", "12345");
    await page.click('[data-test="continue"]');
    const summaryTotal = page.locator(".summary_total_label");
    await expect(summaryTotal).toHaveText("Total: $32.39");
    await page.click('[data-test="finish"]');
    const completeHeader = page.locator(".complete-header");
    await expect(completeHeader).toHaveText("Thank you for your order!");
  });

  test("Test Case 6: Verify Checkout Process for Multiple Items", async ({
    page,
  }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click(".shopping_cart_link");
    await expect(page.locator(".cart_item")).toHaveCount(2);
    await page.click('[data-test="checkout"]');
    await page.fill("[data-test='firstName']", "John");
    await page.fill("[data-test='lastName']", "Dou");
    await page.fill("[data-test='postalCode']", "12345");
    await page.click('[data-test="continue"]');
    const summaryTotal = page.locator(".summary_total_label");
    await expect(summaryTotal).toHaveText("Total: $43.18");
    await page.click('[data-test="finish"]');
    const completeHeader = page.locator(".complete-header");
    await expect(completeHeader).toHaveText("Thank you for your order!");
  });

  test("Test Case 7: Verify Non-Existing User Is Not Able to Login", async ({
    page,
  }) => {
    await login(page, "standard_user_123", "secret_sauce_123");
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("Test Case 8: Verify User is Able to Logout", async ({ page }) => {
    await login(page);
    await page.click("#react-burger-menu-btn");
    await expect(page.locator(".bm-menu")).toBeVisible();
    await page.click("#logout_sidebar_link");
    await expect(page.locator("#user-name")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#login-button")).toBeVisible();
  });
});
