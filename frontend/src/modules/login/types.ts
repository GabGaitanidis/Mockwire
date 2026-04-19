export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  api_key: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}
