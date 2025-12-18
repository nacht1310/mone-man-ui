import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { formatDisplayName } from '../../common/service/utility';
import { TableColumn } from '../../shared/shared.types';
import { SpendingManagementService } from './spending-management.service';
import {
  CategoryData,
  DisplaySpendingData,
  SpendingQueryParams,
  SpendingReturnData,
} from './spending.types';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AddEditSpendingComponent } from './add-edit-spending/add-edit-spending.component';

@Component({
  selector: 'app-spending-management',
  imports: [
    NzTableModule,
    NzButtonComponent,
    NzIconModule,
    NzTooltipModule,
    NzPopconfirmModule,
    NzModalModule,
  ],
  templateUrl: './spending-management.component.html',
})
export class SpendingManagementComponent implements OnInit, OnDestroy {
  spendingData = signal<DisplaySpendingData[]>([]);
  totalCount = signal<number>(0);

  queryParams = signal<SpendingQueryParams>({
    page: 0,
    size: 10,
    sortField: 'date',
    sortDirection: 'desc',
  });
  tableColumns = computed<Array<TableColumn<DisplaySpendingData>>>(() => {
    const listKeys: Array<keyof DisplaySpendingData> = [
      'id',
      'date',
      'amount',
      'description',
      'category',
      'createdAt',
      'updatedAt',
    ];
    const sortDirection = (this.queryParams().sortDirection + 'end') as 'ascend' | 'descend';
    const sortField = this.queryParams().sortField;
    const columns: Array<TableColumn<DisplaySpendingData>> = [];

    for (const key of listKeys) {
      columns.push({
        name: key,
        displayName: formatDisplayName(key),
        sortDirections: ['ascend', 'descend'],
        sortOrder: sortField === key ? sortDirection : null,
      });
    }

    return columns;
  });

  categoryList = signal<CategoryData[]>([]);

  private readonly _unsubscribeAll = new Subject();

  constructor(
    private readonly _spendingService: SpendingManagementService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _messageService: NzMessageService,
    private readonly _router: Router,
    private readonly _nzModalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.handleGetCategories();

    this._activatedRoute.queryParams
      .pipe(
        tap((params) => {
          this.queryParams.update((queryParams) => ({
            ...queryParams,
            ...params,
            page: Number(params['page']) || 0,
            size: Number(params['size']) || 10,
          }));
        }),
        switchMap(() => this.handleGetSpendingData())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // Data Fetching
  handleGetSpendingData(): Observable<SpendingReturnData> {
    return this._spendingService.getAllSpendingData(this.queryParams()).pipe(
      takeUntil(this._unsubscribeAll),
      tap((response: SpendingReturnData) => {
        this.spendingData.set(
          response.data.map((value) => ({
            ...value,
            date: DateTime.fromMillis(value.date).toFormat('dd/LL/yyyy'),
            createdAt: DateTime.fromISO(value.createdAt).toFormat('dd/LL/yyyy'),
            updatedAt: DateTime.fromISO(value.updatedAt).toFormat('dd/LL/yyyy'),
            category:
              this.categoryList().find((category) => category.id === value.categoryId)?.name ||
              `Unknown Category (${value.categoryId})`,
          }))
        );
        this.totalCount.set(response.totalCount);
      })
    );
  }

  handleGetCategories() {
    this._spendingService
      .getCategories()
      .pipe(
        tap((value) => {
          this.categoryList.set(value);
        })
      )
      .subscribe();
  }

  // Handle when query new data in table
  handleQueryParamsChanged(event: NzTableQueryParams) {
    const sortFieldData = event.sort.find((field) => field.value != null);
    const sortDirection = sortFieldData?.value?.slice(0, -3) || 'desc';
    const sortField = sortFieldData?.key || 'date';

    const newParams = {
      ...this.queryParams(),
      page: event.pageIndex - 1,
      size: event.pageSize,
      sortDirection,
      sortField,
    };
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: newParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  // Handle Delete spending record
  handleDeleteSpending(id: number) {
    this._spendingService
      .deleteSpending(id)
      .pipe(
        tap(() => {
          this._messageService.success('You have delete spending record successfully!');
        }),
        switchMap(() => this.handleGetSpendingData())
      )
      .subscribe();
  }

  // Open Add/Edit Spending
  openAddEditModal(id?: number) {
    const dialogRef = this._nzModalService.create({
      nzTitle: id ? 'Edit Spending' : 'Add Spending',
      nzContent: AddEditSpendingComponent,
      nzData: {
        id,
      },
    });

    dialogRef.afterClose
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((isSuccess) => {
          if (isSuccess) {
            return this.handleGetSpendingData();
          }
          return of(null);
        })
      )
      .subscribe();
  }
}
