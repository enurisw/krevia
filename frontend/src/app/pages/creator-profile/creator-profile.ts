import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  PublicCreator
} from '../../core/discover/discover.models';

import {
  DiscoverService
} from '../../core/discover/discover.service';

@Component({
  selector: 'app-creator-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './creator-profile.html',
  styleUrl: './creator-profile.scss'
})
export class CreatorProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly discoverService = inject(DiscoverService);

  creator: PublicCreator | null = null;

  loading = true;
  errorMessage = '';

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
          this.creator = this.normalizeCreator(creator);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage =
            'Creator profile could not be found.';
        }
      });
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
