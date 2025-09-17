import { Routes } from '@angular/router';
import { ROUTE } from '../../shared/const.route';
import { Login } from './login/login.component';
import { Register } from './register/register.component';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE.AUTH.LOGIN,
  },
  {
    path: ROUTE.AUTH.LOGIN,
    component: Login,
  },
  {
    path: ROUTE.AUTH.REGISTER,
    component: Register,
  },
] as Routes;
