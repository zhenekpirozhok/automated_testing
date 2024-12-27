import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
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
