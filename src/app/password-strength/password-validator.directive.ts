import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { PasswordMeter } from "./PasswordMeter";

export function passwordValidator(score: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordScore = score < PasswordMeter.minPasswordScoreRequired;
    return passwordScore ? { passwordScore: { value: control.value } } : null;
  };
}

export function password3Validator(passwordStrength: FormControl, passwordRequirements: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const passwordScore = passwordStrength.value < PasswordMeter.minPasswordScoreRequired || passwordRequirements.value < 4;
    return passwordScore ? { passwordScore: { value: control.value } } : null;
  };
}

export function password2Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const score = control.get('passwordStrength')?.value;
    const passwordScore = score < PasswordMeter.minPasswordScoreRequired;
    console.log("password2Validator - score = ", score);
    return passwordScore ? { passwordScore: { value: control.value } } : null;
  };
}

export function passwordConfirmValidator(password: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const isSame = control.value != password.value;
    return isSame ? { password2: { value: control.value } } : null;
  };
}

export function differentValuesValidator(other: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !other.value) return null;
    return (control.value == other.value) ? { sameValues: true } : null;
  };
}

export const sameValuesValidator2: ValidatorFn = (control: AbstractControl, key1: string = 'password', key2: string = 'newPassword'): ValidationErrors | null => {
  const value1 = control.get(key1);
  const value2 = control.get(key2);
  console.log("value1.value = " , value1?.value);
  console.log("value2.value = " , value2?.value);
  return value1 && value2 && value1.value != value2.value ? { differentValues: true } : null;
};

export const differentValuesValidator2: ValidatorFn = (control: AbstractControl, key1: string = 'password', key2: string = 'password2'): ValidationErrors | null => {
  const value1 = control.get(key1);
  const value2 = control.get(key2);
  return value1 && value2 && value1.value === value2.value ? { sameValues: true } : null;
};

/*
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { PasswordMeterService } from "./PasswordMeterService";

@Injectable({ providedIn: 'root' })
export class passwordValidator {
  constructor(private passwordMeterService: PasswordMeterService) {}

  validate(
    ctrl: AbstractControl
  ): ValidationErrors | null {
      const score = this.passwordMeterService.passwordMeter.getPasswordScore();
    const passwordScore =  this.passwordMeterService.passwordMeter.getPasswordScore()<PasswordMeter.minPasswordScoreRequired;
    console.log("score = ", score);
    return passwordScore ? {passwordScore: {value: control.value}} : null;
  }
}
*/