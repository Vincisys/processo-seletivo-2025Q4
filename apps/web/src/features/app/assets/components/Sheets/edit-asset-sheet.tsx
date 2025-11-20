import { Package, Tag, User, Pencil } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EyesonButton } from "@/components/EyesonAsset/eyeson-button";
import { EyesonInput } from "@/components/EyesonAsset/eyeson-input";
import { EyesonLabel } from "@/components/EyesonAsset/eyeson-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertAssetCard } from "../Cards/alert-asset-card";
import { useEditAssetSheet } from "../../hooks/use-edit-asset-sheet";
import { useQuery } from "@tanstack/react-query";
import { getAllOwners } from "../../../owners/services/owner";
import type { Owner } from "@/features/app/owners/types/owner";
import type { Asset } from "../../types/asset";
import { EyesonTitle } from "@/components/EyesonAsset/eyeson-title";

interface EditAssetSheetProps {
  asset: Asset;
}

export default function EditAssetSheet({ asset }: EditAssetSheetProps) {
  const {
    isOpen,
    name,
    category,
    ownerId,
    setName,
    setCategory,
    setOwnerId,
    handleOpenChange,
    handleSubmit,
    handleClose,
    isLoading,
  } = useEditAssetSheet(asset);

  const { data: owners } = useQuery({
    queryKey: ["owners"],
    queryFn: () => getAllOwners(),
  });

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <EyesonButton variant="outline" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
        </EyesonButton>
      </SheetTrigger>
      <SheetContent className="max-w-lg! px-4 py-4">
        <div className="flex flex-col h-full!">
          <div className="flex items-center justify-between mb-1">
            <EyesonTitle title="Editar ativo" className="mb-0" />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Atualize os campos abaixo para editar o ativo.
          </p>
          <AlertAssetCard />
          <div className="mb-3 mt-3">
            <EyesonLabel>Nome</EyesonLabel>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EyesonInput
                id="name"
                type="text"
                placeholder="Digite o nome do ativo..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <EyesonLabel>Categoria</EyesonLabel>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EyesonInput
                type="text"
                placeholder="Digite a categoria do ativo..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <EyesonLabel htmlFor="owner">Responsável</EyesonLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select value={ownerId} onValueChange={setOwnerId}>
                <SelectTrigger className="pl-10 w-full h-11">
                  <SelectValue placeholder="Selecione um responsável..." />
                </SelectTrigger>
                <SelectContent>
                  {owners?.map((owner: Owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-auto pt-6 pb-4 border-gray-200 sticky bottom-0 bg-white">
            <div className="flex gap-3">
              <EyesonButton
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="w-1/4! h-10!"
              >
                Cancelar
              </EyesonButton>
              <EyesonButton
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 h-10!"
              >
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </EyesonButton>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

