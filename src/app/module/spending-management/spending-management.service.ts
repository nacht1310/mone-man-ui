import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../../shared/const.api';
import {
  CreateSpendingPayload,
  SpendingData,
  SpendingQueryParams,
  SpendingReturnData,
} from './spending.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpendingManagementService {
  private _httpClient = inject(HttpClient);

  getAllSpendingData(queryParams: SpendingQueryParams): Observable<SpendingReturnData> {
    let params = new HttpParams();
    Object.keys(queryParams).forEach((key) => {
      const value = (queryParams as any)[key];
      if (value !== undefined && value !== null) {
        params = params.append(key, value.toString());
      }
    });

    return this._httpClient.get<SpendingReturnData>(API.SPENDING_MANAGEMENT.LIST, { params });
  }

  createSpending(data: CreateSpendingPayload): Observable<SpendingData> {
    return this._httpClient.post<SpendingData>(API.SPENDING_MANAGEMENT.CREATE, data);
  }

  updateSpending(id: number, data: CreateSpendingPayload): Observable<SpendingData> {
    return this._httpClient.put<SpendingData>(API.SPENDING_MANAGEMENT.UPDATE(id), data);
  }

  deleteSpending(id: number): Observable<SpendingData> {
    return this._httpClient.delete<SpendingData>(API.SPENDING_MANAGEMENT.DELETE(id));
  }
}
