import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Onboarding } from './pages/onboarding/onboarding';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/auth/auth.guard';
import { onboardingGuard } from './core/profile/onboarding.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'onboarding',
    component: Onboarding,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [
      authGuard,
      onboardingGuard
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
