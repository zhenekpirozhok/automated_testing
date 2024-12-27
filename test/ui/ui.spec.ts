import { test, expect, Page } from "@playwright/test";

import {
  LoginPage,
  HomePage,
  OrderPage,
  CheckoutPage,
  CompletePage,
  SummaryPage,
} from "./LoginPage";
import { log } from "console";

const BASE_URL = "https://www.saucedemo.com/";

type ExtendedTest = {
  page: Page;
  loginPage: LoginPage;
  homePage: HomePage;
  orderPage: OrderPage;
  checkoutPage: CheckoutPage;
  completePage: CompletePage;
  summaryPage: SummaryPage;
};

const extendedTest = test.extend<ExtendedTest>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  orderPage: async ({ page }, use) => {
    await use(new OrderPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  completePage: async ({ page }, use) => {
    await use(new CompletePage(page));
  },
  summaryPage: async ({ page }, use) => {
    await use(new SummaryPage(page));
  },
});

extendedTest.describe("Sauce Demo Application Tests", () => {
  extendedTest.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  extendedTest(
    "Test Case 1: Verify User Login",
    async ({ loginPage, homePage }) => {
      await loginPage.login();
      await expect(homePage.appLogo).toHaveText("Swag Labs");
    }
  );

  extendedTest(
    "Test Case 2: Verify Adding Item to Cart",
    async ({ loginPage, homePage, orderPage }) => {
      await loginPage.login();
      await homePage.addItemToCart("sauce-labs-backpack");
      await expect(homePage.cartBadge).toHaveText("1");
      await homePage.shoppingCart.click();
      await expect(orderPage.cartItems).toHaveCount(1);
      await expect(orderPage.cartList).toContainText("Sauce Labs Backpack");
    }
  );

  extendedTest(
    "Test Case 3: Verify Adding Multiple Items to Cart",
    async ({ loginPage, homePage, orderPage }) => {
      await loginPage.login();

      await homePage.addItemToCart("sauce-labs-backpack");
      await expect(homePage.cartBadge).toHaveText("1");

      await homePage.addItemToCart("sauce-labs-bike-light");
      await expect(homePage.cartBadge).toHaveText("2");

      await homePage.shoppingCart.click();
      await expect(orderPage.cartItems).toHaveCount(2);
      await expect(orderPage.cartList).toContainText("Sauce Labs Backpack");
      await expect(orderPage.cartList).toContainText("Sauce Labs Bike Light");
    }
  );

  extendedTest(
    "Test Case 4: Verify Removing Item from Cart",
    async ({ loginPage, homePage, orderPage }) => {
      await loginPage.login();

      await homePage.addItemToCart("sauce-labs-backpack");
      await homePage.shoppingCart.click();
      await expect(orderPage.cartItems).toHaveCount(1);
      await expect(orderPage.cartList).toContainText("Sauce Labs Backpack");

      await homePage.removeItemFromCart("sauce-labs-backpack");
      await expect(orderPage.cartItems).toHaveCount(0);
      await expect(homePage.cartBadge).not.toBeVisible();
    }
  );

  extendedTest(
    "Test Case 5: Verify Checkout Process",
    async ({
      loginPage,
      homePage,
      orderPage,
      checkoutPage,
      summaryPage,
      completePage,
    }) => {
      await loginPage.login();

      await homePage.addItemToCart("sauce-labs-backpack");

      await homePage.shoppingCart.click();
      await orderPage.goToCheckout();
      await checkoutPage.checkout();

      await expect(summaryPage.summaryTotal).toHaveText("Total: $32.39");
      await summaryPage.finish();

      await expect(completePage.message).toHaveText(
        "Thank you for your order!"
      );
    }
  );

  extendedTest(
    "Test Case 6: Verify Checkout Process for Multiple Items",
    async ({
      loginPage,
      homePage,
      orderPage,
      checkoutPage,
      summaryPage,
      completePage,
    }) => {
      await loginPage.login();

      await homePage.addItemToCart("sauce-labs-backpack");
      await homePage.addItemToCart("sauce-labs-bike-light");

      await homePage.shoppingCart.click();
      await expect(orderPage.cartItems).toHaveCount(2);

      await orderPage.goToCheckout();
      await checkoutPage.checkout();

      await expect(summaryPage.summaryTotal).toHaveText("Total: $43.18");

      await summaryPage.finish();
      await expect(completePage.message).toHaveText(
        "Thank you for your order!"
      );
    }
  );

  extendedTest(
    "Test Case 7: Verify Non-Existing User Is Not Able to Login",
    async ({ loginPage }) => {
      await loginPage.login("standard_user_123", "secret_sauce_123");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(
        "Epic sadface: Username and password do not match any user in this service"
      );
    }
  );

  extendedTest(
    "Test Case 8: Verify User is Able to Logout",
    async ({ loginPage }) => {
      await loginPage.login();
      await loginPage.openBurgerMenu();
      await expect(loginPage.burgerMenu).toBeVisible();
      await loginPage.logoutButton.click();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    }
  );
});
