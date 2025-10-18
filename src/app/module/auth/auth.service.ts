import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../shared/const.api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  login(userValue: { userName: string; password: string }): Observable<string> {
    return this.httpClient.post<string>(API.LOGIN, userValue);
  }
}
