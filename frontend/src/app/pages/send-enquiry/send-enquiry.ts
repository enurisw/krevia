import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  PublicCreator
} from '../../core/discover/discover.models';

import {
  DiscoverService
} from '../../core/discover/discover.service';

import {
  EnquiryService
} from '../../core/enquiries/enquiry.service';

@Component({
  selector: 'app-send-enquiry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './send-enquiry.html',
  styleUrl: './send-enquiry.scss'
})
export class SendEnquiry implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly discoverService = inject(DiscoverService);
  private readonly enquiryService = inject(EnquiryService);

  creator: PublicCreator | null = null;

  loading = true;
  saving = false;
  errorMessage = '';

  readonly minimumDate =
    new Date().toISOString().split('T')[0];

  enquiryForm = this.formBuilder.nonNullable.group({
    serviceId: [''],
    title: ['', [
      Validators.required,
      Validators.maxLength(150)
    ]],
    description: ['', [
      Validators.required,
      Validators.maxLength(3000)
    ]],
    budget: [''],
    preferredDeadline: ['']
  });

  ngOnInit(): void {
    const userId = Number(
      this.route.snapshot.paramMap.get('userId')
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      this.loading = false;
      this.errorMessage = 'Invalid creator profile.';
      return;
    }

    this.discoverService.getCreator(userId)
      .subscribe({
        next: creator => {
          this.creator = {
            ...creator,
            services: creator.services ?? [],
            skills: creator.skills ?? []
          };
          this.loading = false;

          const serviceId =
            this.route.snapshot.queryParamMap
              .get('serviceId');

          if (serviceId) {
            this.enquiryForm.patchValue({ serviceId });
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage =
            'Creator profile could not be loaded.';
        }
      });
  }

  sendEnquiry(): void {
    if (
      !this.creator ||
      this.enquiryForm.invalid ||
      this.saving
    ) {
      this.enquiryForm.markAllAsTouched();
      return;
    }

    const value = this.enquiryForm.getRawValue();

    this.saving = true;
    this.errorMessage = '';

    this.enquiryService.createEnquiry({
      recipientId: this.creator.userId,
      serviceId: value.serviceId
        ? Number(value.serviceId)
        : null,
      title: value.title.trim(),
      description: value.description.trim(),
      budget: value.budget
        ? Number(value.budget)
        : null,
      preferredDeadline:
        value.preferredDeadline || null
    }).subscribe({
      next: () => {
        this.router.navigate(
          ['/enquiries'],
          {
            queryParams: {
              view: 'sent',
              created: 'true'
            }
          }
        );
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;

        this.errorMessage =
          error.error?.message ??
          error.error?.detail ??
          'Could not send the enquiry.';
      }
    });
  }
}
