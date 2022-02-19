import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppUserAuth } from './app-user-auth';
import { AppUser } from './app-user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserStatusTypes } from './ClaimsTypes';

const API_URL = environment.BASE_URL + "auth/";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': 'http://localhost:4200',
    // 'Access-Control-Allow-Credentials': 'true',
    // 'Access-Control-Allow-Headers': 'Content-Type'
  })
};

@Injectable()
export class SecurityService {
  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient) { }

  check(): Observable<void> {
    return this.http.get<void>(API_URL + "check", httpOptions).pipe(
      tap(resp => {
        // console.log("check = ", resp);
      }));
  }


  login(entity: {}): Observable<AppUserAuth> {
    // Initialize security object
    this.resetSecurityObject();

    return this.http.post<AppUserAuth>(API_URL + "login",
      entity, httpOptions).pipe(
        tap(resp => {
          // console.log("http login - resp = ", resp)
          if (resp.status == UserStatusTypes.Active) {
            // Use object assign to update the current object
            // NOTE: Don't create a new AppUserAuth object
            //       because that destroys all references to object
            Object.assign(this.securityObject, resp);
            // Store into local storage
            localStorage.setItem("bearerToken", this.securityObject.bearerToken);
          }
        },
          error => console.log("http login - error = ", error)
        ));
  }

  register(entity: {}): Observable<{}> {
    // Initialize security object
    this.resetSecurityObject();

    return this.http.post<AppUserAuth>(API_URL + "register",
      entity, httpOptions);
  }

  logout(): Observable<void> {
    this.resetSecurityObject();
    return this.http.get<void>(API_URL + "logout", httpOptions);
  }

  verifyAccountCode(email: string, requestId: string, requestCode: string): Observable<{}> {
    return this.http.get<{}>(API_URL + `verification/verify-account/${email}/${requestId}/${requestCode}`,
      httpOptions).pipe(tap(resp => {
        console.log("check = ", resp);
      }));
  }

  getVerifyAccountCode(entity: {}): Observable<{}> {
    return this.http.post<AppUserAuth>(API_URL + "verification/get-verify-account-code",
      entity, httpOptions);
  }

  getPasswordResetCode(entity: {}): Observable<{}> {
    return this.http.post<AppUserAuth>(API_URL + "password-reset/get-code",
      entity, httpOptions);
  }

  verifyPasswordReset(entity: {}): Observable<{}> {
    return this.http.post<AppUserAuth>(API_URL + "password-reset/verify",
      entity, httpOptions);
  }

  updateUserProfile(entity: {}): Observable<any> {
    return this.http.post<{}>(environment.BASE_URL + "user/UpdateUserProfile",
      entity, httpOptions).pipe(
        tap((resp: any) => {
          if (resp) {
            this.securityObject.firstName = resp.firstName;
            this.securityObject.lastName = resp.lastName;
            this.securityObject.username = resp.username;
          }
        }));
  }

  updateUserEmail(entity: {}): Observable<{}> {
    return this.http.post<{}>(environment.BASE_URL + "user/UpdateUserEmail",
      entity, httpOptions).pipe(
        tap((resp: any) => {
          if (resp) {
            this.securityObject.email = resp.email;
          }
        }));
  }

  deleteUserAccount(entity: {}): Observable<{}> {
    return this.http.post<{}>(environment.BASE_URL + "user/DeleteUserAccount",
      entity, httpOptions);
  }

  updateUserPassword(entity: {}): Observable<AppUserAuth> {
    return this.http.post<AppUserAuth>(environment.BASE_URL + "user/updateUserPassword",
      entity, httpOptions);
  }

  resetSecurityObject(): void {
    this.securityObject.firstName = "";
    this.securityObject.lastName = "";
    this.securityObject.username = "";
    this.securityObject.email = "";
    this.securityObject.accessToken = "";
    this.securityObject.bearerToken = "";
    this.securityObject.isAuthenticated = false;
    this.securityObject.role = "";
    this.securityObject.claims = [];

    localStorage.removeItem("bearerToken");
  }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  hasClaim(claimType: any, claimValue?: any) {
    let ret: boolean = false;

    // See if an array of values was passed in.
    if (typeof claimType === "string") {
      ret = this.isClaimValid(claimType, claimValue);
    }
    else {
      let claims: string[] = claimType;
      if (claims) {
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }

    return ret;
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret: boolean = false;
    let auth: AppUserAuth | null = null;

    // Retrieve security object
    auth = this.securityObject;
    if (auth) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(":") >= 0) {
        let words: string[] = claimType.split(":");
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      }
      else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : "true";
      }
      // Attempt to find the claim
      ret = auth.claims.find(c =>
        c.claimType.toLowerCase() == claimType &&
        c.claimValue == claimValue) != null;
    }

    return ret;
  }

  
  hasRole(role: any) {

    let ret: boolean = false;

    // See if an array of values was passed in.
    if (typeof role === "string") {
      ret = this.isRoleValid(role);
    }
    else {
      let claims: string[] = role;
      if (claims) {
        for (let index = 0; index < claims.length; index++) {
          ret = this.isRoleValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }

    return ret;
  }

  private isRoleValid(role: string): boolean {
    let ret: boolean = false;
    let auth: AppUserAuth | null = null;

    // Retrieve security object
    auth = this.securityObject;
    role = role.toLowerCase();
    // Attempt to find the claim
    ret = auth.role == role.toLowerCase();

    return ret;
  }
}
