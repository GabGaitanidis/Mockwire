import axios from "../../utils/axiosInstance";
import type { SignupFormData, SignupResponse } from "./types";

export async function signupApi(
  payload: SignupFormData,
): Promise<SignupResponse> {
  const response = await axios.post<SignupResponse>("/auth/register", payload);
  return response.data;
}
