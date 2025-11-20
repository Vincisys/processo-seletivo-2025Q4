import { useMutation } from "@tanstack/react-query";
import { createAsset } from "../services/asset";
import { toast } from "sonner";
import type { AssetCreate } from "../types/asset";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: AssetCreate) => createAsset(asset),
    onSuccess: () => {
      toast.success("Ativo criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "Erro ao criar ativo";
      toast.error(errorMessage);
    },
  });
}

