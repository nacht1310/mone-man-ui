import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorage } from '../service/local-storage';
import { ROUTE } from '../../shared/const.route';
import { AuthService } from '../../module/auth/auth.service';

export const authCanActivate: CanActivateFn = (route, state) => {
  const localStorage = inject(LocalStorage);
  const router = inject(Router);

  const token = localStorage.getAuthToken();

  if (!token) {
    router.navigate([ROUTE.AUTH.LOGIN]);
    return false;
  }

  return true;
};
