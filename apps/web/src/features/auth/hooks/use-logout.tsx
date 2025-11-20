import { useNavigate } from "react-router-dom";
import { authUtils } from "../services/auth.service";
import { toast } from "sonner";

export function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    authUtils.logout();
    toast.success("Logout realizado com sucesso");
    navigate("/auth/login");
  };

  return { logout };
}

