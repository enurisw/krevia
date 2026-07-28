import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';

export const onboardingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return profileService.getMyProfile().pipe(
    map(profile => {
      if (profile.onboardingCompleted) {
        return true;
      }

      return router.createUrlTree(['/onboarding']);
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        return of(
          router.createUrlTree(['/onboarding'])
        );
      }

      authService.logout();

      return of(
        router.createUrlTree(['/login'])
      );
    })
  );
};
