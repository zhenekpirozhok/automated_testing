import { BasePage } from "./BasePage";

export class CompletePage extends BasePage {
  message = this.page.locator(".complete-header");
}
