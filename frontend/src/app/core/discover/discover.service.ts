import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { PublicCreator } from './discover.models';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/v1/discover';

  getCreators(
    search = '',
    category = ''
  ): Observable<PublicCreator[]> {
    const params = new HttpParams()
      .set('search', search)
      .set('category', category);

    return this.http.get<PublicCreator[]>(
      `${this.apiUrl}/creators`,
      { params }
    );
  }

  getCreator(
    userId: number
  ): Observable<PublicCreator> {
    return this.http.get<PublicCreator>(
      `${this.apiUrl}/creators/${userId}`
    );
  }
}
