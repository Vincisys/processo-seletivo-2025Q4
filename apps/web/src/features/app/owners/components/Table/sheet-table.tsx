import { Pin, Search, X } from 'lucide-react'
import { useState } from 'react'
import type { TableField } from '@/features/app/aps-indicators/types'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CustomizeTableSheetProps {
  selectedColumns: Array<string>
  fields: Array<TableField>
  toggleColumn: (columnKey: string) => void
}

export default function CustomizeTableSheet({
  selectedColumns,
  fields,
  toggleColumn,
}: CustomizeTableSheetProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredColumns = fields.filter((column: TableField) =>
    column.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-sm text-black !bg-[#fafcfe]"
        >
          Personalizar tabela
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-lg px-4 py-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Personalizar tabela
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Selecione as colunas para exibir na tabela.
          </p>
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Conjunto de colunas
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full !h-11">
                <SelectValue
                  placeholder="Selecione um conjunto"
                  className="!text-lg !font-medium"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">X-Tudo</SelectItem>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="medical">Médico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-3">
            <Label
              htmlFor="column-search"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Buscar colunas
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="column-search"
                type="text"
                placeholder="Digite o nome da coluna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-11"
                maxLength={10}
              />
            </div>
          </div>
          <div className="mb-6 h-full">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              {selectedColumns.length} colunas selecionadas
            </label>
            <div className="space-y-2 overflow-y-auto max-h-full">
              {filteredColumns.map((column: TableField) => (
                <div
                  key={column.key}
                  className={`flex items-center h-11 justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedColumns.includes(column.key)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => toggleColumn(column.key)}
                >
                  <span
                    className={`text-sm font-medium ${
                      selectedColumns.includes(column.key)
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {column.label}
                  </span>
                  {selectedColumns.includes(column.key) && (
                    <Pin className="h-4 w-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-6 pb-4 border-gray-200 sticky bottom-0 bg-white">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="!w-1/4 !h-10"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-[#2db981] hover:bg-green-700 text-white !h-10"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
