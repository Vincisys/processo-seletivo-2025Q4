import { Phone, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertOwnerCard } from "../Cards/alert-owner-card";
import { useCreateOwnerSheet } from "../../hooks/use-create-owner-sheet";

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
        <Button
          variant="outline"
          size="sm"
          className="text-sm text-black bg-[#fafcfe]!"
        >
          Criar responsável
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-lg! px-4 py-4">
        <div className="flex flex-col h-full!">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Criar responsável
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Preencha os campos abaixo para criar um novo responsável.
          </p>
          <AlertOwnerCard />
          <div className="mb-3 mt-3">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Digite o nome do responsável..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 w-full h-11!"
              />
            </div>
          </div>
          <div className="mb-3">
            <Label
              htmlFor="column-search"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Email
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="column-search"
                type="email"
                placeholder="Digite o email do responsável..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full h-11"
              />
            </div>
          </div>
          <div className="mb-6 h-full">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Telefone
            </label>
            <div className="space-y-2 overflow-y-auto max-h-full">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="text"
                  placeholder="Digite o telefone do responsável..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 w-full h-11"
                />
              </div>
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
                {isLoading ? "Criando..." : "Criar responsável"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
