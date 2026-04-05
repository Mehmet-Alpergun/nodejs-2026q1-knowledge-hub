export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  login: string;
  password: string; // excluded from responses via interceptor
  role: UserRole;
  createdAt: number; // Date.now()
  updatedAt: number;
}
