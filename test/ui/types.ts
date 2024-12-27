import { Page } from "@playwright/test";
import { UserFactory } from "./factories/userFactory";
import {
  LoginPage,
  HomePage,
  OrderPage,
  CheckoutPage,
  CompletePage,
  SummaryPage,
} from "./pages";

export type ExtendedTest = {
  page: Page;
  loginPage: LoginPage;
  homePage: HomePage;
  orderPage: OrderPage;
  checkoutPage: CheckoutPage;
  completePage: CompletePage;
  summaryPage: SummaryPage;
  userFactory: UserFactory;
};

export type User = {
  username: string;
  password: string;
};
