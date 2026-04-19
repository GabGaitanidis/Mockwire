import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { signupApi } from "./api";
import type { SignupFormData } from "./types";

const INITIAL_FORM: SignupFormData = {
  name: "",
  email: "",
  password: "",
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function useSignup() {
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await signupApi(formData);
      localStorage.setItem("apiKey", response.user.api_key);
      localStorage.setItem("user", JSON.stringify(response.user));
      setMessage(response.message);
      navigate("/");
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Signup failed. Email might already be in use.",
        ),
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
