export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  api_key: string;
}

export interface SignupResponse {
  message: string;
  user: User;
}
