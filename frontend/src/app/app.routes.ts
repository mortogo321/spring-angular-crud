import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/users/user-list/user-list').then((m) => m.UserList),
  },
  {
    path: 'users/new',
    loadComponent: () => import('./features/users/user-form/user-form').then((m) => m.UserForm),
  },
  {
    path: 'users/:id/edit',
    loadComponent: () => import('./features/users/user-form/user-form').then((m) => m.UserForm),
  },
];
