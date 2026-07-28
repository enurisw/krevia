import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProfileService } from '../../core/profile/profile.service';
import {
  ProfileType,
  SaveProfileRequest,
  UserProfileResponse
} from '../../core/profile/profile.models';
import { AccountType } from '../../core/auth/auth.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);

  profile: UserProfileResponse | null = null;

  loading = true;
  saving = false;
  editing = false;

  errorMessage = '';
  successMessage = '';

  profileForm = this.formBuilder.nonNullable.group({
    accountType: [
      'BOTH' as AccountType,
      Validators.required
    ],

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

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.profileService.getMyProfile().subscribe({
      next: response => {
        const profile: UserProfileResponse = {
          ...response,
          skills: response.skills ?? []
        };

        this.profile = profile;
        this.loading = false;
        this.fillForm(profile);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        this.errorMessage =
          error.error?.message ??
          error.error?.detail ??
          'Could not load your profile.';
      }
    });
  }

  startEditing(): void {
    if (this.profile) {
      this.fillForm(this.profile);
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.editing = true;
  }

  cancelEditing(): void {
    if (this.profile) {
      this.fillForm(this.profile);
    }

    this.editing = false;
    this.errorMessage = '';
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.saving) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const value = this.profileForm.getRawValue();

    const skills = value.skillsText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .filter(
        (skill, index, allSkills) =>
          allSkills.indexOf(skill) === index
      )
      .slice(0, 20);

    const request: SaveProfileRequest = {
      accountType: value.accountType,
      profileType: value.profileType,
      headline: value.headline.trim(),
      bio: value.bio.trim(),
      location: value.location.trim(),
      websiteUrl: value.websiteUrl.trim(),
      skills
    };

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profileService.saveMyProfile(request)
      .subscribe({
        next: profile => {
          const normalizedProfile = this.normalizeProfile(profile);

          this.profile = normalizedProfile;
          this.fillForm(normalizedProfile);

          this.saving = false;
          this.editing = false;
          this.successMessage =
            'Your profile was updated successfully.';
        },
        error: (error: HttpErrorResponse) => {
          this.saving = false;

          this.errorMessage =
            error.error?.detail ??
            error.error?.message ??
            'Could not update your profile.';
        }
      });
  }

  formatValue(value: string): string {
    if (!value) {
      return 'Not added';
    }

    return value
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private fillForm(profile: UserProfileResponse): void {
    this.profileForm.patchValue({
      accountType: profile.accountType ?? 'BOTH',
      profileType: profile.profileType ?? 'STUDENT',
      headline: profile.headline ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      websiteUrl: profile.websiteUrl ?? '',
      skillsText: (profile.skills ?? []).join(', ')
    });
  }

  private normalizeProfile(
    profile: UserProfileResponse
  ): UserProfileResponse {
    return {
      ...profile,
      skills: profile.skills ?? []
    };
  }
}
