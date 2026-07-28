import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { timeout } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/profile/profile.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.loginForm.getRawValue();
    const request = {
      email: formValue.email.trim(),
      password: formValue.password
    };

    this.authService.logout();

    this.authService.login(request)
      .pipe(
        timeout(15000)
      )
      .subscribe({
        next: () => {
          this.redirectAfterLogin();
        },
        error: (error: HttpErrorResponse | Error) => {
          this.authService.logout();
          this.loading = false;
          this.errorMessage =
            this.getLoginErrorMessage(error);
        }
      });
  }

  private redirectAfterLogin(): void {
    this.profileService.getMyProfile()
      .pipe(
        timeout(15000)
      )
      .subscribe({
        next: profile => {
          this.loading = false;

          const destination =
            profile.onboardingCompleted
              ? '/dashboard'
              : '/onboarding';

          this.router.navigate([destination]);
        },
        error: (error: HttpErrorResponse | Error) => {
          this.loading = false;

          if (error instanceof HttpErrorResponse && error.status === 404) {
            this.router.navigate(['/onboarding']);
            return;
          }

          this.errorMessage =
            error.name === 'TimeoutError'
              ? 'Login succeeded, but loading your profile took too long. Please try again.'
              : 'Login succeeded, but your profile could not be loaded.';
        }
      });
  }

  private getLoginErrorMessage(
    error: HttpErrorResponse | Error
  ): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error.name === 'TimeoutError'
        ? 'Login took too long. Please check that the backend is running and try again.'
        : 'Invalid email or password.';
    }

    if (error.status === 0) {
      return 'Could not reach the backend. Please check that it is running.';
    }

    if (error.status === 401 || error.status === 403) {
      return 'Invalid email or password.';
    }

    return error.error?.detail ??
      error.error?.message ??
      this.parsePlainError(error.error) ??
      'Invalid email or password.';
  }

  private parsePlainError(error: unknown): string | null {
    if (typeof error !== 'string') {
      return null;
    }

    if (error.includes('Invalid email or password')) {
      return 'Invalid email or password.';
    }

    return error;
  }
}
