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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOwner } from "../../services/owner";
import { toast } from "sonner";
import DeleteOwnerDialog from "./delete-owner-dialog";

export function OwnerDataTable({
  owners,
  isLoading,
}: {
  owners: Owner[];
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
                  <DeleteOwnerDialog
                    owner={owner}
                    onDelete={(id: string) => deleteOwnerMutation.mutate(id)}
                    isPending={deleteOwnerMutation.isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
