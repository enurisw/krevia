import { Injectable } from '@angular/core';
import { AuthResponse } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly authKey = 'krevia_auth';

  saveAuth(auth: AuthResponse): void {
    localStorage.setItem(this.authKey, JSON.stringify(auth));
  }

  getAuth(): AuthResponse | null {
    const value = localStorage.getItem(this.authKey);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AuthResponse;
    } catch {
      this.clear();
      return null;
    }
  }

  getToken(): string | null {
    return this.getAuth()?.token ?? null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  clear(): void {
    localStorage.removeItem(this.authKey);
  }
}