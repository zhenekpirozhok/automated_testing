import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
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
