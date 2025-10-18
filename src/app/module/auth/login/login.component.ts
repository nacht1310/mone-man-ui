import { Component, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTE } from '../../../shared/const.route';
import { AuthService } from '../auth.service';
import { LocalStorage } from '../../../common/service/local-storage';

@Component({
  selector: 'app-login',
  imports: [NzFormModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzIconModule],
  templateUrl: './login.component.html',
})
export class Login implements OnDestroy {
  // Form Configuration
  loginForm!: UntypedFormGroup;
  autoTips = {
    userName: { default: { required: 'Please input your user name!' } },
    password: { default: { required: 'Please input your password!' } },
  };
  loading = signal(false);

  // Password visibility toggle
  passwordVisible = signal(false);

  // Destroy subject for unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _localStorageService: LocalStorage
  ) {
    this.initForm();
  }

  // Lifecycle hooks
  ngOnDestroy(): void {
    // Cleanup logic if needed
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Form submission handler
  submitForm(): void {
    Object.values(this.loginForm.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this._authService
      .login(this.loginForm.value)
      .pipe(
        takeUntil(this.destroy$),
        tap({
          next: (token: string) => {
            this.loading.set(false);
            this._localStorageService.setAuthToken(token);
          },
          error: () => this.loading.set(false),
        })
      )
      .subscribe();
  }

  // Navigation handler
  navigateToRegister(): void {
    this._router.navigate([ROUTE.AUTH.REGISTER]);
  }

  // Form setup
  initForm(): void {
    this.loginForm = this._formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
}
