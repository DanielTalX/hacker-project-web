import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUserAuth } from './app-user-auth';
import { SecurityService } from './security.service';
import { PasswordMeter, DetailsRow } from '../password-strength/PasswordMeter';
import { BehaviorSubject } from 'rxjs';
import { password3Validator, passwordConfirmValidator } from '../password-strength/password-validator.directive';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./login.component.css']
})
export class PasswordResetComponent implements OnInit {
  securityObject: AppUserAuth | null = null;

  form: FormGroup;
  loginInvalid = false;
  formSubmitAttempt = false;
  returnUrl: string;
  showSpinner = false;

  passwordMeter: PasswordMeter = new PasswordMeter();
  detailsRows$: BehaviorSubject<DetailsRow[]> = new BehaviorSubject<DetailsRow[]>([]);
  password: string = "";
  passwordStrength: number = 0;
  complexity: string = "";
  showDetails: boolean = false;

  email: string = "";
  requestId: string = "";
  requestCode: string = "";
  emailMessage: string = "";
  webUserMessage: string = "";

  constructor(private securityService: SecurityService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar) {
    this.returnUrl = '/dashbord';

    this.form = this.fb.group({
      requestId: ['', [Validators.required, Validators.minLength(10)]],
      requestCode: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      password2: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      passwordStrength: [this.passwordStrength, [Validators.required, Validators.min(PasswordMeter.minPasswordScoreRequired)]],
      passwordRequirements: [0, [Validators.required]]
    });

    let c1 = this.form.get("passwordStrength") as FormControl;
    let c2 = this.form.get("passwordRequirements") as FormControl;
    this.form.get("password")!.setValidators([
      Validators.required, Validators.minLength(10), Validators.maxLength(100),
      password3Validator(c1, c2)]);

    this.form.get("password2")!.setValidators([
      Validators.required, Validators.minLength(10), Validators.maxLength(100),
      passwordConfirmValidator(this.form.get("password") as FormControl)]);
  }

  async ngOnInit(): Promise<void> { }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        this.showSpinner = true;
        let register = {
          requestId: this.form.get('requestId')?.value,
          requestCode: this.form.get('requestCode')?.value,
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value,
          password2: this.form.get('password')?.value,
        }

        this.securityService.verifyPasswordReset(register)
          .subscribe((resp: any) => {
            this.showSpinner = false;
            this.openSnackBar("You have successfully reset your password!", "ok", true);
            this.router.navigateByUrl('/login');
          },
            () => { //error
              this.showSpinner = false;
              this.openSnackBar("Reset password failed, please try again!", "ok", false);
            });
      } catch (err) {
        this.showSpinner = false;
        this.loginInvalid = true;
        this.openSnackBar("Reset password failed, please try again!", "ok", false);
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

  // calculate strength based on password and calculation mode
  calculateStrength(event: Event) {
    const pwd = (event.target as HTMLInputElement).value;
    this.passwordMeter.setPassword(pwd);
    this.passwordStrength = this.passwordMeter.getPasswordScore();
    const requirements = this.passwordMeter.getPasswordRequirements();
    this.form.get("passwordRequirements")?.setValue(requirements);
    this.form.get("passwordStrength")?.setValue(this.passwordStrength);
    this.form.get("password")?.setValue(pwd);
    this.complexity = this.passwordMeter.getComplexity();
    const detailsRows = this.passwordMeter.getStrengthDetails();
    this.detailsRows$.next(detailsRows);
    this.password = pwd;

    if (this.form.get("password2")?.value)
      this.form.get("password2")?.setValue(this.form.get("password2")?.value);
  }

  sendNewCode() {
    try {
      this.showSpinner = true;
      this.securityService.getPasswordResetCode({ email: this.email })
        .subscribe((resp: any) => {
          this.showSpinner = false;
          this.openSnackBar("An email with a verification code has been sent to you.", "ok", true);
          this.requestId = resp.requestId || "";
          this.requestCode = resp.requestCode || "";
          this.emailMessage = resp.emailMessage;
          this.webUserMessage = resp.webUserMessage;
        }, (err) => {
          // Initialize security object to display error message
          this.showSpinner = false;
          this.openSnackBar("There was a problem sending a verification email, please try again later.", "ok", false);
        });
    } catch (err) {
      this.showSpinner = false;
      this.openSnackBar("There was a problem sending a verification email, please try again later.", "ok", false);
    }
  }

}