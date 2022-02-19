import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from './app-user';
import { AppUserAuth } from './app-user-auth';
import { UserStatusTypes } from './ClaimsTypes';
import { SecurityService } from './security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  securityObject: AppUserAuth | null = null;

  form: FormGroup;
  loginInvalid = false;
  formSubmitAttempt = false;
  returnUrl: string;
  showSpinner = false;

  constructor(private securityService: SecurityService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar) {
    this.returnUrl = '/dashbord';

    this.form = this.fb.group({
      // username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]]
    });
  }

  async ngOnInit(): Promise<void> {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.route.snapshot.queryParams.returnUrl || '/dashbord';
    if (this.securityObject?.isAuthenticated)
      await this.router.navigate([this.returnUrl]);
    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  login() { }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        this.showSpinner = true;
        // const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;
        const email = this.form.get('email')?.value;
        // await this.authService.login(username, password);
        this.securityService.login({ password, email })
          .subscribe(resp => {
            this.showSpinner = false;
            const custom = (resp as any);
            if (resp.status == UserStatusTypes.Pending) {
              this.openSnackBar(custom.message, "ok", true);
              this.router.navigateByUrl('/verify-account',
                {
                  state: { email: email } // userId: resp.userId, code: resp.code,
                });
            }
            else if (!!custom.passwordExpired) {
              this.securityObject = resp;
              this.openSnackBar("Your password has expired, please change your password.", "ok", true);
              this.router.navigateByUrl('/profile');
            }
            else if (resp.isAuthenticated) {
              this.securityObject = resp;
              this.openSnackBar("You have successfully login!", "ok", true);
              if (this.returnUrl) {
                this.router.navigateByUrl(this.returnUrl);
              }
            }
            else {
              this.loginInvalid = true;
              this.openSnackBar("Login failed, please try again!", "ok", false);
            }
          }, (err) => {
            // Initialize security object to display error message
            this.showSpinner = false;
            this.securityObject = new AppUserAuth();
            this.loginInvalid = true;
            this.openSnackBar("Login failed, please try again!", "ok", false);
          });
      } catch (err) {
        this.showSpinner = false;
        this.loginInvalid = true;
        this.openSnackBar("Login failed, please try again!", "ok", false);
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  private openSnackBar(message: string, action: string, isSuccess?: boolean) {
    let color = isSuccess ? ('blue-snackbar') : ('red-snackbar');
    let durationInSeconds = 3;
    this._snackBar.open(message, action, {
      duration: durationInSeconds * 1000,
      panelClass: [color]
    });
  }
}