import { Package, Tag, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertAssetCard } from "../Cards/alert-asset-card";
import { useCreateAssetSheet } from "../../hooks/use-create-asset-sheet";
import { useQuery } from "@tanstack/react-query";
import { getAllOwners } from "../../../owners/services/owner";

export default function CreateAssetSheet() {
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
  } = useCreateAssetSheet();

  const { data: owners } = useQuery({
    queryKey: ["owners"],
    queryFn: () => getAllOwners(),
  });

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-sm text-black bg-[#fafcfe]!"
        >
          Criar ativo
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-lg! px-4 py-4">
        <div className="flex flex-col h-full!">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-gray-900">Criar ativo</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Preencha os campos abaixo para criar um novo ativo.
          </p>
          <AlertAssetCard />
          <div className="mb-3 mt-3">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nome
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Digite o nome do ativo..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 w-full h-11!"
              />
            </div>
          </div>
          <div className="mb-3">
            <Label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Categoria
            </Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="category"
                type="text"
                placeholder="Digite a categoria do ativo..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-10 w-full h-11"
              />
            </div>
          </div>
          <div className="mb-6">
            <Label
              htmlFor="owner"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Responsável
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select value={ownerId} onValueChange={setOwnerId}>
                <SelectTrigger className="pl-10 w-full h-11">
                  <SelectValue placeholder="Selecione um responsável..." />
                </SelectTrigger>
                <SelectContent>
                  {owners?.map((owner) => (
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
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="w-1/4! h-10!"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-[#2db981] hover:bg-[#238d67] text-white h-10!"
              >
                {isLoading ? "Criando..." : "Criar ativo"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

