import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateEnquiryRequest,
  Enquiry,
  EnquiryStatus
} from './enquiry.models';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/v1/enquiries';

  createEnquiry(
    request: CreateEnquiryRequest
  ): Observable<Enquiry> {
    return this.http.post<Enquiry>(
      this.apiUrl,
      request
    );
  }

  getSentEnquiries(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(
      `${this.apiUrl}/sent`
    );
  }

  getReceivedEnquiries(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(
      `${this.apiUrl}/received`
    );
  }

  updateStatus(
    enquiryId: number,
    status: EnquiryStatus
  ): Observable<Enquiry> {
    return this.http.patch<Enquiry>(
      `${this.apiUrl}/${enquiryId}/status`,
      { status }
    );
  }
}
