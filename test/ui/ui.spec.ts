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
    const addButton = page.locator(
      'button[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    await addButton.click();
    const cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    await page.locator(".shopping_cart_link").click();
    const cartItems = page.locator(".cart_item");
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems).toContainText("Sauce Labs Backpack");
  });

  test("Test Case 3: Verify Adding Multiple Items to Cart", async ({
    page,
  }) => {
    await login(page);
    const addButton1 = page.locator(
      'button[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    await addButton1.click();
    const cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    const addButton2 = page.locator(
      'button[data-test="add-to-cart-sauce-labs-bike-light"]'
    );
    await addButton2.click();
    await expect(cartBadge).toHaveText("2");
    await page.locator(".shopping_cart_link").click();
    const cartItems = page.locator(".cart_item");
    await expect(cartItems).toHaveCount(2);
    const item1 = cartItems.locator("[data-test='item-4-title-link']");
    await expect(item1).toContainText("Sauce Labs Backpack");
    const item2 = cartItems.locator("[data-test='item-0-title-link']");
    await expect(item2).toContainText("Sauce Labs Bike Light");
  });

  test("Test Case 4: Verify Removing Item from Cart", async ({ page }) => {
    await login(page);
    const addButton = page.locator(
      'button[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    await addButton.click();
    await page.locator(".shopping_cart_link").click();
    const cartItems = page.locator(".cart_item");
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems).toContainText("Sauce Labs Backpack");

    const removeButton = page.locator(
      'button[data-test="remove-sauce-labs-backpack"]'
    );
    await removeButton.click();
    await expect(cartItems).toHaveCount(0);
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
  });

  test("Test Case 5: Verify Checkout Process", async ({ page }) => {
    await login(page);
    const addButton = page.locator(
      'button[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    await addButton.click();
    await page.locator(".shopping_cart_link").click();
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    const firstNameInput = page.locator("[data-test='firstName']");
    await firstNameInput.fill("John");
    const lastNameInput = page.locator("[data-test='lastName']");
    await lastNameInput.fill("Dou");
    const postalCodeInput = page.locator("[data-test='postalCode']");
    await postalCodeInput.fill("12345");
    const continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();

    const summaryTotal = page.locator(".summary_total_label");
    await expect(summaryTotal).toHaveText("Total: $32.39");
    await page.locator('[data-test="finish"]').click();
    const completeHeader = page.locator(".complete-header");
    await expect(completeHeader).toHaveText("Thank you for your order!");
  });

  test("Test Case 6: Verify Checkout Process for Multiple Items", async ({
    page,
  }) => {
    await login(page);
    const addButton1 = page.locator(
      'button[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    await addButton1.click();
    const addButton2 = page.locator(
      'button[data-test="add-to-cart-sauce-labs-bike-light"]'
    );
    await addButton2.click();

    await page.locator(".shopping_cart_link").click();
    await expect(page.locator(".cart_item")).toHaveCount(2);
    await page.locator('[data-test="checkout"]').click();
    const firstNameInput = page.locator("[data-test='firstName']");
    await firstNameInput.fill("John");
    const lastNameInput = page.locator("[data-test='lastName']");
    await lastNameInput.fill("Dou");
    const postalCodeInput = page.locator("[data-test='postalCode']");
    await postalCodeInput.fill("12345");

    await page.locator('[data-test="continue"]').click();
    const summaryTotal = page.locator(".summary_total_label");
    await expect(summaryTotal).toHaveText("Total: $43.18");
    await page.locator('[data-test="finish"]').click();
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
    await page.locator("#react-burger-menu-btn").click();
    await expect(page.locator(".bm-menu")).toBeVisible();
    await page.locator("#logout_sidebar_link").click();
    await expect(page.locator("#user-name")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#login-button")).toBeVisible();
  });
});
