export type AccountType = 'CLIENT' | 'CREATOR' | 'BOTH';
export type UserRole = 'USER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  accountType: AccountType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  accountType: AccountType;
}

export interface CurrentUserResponse {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  accountType: AccountType;
  status: AccountStatus;
}