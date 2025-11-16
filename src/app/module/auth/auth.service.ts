import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../shared/const.api';
import { ILoginRequest, IRegisterRequest } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  login(userValue: ILoginRequest): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(API.LOGIN, userValue);
  }

  register(value: IRegisterRequest): Observable<string> {
    return this.httpClient.post<string>(API.REGISTER, value);
  }
}
