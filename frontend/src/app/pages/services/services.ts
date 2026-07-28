import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, retry, timeout } from 'rxjs';

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
        timeout(15000),
        retry({
          count: 1,
          delay: 300
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: services => {
          this.services = services ?? [];
          this.successMessage = '';
        },
        error: (error: HttpErrorResponse | Error) => {
          this.errorMessage = this.getLoadServicesErrorMessage(error);
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
      .pipe(
        timeout(15000),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: service => {
          this.services = [
            service,
            ...this.services
          ];

          this.showForm = false;
          this.successMessage =
            'Your service was added successfully.';
        },
        error: (error: HttpErrorResponse | Error) => {
          this.errorMessage =
            this.getCreateServiceErrorMessage(error);
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

  private getCreateServiceErrorMessage(
    error: HttpErrorResponse | Error
  ): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error.name === 'TimeoutError'
        ? 'Adding the service took too long. Please check that the backend is running and try again.'
        : 'Could not add the service.';
    }

    if (error.status === 0) {
      return 'Could not reach the backend. Please check that it is running.';
    }

    if (error.status === 401 || error.status === 403) {
      return 'Only creator accounts can add services.';
    }

    return error.error?.detail ??
      error.error?.message ??
      this.parsePlainError(error.error) ??
      'Could not add the service.';
  }

  private parsePlainError(error: unknown): string | null {
    return typeof error === 'string'
      ? error
      : null;
  }

  private getLoadServicesErrorMessage(
    error: HttpErrorResponse | Error
  ): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error.name === 'TimeoutError'
        ? 'Loading services took too long. Please refresh the page.'
        : 'Could not load your services.';
    }

    if (error.status === 0) {
      return 'Could not reach the backend. Please check that it is running.';
    }

    if (error.status === 401 || error.status === 403) {
      return 'Please log in again to view your services.';
    }

    return error.error?.detail ??
      error.error?.message ??
      this.parsePlainError(error.error) ??
      'Could not load your services.';
  }
}
