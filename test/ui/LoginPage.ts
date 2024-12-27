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

export class LoginPage extends BasePage {
  usernameInput = this.page.locator("[data-test='username']");
  passwordInput = this.page.locator("[data-test='password']");
  loginButton = this.page.locator("[data-test='login-button']");
  errorMessage = this.page.locator('[data-test="error"]');

  async login(username = "standard_user", password = "secret_sauce") {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  appLogo = this.page.locator(".app_logo");
  cartBadge = this.page.locator(".shopping_cart_badge");
  shoppingCart = this.page.locator(".shopping_cart_link");

  async addItemToCart(itemName: string) {
    const addButtom = this.page.locator(
      `button[data-test=add-to-cart-${itemName}]`
    );
    await addButtom.click();
  }

  async removeItemFromCart(itemName: string) {
    const removeButton = this.page.locator(
      `button[data-test=remove-${itemName}]`
    );
    await removeButton.click();
  }
}

export class OrderPage extends BasePage {
  checkoutButton = this.page.locator('[data-test="checkout"]');
  cartItems = this.page.locator(".cart_item");
  cartList = this.page.locator(".cart_list");

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  firstNameInput = this.page.locator("[data-test='firstName']");
  lastNameInput = this.page.locator("[data-test='lastName']");
  postalCodeInput = this.page.locator("[data-test='postalCode']");
  continueButton = this.page.locator('[data-test="continue"]');
  finishButton = this.page.locator('[data-test="finish"]');

  async checkout(firstName = "John", lastName = "Doe", postalCode = "12345") {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}

export class SummaryPage extends BasePage {
  summaryTotal = this.page.locator(".summary_total_label");
  finishButton = this.page.locator('[data-test="finish"]');

  async finish() {
    await this.finishButton.click();
  }
}

export class CompletePage extends BasePage {
  message = this.page.locator(".complete-header");
}
