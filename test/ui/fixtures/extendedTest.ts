import test from "@playwright/test";
import { ExtendedTest } from "../types";

import {
  LoginPage,
  HomePage,
  OrderPage,
  CheckoutPage,
  CompletePage,
  SummaryPage,
} from "../pages";

import { UserFactory } from "../factories/userFactory";

export const extendedTest = test.extend<ExtendedTest>({
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
  userFactory: async ({ page }, use) => {
    await use(new UserFactory());
  },
});
