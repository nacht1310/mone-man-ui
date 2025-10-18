import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { API } from '../../shared/const.api';
import { LocalStorage } from '../service/local-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorage);
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

  return next(req);
};
