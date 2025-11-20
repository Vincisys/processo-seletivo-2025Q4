import { assetFields } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Asset } from "../../types/asset";
import CreateAssetSheet from "../Sheets/create-asset-sheet";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsset } from "../../services/asset";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getAllOwners } from "../../../owners/services/owner";

export function AssetDataTable({
  assets,
  isLoading,
}: {
  assets: Array<Asset>;
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();

  const { data: owners } = useQuery({
    queryKey: ["owners"],
    queryFn: () => getAllOwners(),
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (assetId: string) => deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Ativo deletado com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "Erro ao deletar ativo";
      toast.error(errorMessage);
    },
  });

  const handleDelete = (asset: Asset) => {
    if (
      window.confirm(`Tem certeza que deseja deletar o ativo "${asset.name}"?`)
    ) {
      deleteAssetMutation.mutate(asset.id);
    }
  };

  const getOwnerName = (ownerId: string): string => {
    const owner = owners?.find(
      (o: { id: string; name: string }) => o.id === ownerId
    );
    return owner?.name || ownerId;
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between py-1">
        <span className="text-gray-700 text-base">
          {assets.length} registros encontrados
        </span>
        <div className="flex items-center gap-2">
          <CreateAssetSheet />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <Table className=" border-gray-300 p-0">
          <TableHeader className="bg-[#f2f7fd]!">
            <TableRow>
              {assetFields.map((column) => (
                <TableHead
                  key={column.key}
                  className="whitespace-nowrap font-semibold text-gray-700 text-base py-3 px-4"
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="whitespace-nowrap font-semibold text-gray-700 text-base py-3 px-4 w-20">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-gray-50">
                {assetFields.map((column) => {
                  let value: string | null;
                  if (column.key === "owner_id") {
                    value = getOwnerName(asset.owner_id);
                  } else {
                    value = asset[column.key as keyof Asset] as string | null;
                  }
                  return (
                    <TableCell
                      key={column.key}
                      className="whitespace-nowrap text-base"
                    >
                      {value || "-"}
                    </TableCell>
                  );
                })}
                <TableCell className="whitespace-nowrap text-base">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(asset)}
                    disabled={deleteAssetMutation.isPending}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
