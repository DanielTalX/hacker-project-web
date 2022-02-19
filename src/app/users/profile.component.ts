import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { differentValuesValidator, password3Validator, passwordConfirmValidator } from '../password-strength/password-validator.directive';
import { DetailsRow, PasswordMeter } from '../password-strength/PasswordMeter';
import { AppUser } from '../security//app-user';
import { AppUserAuth } from '../security//app-user-auth';
import { SecurityService } from '../security/security.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: AppUser = new AppUser();
  securityObject: AppUserAuth;

  profileForm: FormGroup;
  profileFormInvalid = false;
  profileSpinner = false;

  emailForm: FormGroup;
  emailFormInvalid = false;
  emailSpinner = false;

  passwordForm: FormGroup;
  passwordFormInvalid = false;
  passwordSpinner = false;

  deleteForm: FormGroup;
  deleteFormInvalid = false;
  deleteSpinner = false;

  //
  passwordMeter: PasswordMeter = new PasswordMeter();
  detailsRows$: BehaviorSubject<DetailsRow[]> = new BehaviorSubject<DetailsRow[]>([]);
  password: string = "";
  passwordStrength: number = 0;
  complexity: string = "";
  showDetails: boolean = false;

  constructor(private securityService: SecurityService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar) {
    this.securityObject = securityService.securityObject;

    this.profileForm = this.fb.group({
      firstName: [this.securityObject.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: [this.securityObject.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      username: [this.securityObject.username, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    });

    this.emailForm = this.fb.group({
      email: [this.securityObject.email, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    });

    this.deleteForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      newPassword: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      newPassword2: ['', [Validators.required, Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      passwordStrength: [PasswordMeter.minPasswordScoreRequired, [Validators.min(PasswordMeter.minPasswordScoreRequired)]],
      passwordRequirements: [0, [Validators.min(0)]]
    });

    let c1 = this.passwordForm.get("passwordStrength") as FormControl;
    let c2 = this.passwordForm.get("passwordRequirements") as FormControl;
    let c3 = this.passwordForm.get("password") as FormControl;

    this.passwordForm.get("newPassword")!.setValidators([
      Validators.minLength(10), Validators.maxLength(100), differentValuesValidator(c3), password3Validator(c1, c2)]);

    this.passwordForm.get("newPassword2")!.setValidators([
      Validators.required, Validators.minLength(10), Validators.maxLength(100),
      passwordConfirmValidator(this.passwordForm.get("newPassword") as FormControl)]);
  }

  async ngOnInit(): Promise<void> { }

  async updateUserProfile(): Promise<void> {
    this.profileFormInvalid = false;
    if (this.profileForm.valid) {
      this.profileSpinner = true;
      try {
        let user = {
          firstName: this.profileForm.get('firstName')?.value,
          lastName: this.profileForm.get('lastName')?.value,
          username: this.profileForm.get('username')?.value,
        }

        this.securityService.updateUserProfile(user)
          .subscribe(
            resp => {
              this.profileSpinner = false;
              this.openSnackBar("You have successfully updated your profile!", "ok", true);
            },
            () => { //error
              this.profileSpinner = false;
              this.openSnackBar("Update failed, please try again!", "ok", true);
            }
          );
      } catch (err) {
        this.profileSpinner = false;
        this.profileFormInvalid = true;
        this.openSnackBar("Update failed, please try again!", "ok", true);
      }
    }
  }

  async updateUserEmail(): Promise<void> {
    this.emailFormInvalid = false;
    if (this.emailForm.valid) {
      this.emailSpinner = true;
      try {
        let user = {
          email: this.emailForm.get('email')?.value,
          password: this.emailForm.get('password')?.value,
        }

        this.securityService.updateUserEmail(user)
          .subscribe(
            (resp: any) => {
              this.emailSpinner = false;
              this.openSnackBar("You have successfully updated your email!", "ok", true);
            },
            () => { //error
              this.emailSpinner = false;
              this.openSnackBar("Update failed, please try again!", "ok", true);
            }
          );
      } catch (err) {
        this.emailSpinner = false;
        this.emailFormInvalid = true;
        this.openSnackBar("Update failed, please try again!", "ok", true);
      }
    }
  }

  async deleteUserAccount(): Promise<void> {
    this.deleteFormInvalid = false;
    if (this.deleteForm.valid) {
      this.deleteSpinner = true;
      try {
        let user = {
          password: this.deleteForm.get('password')?.value,
        }

        this.securityService.deleteUserAccount(user)
          .subscribe(
            (resp: any) => {
              this.deleteSpinner = false;
              this.openSnackBar("You have successfully deleted your account!", "ok", true);
              this.securityService.logout().subscribe(
                resp => this.router.navigateByUrl('/dashboard'),
                () => this.router.navigateByUrl('/dashboard')
              );
            },
            () => { //error
              this.deleteSpinner = false;
              this.openSnackBar("Acion failed, please try again!", "ok", true);
            }
          );
      } catch (err) {
        this.deleteSpinner = false;
        this.deleteFormInvalid = true;
        this.openSnackBar("Acion failed, please try again!", "ok", true);
      }
    }
  }

  async updateUserPassword(): Promise<void> {
    this.passwordFormInvalid = false;
    if (this.passwordForm.valid) {
      this.passwordSpinner = true;
      try {
        let user = {
          password: this.passwordForm.get('password')?.value,
          newPassword: this.passwordForm.get('newPassword')?.value,
          newPassword2: this.passwordForm.get('newPassword2')?.value,
        }

        this.securityService.updateUserPassword(user)
          .subscribe(
            resp => {
              this.passwordSpinner = false;
              this.openSnackBar("You have successfully updated your profile!", "ok", true);
            },
            () => { //error
              this.passwordSpinner = false;
              this.openSnackBar("Update failed, please try again!", "ok", true);
            }
          );
      } catch (err) {
        this.passwordSpinner = false;
        this.passwordFormInvalid = true;
        this.openSnackBar("Update failed, please try again!", "ok", true);
      }
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
    this.passwordForm.get("passwordRequirements")?.setValue(requirements);
    this.passwordForm.get("passwordStrength")?.setValue(this.passwordStrength);
    this.passwordForm.get("newPassword")?.setValue(pwd);
    this.complexity = this.passwordMeter.getComplexity();
    const detailsRows = this.passwordMeter.getStrengthDetails();
    this.detailsRows$.next(detailsRows);
    if (!pwd) this.passwordForm.get("passwordStrength")?.setValue(this.passwordStrength);
    this.password = pwd;
  }
}