import { api } from "@/lib/api";

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/integrations/auth",
      credentials
    );
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    if (!token || !expiration) {
      return false;
    }

    const expirationTime = parseInt(expiration, 10);
    const now = Date.now();

    if (now >= expirationTime) {
      this.logout();
      return false;
    }

    return true;
  },

  saveToken(token: string, expiresIn?: number): void {
    localStorage.setItem("token", token);

    if (expiresIn) {
      const expirationTime = Date.now() + expiresIn * 1000;
      localStorage.setItem("tokenExpiration", expirationTime.toString());
    } else {
      const defaultExpiration = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", defaultExpiration.toString());
    }
  },
};
