import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import type { LoginCredentials } from "../services/auth.service";
import { authService } from "../services/auth.service";

export function useAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      authService.saveToken(response.access_token, response.expires_in);

      toast.success("Login realizado com sucesso");
      navigate("/app/owner");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    toast.success("Logout realizado com sucesso");
    navigate("/auth/login");
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
  };
}
