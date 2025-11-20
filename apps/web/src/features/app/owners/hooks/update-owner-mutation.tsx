import { useMutation } from "@tanstack/react-query";
import { updateOwner } from "../services/owner";
import { toast } from "sonner";
import type { OwnerUpdate } from "../types/owner";
import { useQueryClient } from "@tanstack/react-query";

export function useUpdateOwnerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ownerId, data }: { ownerId: string; data: OwnerUpdate }) =>
      updateOwner(ownerId, data),
    onSuccess: () => {
      toast.success("Responsável atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "Erro ao atualizar responsável";
      toast.error(errorMessage);
    },
  });
}

