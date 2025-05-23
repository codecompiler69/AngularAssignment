import { Routes } from '@angular/router';

import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
  {
    path: 'listings',
    loadChildren: () =>
      import('./features/listings/listings.module').then(
        (m) => m.ListingsModule
      ),
  },
  {
    path: 'property',
    loadChildren: () =>
      import('./features/property/property.module').then(
        (m) => m.PropertyModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/user-profile/user-profile.module').then(
        (m) => m.UserProfileModule
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'home' },
];
