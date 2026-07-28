import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreatorService,
  SaveCreatorServiceRequest
} from './creator-service.models';

@Injectable({
  providedIn: 'root'
})
export class CreatorServicesService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/v1/services';

  getMyServices(): Observable<CreatorService[]> {
    return this.http.get<CreatorService[]>(
      `${this.apiUrl}/me`
    );
  }

  createService(
    request: SaveCreatorServiceRequest
  ): Observable<CreatorService> {
    return this.http.post<CreatorService>(
      this.apiUrl,
      request
    );
  }

  updateService(
    id: number,
    request: SaveCreatorServiceRequest
  ): Observable<CreatorService> {
    return this.http.put<CreatorService>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
