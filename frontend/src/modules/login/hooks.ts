import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { loginApi } from "./api";
import type { LoginFormData } from "./types";

const INITIAL_FORM: LoginFormData = {
  email: "",
  password: "",
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function useLogin() {
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await loginApi(formData);
      localStorage.setItem("apiKey", response.user.api_key);
      localStorage.setItem("user", JSON.stringify(response.user));
      setMessage(response.message);
      navigate("/");
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Login failed. Please check your credentials."),
      );
    }
  }

  return {
    formData,
    error,
    message,
    handleChange,
    handleSubmit,
  };
}
