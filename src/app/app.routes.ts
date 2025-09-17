import { Routes } from '@angular/router';
import { AuthLayout } from './common/layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    loadChildren: () => import('./module/auth/auth.routes'),
  },
];
