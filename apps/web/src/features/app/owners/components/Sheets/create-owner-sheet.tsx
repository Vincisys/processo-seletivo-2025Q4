import { Phone, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EyesonButton } from "@/components/EyesonAsset/eyeson-button";
import { EyesonInput } from "@/components/EyesonAsset/eyeson-input";
import { EyesonLabel } from "@/components/EyesonAsset/eyeson-label";
import { AlertOwnerCard } from "../Cards/alert-owner-card";
import { useCreateOwnerSheet } from "../../hooks/use-create-owner-sheet";
import { EyesonTitle } from "@/components/EyesonAsset/eyeson-title";

export default function CreateOwnerSheet() {
  const {
    isOpen,
    name,
    email,
    phone,
    setName,
    setEmail,
    setPhone,
    handleOpenChange,
    handleSubmit,
    handleClose,
    isLoading,
  } = useCreateOwnerSheet();

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <EyesonButton variant="outline">Criar responsável</EyesonButton>
      </SheetTrigger>
      <SheetContent className="max-w-lg! px-4 py-4">
        <div className="flex flex-col h-full!">
          <div className="flex items-center justify-between mb-1">
            <EyesonTitle title="Criar responsável" className="mb-0" />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Preencha os campos abaixo para criar um novo responsável.
          </p>
          <AlertOwnerCard />
          <div className="mb-3 mt-3">
            <EyesonLabel>Nome</EyesonLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EyesonInput
                id="name"
                type="text"
                placeholder="Digite o nome do responsável..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <EyesonLabel htmlFor="column-search">Email</EyesonLabel>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EyesonInput
                id="column-search"
                type="email"
                placeholder="Digite o email do responsável..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6 h-full">
            <EyesonLabel>Telefone</EyesonLabel>
            <div className="space-y-2 overflow-y-auto max-h-full">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <EyesonInput
                  id="phone"
                  type="text"
                  placeholder="Digite o telefone do responsável..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
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
                {isLoading ? "Criando..." : "Criar responsável"}
              </EyesonButton>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
