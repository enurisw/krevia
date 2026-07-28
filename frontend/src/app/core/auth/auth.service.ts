import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  CurrentUserResponse,
  LoginRequest,
  RegisterRequest
} from './auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';
  private readonly usersApiUrl =
  'http://localhost:8080/api/v1/users';

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => this.tokenStorage.saveAuth(response))
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => this.tokenStorage.saveAuth(response))
      );
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  getCurrentUser(): AuthResponse | null {
    return this.tokenStorage.getAuth();
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.isLoggedIn();
  }

  getProfile(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(
      `${this.usersApiUrl}/me`
    );
  }
}