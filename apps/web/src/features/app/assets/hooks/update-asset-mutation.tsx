import { useMutation } from "@tanstack/react-query";
import { updateAsset } from "../services/asset";
import { toast } from "sonner";
import type { AssetUpdate } from "../types/asset";
import { useQueryClient } from "@tanstack/react-query";

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, data }: { assetId: string; data: AssetUpdate }) =>
      updateAsset(assetId, data),
    onSuccess: () => {
      toast.success("Ativo atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "Erro ao atualizar ativo";
      toast.error(errorMessage);
    },
  });
}

