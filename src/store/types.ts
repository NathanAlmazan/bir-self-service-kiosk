// User roles
export enum UserRole {
  ADMIN = 'Admin',
  OFFICER = 'Officer',
  TAXPAYER = 'Taxpayer',
}

// User state interface
export interface UserState {
  office: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

// Root state interface
export interface RootState {
  user: UserState;
}
