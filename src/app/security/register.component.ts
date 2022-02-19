import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from './app-user';
import { AppUserAuth } from './app-user-auth';
import { SecurityService } from './security.service';
import { PasswordMeter, DetailsRow } from '../password-strength/PasswordMeter';
import { BehaviorSubject } from 'rxjs';
import { password3Validator, passwordConfirmValidator } from '../password-strength/password-validator.directive';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  user: AppUser = new AppUser();
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
  // @Output() voted = new EventEmitter<string>();

  constructor(private securityService: SecurityService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar) {
    this.returnUrl = '/dashbord';

    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
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

  async ngOnInit(): Promise<void> {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.route.snapshot.queryParams.returnUrl || '/dashbord';
    if (this.securityObject?.isAuthenticated)
      await this.router.navigate([this.returnUrl]);
    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  private mapFormToRegister(): any{
    return {
      firstName: this.form.get('firstName')?.value || "",
      lastName: this.form.get('lastName')?.value || "",
      username: this.form.get('username')?.value || "",
      email: this.form.get('email')?.value || "",
      password: this.form.get('password')?.value || "",
      password2: this.form.get('password')?.value || "",
    }
  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        this.showSpinner = true;
        let register = this.mapFormToRegister();

        this.securityService.register(register)
          .subscribe( (resp: any) => {
            this.showSpinner = false;
            this.openSnackBar("You have successfully registered!", "ok", true);
            this.router.navigateByUrl('/verify-account',
              {
                state: { requestId: resp.requestId,
                  requestCode: resp.requestCode, email: register.email,
                  emailMessage: resp.emailMessage, webUserMessage: resp.webUserMessage,}
              });
          },
            (err) => { //error
              this.showSpinner = false;
              // Initialize security object to display error message
              this.securityObject = new AppUserAuth();
              this.openSnackBar("Registration failed, please try again!", "ok", false);
            });
      } catch (err) {
        this.showSpinner = false;
        this.loginInvalid = true;
        this.openSnackBar("Registration failed, please try again!", "ok", false);
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
    let register = this.mapFormToRegister();
    this.passwordMeter.updateUserDetails(register.firstName,
      register.lastName, register.username, register.email);
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

}