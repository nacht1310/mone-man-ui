import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ROUTE } from '../../../shared/const.route';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs';
import { IRegisterRequest } from '../auth.types';

@Component({
  selector: 'app-register',
  imports: [NzFormModule, NzInputModule, ReactiveFormsModule, NzIconModule, NzButtonModule],
  templateUrl: './register.component.html',
})
export class Register {
  registerForm!: UntypedFormGroup;
  autoTips = {
    userName: { default: { required: 'Please input your user name!' } },
    password: { default: { required: 'Please input your password!' } },
    confirmPassword: {
      default: {
        required: 'Please confirm your password!',
        notMatching: 'Confirm password does not match!',
      },
    },
  };

  passwordVisible = signal({
    password: false,
    confirmPassword: false,
  });
  loading = signal(false);

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.initForm();
  }

  submitForm(): void {
    Object.values(this.registerForm.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if (this.registerForm.invalid) {
      return;
    }

    const data: IRegisterRequest = {
      userName: this.registerForm.value.userName,
      password: this.registerForm.value.password,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
    };
    this.loading.set(true);
    this._authService
      .register(data)
      .pipe(
        tap({
          next: () => {
            this.loading.set(false);
            this.navigateToLogin();
          },
          error: () => this.loading.set(false),
        })
      )
      .subscribe();
  }

  navigateToLogin(): void {
    this._router.navigate([ROUTE.AUTH.LOGIN]);
  }

  private initForm(): void {
    this.registerForm = this._formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required, confirmPasswordValidator()]],
      firstName: [null],
      lastName: [null],
    });
  }
}

const confirmPasswordValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent;
    const password = group?.get('password')?.value;
    const confirmPassword = control.value;
    if (password !== confirmPassword) {
      return { notMatching: true };
    }
    return null;
  };
};
