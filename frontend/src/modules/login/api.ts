import axios from "../../utils/axiosInstance";
import type { LoginFormData, LoginResponse } from "./types";

export async function loginApi(payload: LoginFormData): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>("/auth/login", payload);
  return response.data;
}
