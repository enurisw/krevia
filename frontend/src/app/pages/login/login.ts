import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
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

    this.authService.login(this.loginForm.getRawValue())
      .subscribe({
        next: () => {
          this.redirectAfterLogin();
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage =
            error.error?.detail ??
            error.error?.message ??
            'Invalid email or password.';
        }
      });
  }

  private redirectAfterLogin(): void {
    this.profileService.getMyProfile()
      .subscribe({
        next: profile => {
          this.loading = false;

          const destination =
            profile.onboardingCompleted
              ? '/dashboard'
              : '/onboarding';

          this.router.navigate([destination]);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;

          if (error.status === 404) {
            this.router.navigate(['/onboarding']);
            return;
          }

          this.errorMessage =
            'Login succeeded, but your profile could not be loaded.';
        }
      });
  }
}
