import { BasePage } from "./BasePage";

export class SummaryPage extends BasePage {
  summaryTotal = this.page.locator(".summary_total_label");
  finishButton = this.page.locator('[data-test="finish"]');

  async finish() {
    await this.finishButton.click();
  }
}
