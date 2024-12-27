import { User } from "../types";

export class UserFactory {
  get validUser(): User {
    return { username: "standard_user", password: "secret_sauce" };
  }

  get invalidUser(): User {
    return { username: "standard_user123", password: "secret_sauce123" };
  }
}
