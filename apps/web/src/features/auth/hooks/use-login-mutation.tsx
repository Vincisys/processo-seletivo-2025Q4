import { useMutation } from "@tanstack/react-query";
import { login, authUtils } from "../services/auth.service";
import { toast } from "sonner";
import type { LoginCredentials } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

export function useLoginMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      authUtils.saveToken(data.access_token, data.expires_in);
      toast.success("Login realizado com sucesso");
      navigate("/app/owner");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail ||
        "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(errorMessage);
    },
  });
}
