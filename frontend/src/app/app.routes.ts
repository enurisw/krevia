import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Onboarding } from './pages/onboarding/onboarding';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Services } from './pages/services/services';
import { Discover } from './pages/discover/discover';
import {
  CreatorProfile
} from './pages/creator-profile/creator-profile';
import {
  SendEnquiry
} from './pages/send-enquiry/send-enquiry';
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
    path: 'profile',
    component: Profile,
    canActivate: [
      authGuard,
      onboardingGuard
    ]
  },
  {
    path: 'services',
    component: Services,
    canActivate: [
      authGuard,
      onboardingGuard
    ]
  },
  {
    path: 'discover',
    component: Discover
  },
  {
    path: 'creators/:userId/enquire',
    component: SendEnquiry,
    canActivate: [
      authGuard,
      onboardingGuard
    ]
  },
  {
    path: 'creators/:userId',
    component: CreatorProfile
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
