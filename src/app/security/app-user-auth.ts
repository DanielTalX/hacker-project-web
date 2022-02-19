import { AppUserClaim } from "./app-user-claim";

export class AppUserAuth {
  firstName: string = "";
  lastName: string = "";
  username: string = "";
  email: string = "";
  bearerToken: string = "";
  accessToken: string = "";
  isAuthenticated: boolean = false;
  role: string = "";
  status: string = "";
  claims: AppUserClaim[] = [];
}
