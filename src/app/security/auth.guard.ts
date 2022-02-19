import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private securityService: SecurityService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Get property name on security object to check
    const claimType: string | string[] = next.data["claimType"];
    const roleType: string | string[] = next.data["roleType"];
    const userStatus: string = next.data["userStatus"];
    const isAuthenticated: boolean = next.data["isAuthenticated"];

    if (this.securityService.securityObject.isAuthenticated == isAuthenticated) {
      if (userStatus && this.securityService.securityObject.status != userStatus) {
        this.router.navigate(['dashboard']);
        return false;
      }
      if (roleType && !this.securityService.hasRole(roleType)) {
        this.router.navigate(['dashboard']);
        return false;
      }
      if (claimType && !this.securityService.hasClaim(claimType)) {
        this.router.navigate(['dashboard']);
        return false;
      }
      return true;
    } else {
      if (isAuthenticated) {
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      } else {
        this.router.navigate(['dashboard']);
      }
      return false;
    }
  }
}
