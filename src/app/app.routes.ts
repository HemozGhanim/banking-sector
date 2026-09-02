import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth-guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'customers',
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/dashboard/customers/customers').then((m) => m.Customers),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./features/dashboard/accounts/accounts').then((m) => m.Accounts),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/dashboard/transactions/transactions').then((m) => m.Transactions),
      },
    ],
  },
];
