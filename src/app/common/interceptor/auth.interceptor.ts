import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { API } from '../../shared/const.api';
import { ROUTE } from '../../shared/const.route';
import { LocalStorage } from '../service/local-storage';
import { NzMessageService } from 'ng-zorro-antd/message';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorage);
  const router = inject(Router);
  const messageService = inject(NzMessageService);

  const authToken = localStorageService.getAuthToken();
  const requestUrl = environment.api + req.url;

  if (req.url !== API.LOGIN || req.url !== API.REGISTER) {
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
  }

  req = req.clone({ url: requestUrl });

  return next(req).pipe(
    catchError((error) => {
      const tokenErrorMessages = ['Invalid token', 'Token expired'];

      if (tokenErrorMessages.includes(error.error.message)) {
        router.navigate([ROUTE.AUTH.LOGIN]);
      }

      messageService.error(error.error.message ?? 'An unknown error occurred!');

      return throwError(() => error);
    })
  );
};
