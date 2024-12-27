import { BasePage } from "./BasePage";

export class OrderPage extends BasePage {
  checkoutButton = this.page.locator('[data-test="checkout"]');
  cartItems = this.page.locator(".cart_item");
  cartList = this.page.locator(".cart_list");

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}
