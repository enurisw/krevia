import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  PublicCreator
} from '../../core/discover/discover.models';

import {
  DiscoverService
} from '../../core/discover/discover.service';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './discover.html',
  styleUrl: './discover.scss'
})
export class Discover implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly discoverService = inject(DiscoverService);

  creators: PublicCreator[] = [];

  loading = true;
  errorMessage = '';

  filters = this.formBuilder.nonNullable.group({
    search: [''],
    category: ['']
  });

  ngOnInit(): void {
    this.loadCreators();
  }

  loadCreators(): void {
    const values = this.filters.getRawValue();

    this.loading = true;
    this.errorMessage = '';

    this.discoverService.getCreators(
      values.search.trim(),
      values.category
    ).subscribe({
      next: creators => {
        this.creators = (creators ?? []).map(
          creator => this.normalizeCreator(creator)
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          'Could not load creators.';
      }
    });
  }

  clearFilters(): void {
    this.filters.reset({
      search: '',
      category: ''
    });

    this.loadCreators();
  }

  getStartingPrice(
    creator: PublicCreator
  ): number | null {
    if (creator.services.length === 0) {
      return null;
    }

    return Math.min(
      ...creator.services.map(
        service => Number(service.startingPrice)
      )
    );
  }

  formatValue(value: string | null): string {
    if (!value) {
      return 'Creator';
    }

    return value
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private normalizeCreator(
    creator: PublicCreator
  ): PublicCreator {
    return {
      ...creator,
      skills: creator.skills ?? [],
      services: creator.services ?? []
    };
  }
}
