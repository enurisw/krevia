import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ProfileService } from '../../core/profile/profile.service';
import {
  ProfileType,
  SaveProfileRequest
} from '../../core/profile/profile.models';
import { AccountType } from '../../core/auth/auth.models';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  private readonly formBuilder = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  currentStep = 1;
  loading = false;
  errorMessage = '';

  onboardingForm = this.formBuilder.nonNullable.group({
    accountType: ['BOTH' as AccountType, Validators.required],

    profileType: [
      'STUDENT' as ProfileType,
      Validators.required
    ],

    headline: ['', [
      Validators.required,
      Validators.maxLength(150)
    ]],

    bio: ['', Validators.maxLength(1000)],

    location: ['', Validators.maxLength(100)],

    websiteUrl: ['', Validators.maxLength(255)],

    skillsText: ['', Validators.maxLength(500)]
  });

  nextStep(): void {
    this.errorMessage = '';

    if (this.currentStep === 1) {
      const accountType =
        this.onboardingForm.controls.accountType;

      const profileType =
        this.onboardingForm.controls.profileType;

      accountType.markAsTouched();
      profileType.markAsTouched();

      if (accountType.invalid || profileType.invalid) {
        return;
      }
    }

    if (this.currentStep === 2) {
      const headline =
        this.onboardingForm.controls.headline;

      headline.markAsTouched();

      if (headline.invalid) {
        return;
      }
    }

    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    this.errorMessage = '';

    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submit(): void {
    if (this.onboardingForm.invalid || this.loading) {
      this.onboardingForm.markAllAsTouched();
      return;
    }

    const formValue = this.onboardingForm.getRawValue();

    const skills = formValue.skillsText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .filter(
        (skill, index, allSkills) =>
          allSkills.indexOf(skill) === index
      )
      .slice(0, 20);

    const request: SaveProfileRequest = {
      accountType: formValue.accountType,
      profileType: formValue.profileType,
      headline: formValue.headline.trim(),
      bio: formValue.bio.trim(),
      location: formValue.location.trim(),
      websiteUrl: formValue.websiteUrl.trim(),
      skills
    };

    this.loading = true;
    this.errorMessage = '';

    this.profileService.saveMyProfile(request)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;

          this.errorMessage =
            error.error?.detail ??
            error.error?.message ??
            'Could not save your profile. Please try again.';
        }
      });
  }
}
