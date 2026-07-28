import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import {
  CreatorService,
  SaveCreatorServiceRequest
} from '../../core/services/creator-service.models';

import {
  CreatorServicesService
} from '../../core/services/creator-services.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly servicesService =
    inject(CreatorServicesService);

  services: CreatorService[] = [];

  loading = true;
  saving = false;
  showForm = false;

  errorMessage = '';
  successMessage = '';

  serviceForm = this.formBuilder.nonNullable.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(120)
    ]],

    description: ['', [
      Validators.required,
      Validators.maxLength(1500)
    ]],

    category: ['', Validators.required],

    startingPrice: [0, [
      Validators.required,
      Validators.min(0)
    ]],

    deliveryDays: [7, [
      Validators.required,
      Validators.min(1),
      Validators.max(365)
    ]]
  });

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.errorMessage = '';

    this.servicesService.getMyServices()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: services => {
          this.services = services ?? [];
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.detail ??
            error.error?.message ??
            'Could not load your services.';
        }
      });
  }

  openForm(): void {
    this.serviceForm.reset({
      title: '',
      description: '',
      category: '',
      startingPrice: 0,
      deliveryDays: 7
    });

    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.errorMessage = '';
  }

  createService(): void {
    if (this.serviceForm.invalid || this.saving) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const value = this.serviceForm.getRawValue();

    const request: SaveCreatorServiceRequest = {
      title: value.title.trim(),
      description: value.description.trim(),
      category: value.category,
      startingPrice: Number(value.startingPrice),
      deliveryDays: Number(value.deliveryDays)
    };

    this.saving = true;
    this.errorMessage = '';

    this.servicesService.createService(request)
      .subscribe({
        next: service => {
          this.services = [
            service,
            ...this.services
          ];

          this.saving = false;
          this.showForm = false;
          this.successMessage =
            'Your service was added successfully.';
        },
        error: (error: HttpErrorResponse) => {
          this.saving = false;

          this.errorMessage =
            error.error?.message ??
            error.error?.detail ??
            'Could not add the service.';
        }
      });
  }

  deleteService(service: CreatorService): void {
    const confirmed = window.confirm(
      `Delete "${service.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.servicesService.deleteService(service.id)
      .subscribe({
        next: () => {
          this.services = this.services.filter(
            item => item.id !== service.id
          );

          this.successMessage =
            'Service deleted successfully.';
        },
        error: () => {
          this.errorMessage =
            'Could not delete the service.';
        }
      });
  }
}
