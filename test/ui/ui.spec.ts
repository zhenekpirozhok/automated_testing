import { expect } from "@playwright/test";

import { extendedTest } from "./fixtures/extendedTest";

const BASE_URL = "https://www.saucedemo.com/";

extendedTest.describe("Sauce Demo Application Tests", () => {
  extendedTest.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  extendedTest(
    "Test Case 1: Verify User Login",
    async ({ loginPage, homePage, userFactory }) => {
      const user = userFactory.validUser;
      await loginPage.login(user.username, user.password);
      await expect(homePage.appLogo).toHaveText("Swag Labs");
    }
  );

  extendedTest(
    "Test Case 2: Verify Adding Item to Cart",
    async ({ loginPage, homePage, orderPage, userFactory }) => {
      const user = userFactory.validUser;
      await loginPage.login(user.username, user.password);
      await homePage.addItemToCart("sauce-labs-backpack");
      await expect(homePage.cartBadge).toHaveText("1");
      await homePage.shoppingCart.click();
      await expect(orderPage.cartItems).toHaveCount(1);
      await expect(orderPage.cartList).toContainText("Sauce Labs Backpack");
    }
  );

  extendedTest(
    "Test Case 3: Verify Adding Multiple Items to Cart",
    async ({ loginPage, homePage, orderPage, userFactory }) => {
      const user = userFactory.validUser;
      await loginPage.login(user.username, user.password);

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
    async ({ loginPage, homePage, orderPage, userFactory }) => {
      const user = userFactory.validUser;
      await loginPage.login(user.username, user.password);

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
      userFactory,
    }) => {
      const user = userFactory.validUser;
      await loginPage.login(user.username, user.password);

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
      userFactory,
    }) => {
      const user = userFactory.validUser;
      await loginPage.login(user.username, user.password);

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
    async ({ loginPage, userFactory }) => {
      const user = userFactory.invalidUser;
      await loginPage.login(user.username, user.password);

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(
        "Epic sadface: Username and password do not match any user in this service"
      );
    }
  );

  extendedTest(
    "Test Case 8: Verify User is Able to Logout",
    async ({ loginPage, userFactory }) => {
      const user = userFactory.validUser;
      await loginPage.login(user.username, user.password);
      await loginPage.openBurgerMenu();
      await expect(loginPage.burgerMenu).toBeVisible();
      await loginPage.logoutButton.click();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    }
  );
});
