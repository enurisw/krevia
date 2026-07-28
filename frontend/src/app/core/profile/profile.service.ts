import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  SaveProfileRequest,
  UserProfileResponse
} from './profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/v1/profiles';

  getMyProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(
      `${this.apiUrl}/me`
    );
  }

  saveMyProfile(
    request: SaveProfileRequest
  ): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(
      `${this.apiUrl}/me`,
      request
    );
  }
}
