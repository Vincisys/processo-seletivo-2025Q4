import { useMutation } from "@tanstack/react-query";
import { createOwner } from "../services/owner";
import { toast } from "sonner";
import type { OwnerCreate } from "../types/owner";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateOwnerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (owner: OwnerCreate) => createOwner(owner),
    onSuccess: () => {
      toast.success("Responsável criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "Erro ao criar responsável";
      toast.error(errorMessage);
    },
  });
}
