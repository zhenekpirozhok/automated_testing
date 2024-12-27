import { Locator, Page } from "@playwright/test";

export class BasePage {
  protected page: Page;
  burgerMenu: Locator;
  logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenu = this.page.locator(".bm-menu");
    this.logoutButton = this.page.locator("#logout_sidebar_link");
  }

  async openBurgerMenu() {
    await this.page.locator("#react-burger-menu-btn").click();
  }
}
