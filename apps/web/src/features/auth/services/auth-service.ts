import { api } from "@/lib/api";
import type { LoginCredentials, LoginResponse } from "../types/auth-types";

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/integrations/auth",
    credentials
  );

  return response.data;
};
