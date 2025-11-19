import { ownerFields } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Owner } from "../../types/owner";
import CreateOwnerSheet from "../Sheets/create-owner-sheet";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOwner } from "../../services/owner";
import { toast } from "sonner";

export function OwnerDataTable({
  owners,
  isLoading,
}: {
  owners: Array<Owner>;
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();

  const deleteOwnerMutation = useMutation({
    mutationFn: (ownerId: string) => deleteOwner(ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      toast.success("Responsável deletado com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "Erro ao deletar responsável";
      toast.error(errorMessage);
    },
  });

  const handleDelete = (owner: Owner) => {
    if (
      window.confirm(
        `Tem certeza que deseja deletar o responsável "${owner.name}"?`
      )
    ) {
      deleteOwnerMutation.mutate(owner.id);
    }
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

  if (owners.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum filtro selecionado
          </h3>
          <p className="text-gray-500">
            Utilize os filtros acima para buscar os dados
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between py-1">
        <span className="text-gray-700 text-base">
          {owners.length} registros encontrados
        </span>
        <div className="flex items-center gap-2">
          <CreateOwnerSheet />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <Table className=" border-gray-300 p-0">
          <TableHeader className="bg-[#f2f7fd]!">
            <TableRow>
              {ownerFields.map((column) => (
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
            {owners.map((owner, index: number) => (
              <TableRow key={owner.id || index} className="hover:bg-gray-50">
                {ownerFields.map((column) => {
                  const value = owner[column.key as keyof Owner];
                  return (
                    <TableCell
                      key={column.key}
                      className="whitespace-nowrap text-base"
                    >
                      {value}
                    </TableCell>
                  );
                })}
                <TableCell className="whitespace-nowrap text-base">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(owner)}
                    disabled={deleteOwnerMutation.isPending}
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
