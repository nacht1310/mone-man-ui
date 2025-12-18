import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule, NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef } from 'ng-zorro-antd/modal';
import { SpendingManagementService } from '../spending-management.service';
import { CategoryData, CreateSpendingPayload } from '../spending.types';
import { tap } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-add-edit-spending',
  imports: [
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzButtonModule,
    NzModalFooterDirective,
  ],
  templateUrl: './add-edit-spending.component.html',
})
export class AddEditSpendingComponent implements OnInit {
  form!: UntypedFormGroup;
  data = inject(NZ_MODAL_DATA);

  categoryOptionList = signal<NzSelectOptionInterface[]>([]);

  errorTips: Record<string, Record<string, Record<string, string>>> = {
    amount: {
      en: {
        required: 'Amount is required! Please input the amount value!',
      },
    },
    date: {
      en: {
        required: 'Date is required! Please select the date value!',
      },
    },
    categoryId: {
      en: {
        required: 'Category is required! Please select the category value!',
      },
    },
  };

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _modalRef: NzModalRef,
    private readonly _spendingService: SpendingManagementService,
    private readonly _toast: NzMessageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.handleGetCategories();
    if (this.data.id) {
      this.handleGetSpendingDetail(this.data.id);
    }
  }

  // Data Fetching
  handleGetSpendingDetail(id: number) {
    this._spendingService.getSpendingDetail(id).subscribe((value) => {
      this.form.patchValue({
        ...value,
        date: DateTime.fromMillis(value.date).toJSDate(),
      });
    });
  }

  handleGetCategories() {
    this._spendingService
      .getCategories()
      .pipe(
        tap((value) => {
          const options = value.map((item) => ({ label: item.name, value: item.id }));
          this.categoryOptionList.set(options);
        })
      )
      .subscribe();
  }

  // Form Submission
  submitForm() {
    const listControls = this.form.controls;
    for (const controlKey in listControls) {
      listControls[controlKey].markAsDirty();
      listControls[controlKey].updateValueAndValidity();
    }

    if (!this.form.valid) {
      return;
    }

    if (this.data.id) {
      this.handleUpdateSpending();
    } else {
      this.handleAddSpending();
    }
  }

  handleAddSpending() {
    const { amount, date, description, categoryId } = this.form.value;
    this._spendingService
      .createSpending({
        amount,
        date: DateTime.fromJSDate(date).toMillis(),
        categoryId: categoryId,
        description: description ?? '',
      })
      .pipe(
        tap(() => {
          this._toast.success('You have successfully added a spending record!');
          this.destroyModal(true);
        })
      )
      .subscribe();
  }

  handleUpdateSpending() {
    const { amount, date, description, categoryId } = this.form.value;
    this._spendingService
      .updateSpending(this.data.id, {
        amount,
        date: DateTime.fromJSDate(date).toMillis(),
        categoryId: categoryId,
        description: description ?? '',
      })
      .pipe(
        tap(() => {
          this._toast.success('You have successfully updated spending record!');
          this.destroyModal(true);
        })
      )
      .subscribe();
  }

  // Utility Methods
  destroyModal(isSuccess?: boolean) {
    this._modalRef.destroy(isSuccess);
  }

  private initForm() {
    this.form = this._formBuilder.group({
      amount: [null, [Validators.required]],
      description: [null],
      date: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }
}
