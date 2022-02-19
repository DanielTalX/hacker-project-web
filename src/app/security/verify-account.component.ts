import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUserAuth } from './app-user-auth';
import { SecurityService } from './security.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./login.component.css']
})
export class VerifyAccountComponent implements OnInit, OnDestroy {
  securityObject: AppUserAuth | null = null;

  form: FormGroup;
  loginInvalid = false;
  formSubmitAttempt = false;
  showSpinner = false;

  sub: Observable<Data> | null = null;
  requestId: string = "";
  requestCode: string = "";
  email: string = "";
  emailMessage: string = "";
  webUserMessage: string = "";


  constructor(private securityService: SecurityService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar) {

    this.form = this.fb.group({
      requestId: ['',  [Validators.required, Validators.minLength(10)]],
      requestCode: ['', [Validators.required, Validators.minLength(10)]]
    });

    console.log("1=", this.router.getCurrentNavigation()?.extras.state);
    this.requestId = this.router.getCurrentNavigation()?.extras.state?.requestId;
    this.requestCode = this.router.getCurrentNavigation()?.extras.state?.requestCode;
    this.email = this.router.getCurrentNavigation()?.extras.state?.email;
    this.emailMessage = this.router.getCurrentNavigation()?.extras.state?.emailMessage;
    this.webUserMessage = this.router.getCurrentNavigation()?.extras.state?.webUserMessage;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        this.showSpinner = true;
        const requestId = this.form.get('requestId')?.value;
        const requestCode = this.form.get('requestCode')?.value;

        this.securityService.verifyAccountCode(this.email,requestId, requestCode)
          .subscribe(resp => {
            this.showSpinner = false;
            this.openSnackBar("You have successfully verified!", "ok", true);
            this.router.navigateByUrl('/login');
          }, (err) => {
            // Initialize security object to display error message
            this.showSpinner = false;
            this.loginInvalid = true;
            this.openSnackBar("verified failed, please try again!", "ok", false);
          });
      } catch (err) {
        this.showSpinner = false;
        this.loginInvalid = true;
        this.openSnackBar("verified failed, please try again!", "ok", false);
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

  sendNewCode() {
    try {
      this.showSpinner = true;
      this.securityService.getVerifyAccountCode({ email: this.email })
        .subscribe( (resp: any) => {
          this.showSpinner = false;
          this.openSnackBar("An email with a verification code has been sent to you.", "ok", true);
          this.requestId = resp.requestId || "";
          this.requestCode = resp.requestCode || "";
          this.emailMessage = resp.emailMessage;
          this.webUserMessage = resp.webUserMessage;
        }, (err) => {
          // Initialize security object to display error message
          this.showSpinner = false;
          this.openSnackBar("Failed to send email, please try again later.", "ok", false);
        });
    } catch (err) {
      this.showSpinner = false;
      this.openSnackBar("Failed to send email, please try again later.", "ok", false);
    }
  }
}