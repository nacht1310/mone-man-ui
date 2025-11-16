import { Routes } from '@angular/router';
import { AuthLayout } from './common/layout/auth-layout/auth-layout.component';
import { ROUTE } from './shared/const.route';
import { authCanActivate } from './common/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    loadChildren: () => import('./module/auth/auth.routes'),
  },
  {
    path: ROUTE.PORTAL,
    canActivate: [authCanActivate],
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
