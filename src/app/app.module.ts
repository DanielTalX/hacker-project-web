import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AlertModule } from 'ngx-bootstrap/alert';

import { MatToolbarModule } from  '@angular/material/toolbar';
import { MatSidenavModule } from  '@angular/material/sidenav';
import { MatListModule } from  '@angular/material/list';
import { MatButtonModule } from  '@angular/material/button';
import { MatIconModule } from  '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './product/product-list.component';
import { ProductDetailComponent } from './product/product-detail.component';
import { ProductService } from './product/product.service';
import { CategoryService } from './category/category.service';
import { CategoryListComponent } from './category/category-list.component';
import { CategoryDetailComponent } from './category/category-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './security/login.component';
import { RegisterComponent } from './security/register.component';
import { SecurityService } from './security/security.service';
import { AuthGuard } from './security/auth.guard';
import { HttpInterceptorModule } from './security/http-interceptor.module';
import { HasClaimDirective } from './security/has-claim.directive';
import { SampleDeleteDialog } from './shared/sample-delete-dialog';
import { UserListComponent } from './users/user-list.component';
import { ClientUserService } from './users/client-user.service';
import { UserDetailsComponent } from './users/user-claims.component';
import { SampleAddDialog } from './shared/sample-add-dialog';
import { HackerEventListComponent } from './hakerEvents/hackerEvent-list.component';
import { HackerEventDetailComponent } from './hakerEvents/hackerEvent-detail.component';
import { HackerEventService } from './hakerEvents/hackerEvent.service';
import { SecurityInterceptorService } from './security/security-interceptor.service';
import { HttpResponseInterceptor } from './security/http-response.interceptor';
import { SampleSelectDialog } from './shared/sample-select-dialog';
import { ProfileComponent } from './users/profile.component';
import { PasswordTableComponent } from './password-strength/password-table.component';
import { VerifyAccountComponent } from './security/verify-account.component';
import { PasswordResetComponent } from './security/password-reset.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,

    LoginComponent,
    RegisterComponent,
    VerifyAccountComponent,
    PasswordResetComponent,

    HasClaimDirective,
    HackerEventListComponent,
    HackerEventDetailComponent,
    UserListComponent,
    UserDetailsComponent,
    ProfileComponent,
    PasswordTableComponent,
    SampleDeleteDialog,
    SampleAddDialog,
    SampleSelectDialog,

    ProductListComponent,
    ProductDetailComponent,
    CategoryListComponent,
    CategoryDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions(),
    AppRoutingModule,
    // HttpInterceptorModule,

    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,

    // AlertModule.forRoot(),
  ],
  providers: [ AuthGuard,
    HackerEventService, ProductService, CategoryService, SecurityService, ClientUserService,
    { provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true }
  ],
  entryComponents: [SampleDeleteDialog, SampleAddDialog, SampleSelectDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
