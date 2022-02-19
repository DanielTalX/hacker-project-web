import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HackerEventListComponent } from "./hakerEvents/hackerEvent-list.component";
import { HackerEventDetailComponent } from "./hakerEvents/hackerEvent-detail.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './security/login.component';
import { AuthGuard } from './security/auth.guard';
import { UserListComponent } from './users/user-list.component';
import { UserDetailsComponent } from './users/user-claims.component';
import { RegisterComponent } from './security/register.component';
import { ProfileComponent } from './users/profile.component';
import { VerifyAccountComponent } from './security/verify-account.component';
import { PasswordResetComponent } from './security/password-reset.component';
import { ClaimsTypes, RoleTypes, UserStatusTypes } from './security/ClaimsTypes';

import { CategoryListComponent } from './category/category-list.component';
import { ProductListComponent } from "./product/product-list.component";
import { ProductDetailComponent } from './product/product-detail.component';
import { CategoryDetailComponent } from './category/category-detail.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: null,
      userStatus: null,
      isAuthenticated: false
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: null,
      userStatus: null,
      isAuthenticated: false
    }
  },
  {
    path: 'verify-account',
    component: VerifyAccountComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: null,
      userStatus: null,
      isAuthenticated: false
    }
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: null,
      userStatus: null,
      isAuthenticated: false
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: [RoleTypes.User, RoleTypes.Supervisor, RoleTypes.Admin],
      userStatus: UserStatusTypes.Active,
      isAuthenticated: true
    }
  },
  {
    path: 'hackerEvents',
    component: HackerEventListComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: [RoleTypes.User, RoleTypes.Supervisor, RoleTypes.Admin],
      userStatus: UserStatusTypes.Active,
      isAuthenticated: true
    }
  },
  {
    path: 'hackerEventDetail/:id',
    component: HackerEventDetailComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: [RoleTypes.User, RoleTypes.Supervisor, RoleTypes.Admin],
      userStatus: UserStatusTypes.Active,
      isAuthenticated: true
    }
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    // data: { claimType: ClaimsTypes.FullAccessUsers }
    data: {
      claimType: null,
      roleType: [RoleTypes.Supervisor, RoleTypes.Admin],
      userStatus: UserStatusTypes.Active,
      isAuthenticated: true
    }
  },
  {
    path: 'user-details',
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      claimType: null,
      roleType: [RoleTypes.Supervisor, RoleTypes.Admin],
      userStatus: UserStatusTypes.Active,
      isAuthenticated: true
    }
  },
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: '**', component: DashboardComponent
  }

  /**
   * {
    path: 'products',
    component: ProductListComponent,
    canActivate: [AuthGuard],
    data: { claimType: ClaimsTypes.AccessProducts }
  },
   * {
    path: 'productDetail/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard],
    data: { claimType: ClaimsTypes.AccessProducts }
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { claimType: ClaimsTypes.AccessCategories }
  },
  {
    path: 'categoryDetail/:id',
    component: CategoryDetailComponent,
    canActivate: [AuthGuard],
    data: { claimType: ClaimsTypes.AccessCategories }
  },
   */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
