import { Routes } from '@angular/router';
import { SpendingManagementComponent } from './spending-management.component';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: SpendingManagementComponent,
  },
] as Routes;
