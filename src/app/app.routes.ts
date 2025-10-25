import { Routes } from '@angular/router';
import { AuthLayout } from './common/layout/auth-layout/auth-layout.component';
import { ROUTE } from './shared/const.route';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    loadChildren: () => import('./module/auth/auth.routes'),
  },
  {
    path: ROUTE.PORTAL,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTE.SPENDING_MANAGEMENT.MAIN,
      },
      {
        path: ROUTE.SPENDING_MANAGEMENT.MAIN,
        loadChildren: () => import('./module/spending-management/spending-management.routes'),
      },
    ],
  },
];
