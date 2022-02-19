import { AppUserClaim } from "../security/app-user-claim";

export class ClientUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  claims: AppUserClaim[] = [];

  public constructor(init?: Partial<ClientUser>) {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.username = "";
    this.email = "";
    this.role = "";
    this.claims = [];
    Object.assign(this, init);
  }
}
