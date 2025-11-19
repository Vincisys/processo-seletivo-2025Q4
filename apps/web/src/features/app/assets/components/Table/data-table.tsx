import { useState } from 'react'
import { patientFields } from './columns'
import type { InterviewedPerson } from '../../../types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CustomizeTableSheet from '@/features/app/aps-indicators/components/Tables/Patients/sheet-table'

export function PatientTable({
  patients,
  isLoading,
}: {
  patients: Array<InterviewedPerson>
  isLoading: boolean
}) {
  const [selectedColumns, setSelectedColumns] = useState<Array<string>>([
    'fullName',
    'cpf',
    'cns',
    'biologicalSex',
    'birthdate',
    'contactPhone',
  ])

  const toggleColumn = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey],
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (patients.length === 0) {
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
    )
  }

  return (
    <>
      <div className="flex items-center justify-between py-1">
        <span className="text-gray-700 text-base">
          {patients.length} registros encontrados
        </span>
        <CustomizeTableSheet
          selectedColumns={selectedColumns}
          fields={patientFields}
          toggleColumn={toggleColumn}
        />
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <Table className=" border-gray-300 p-0">
          <TableHeader className="!bg-[#f2f7fd]">
            <TableRow>
              {patientFields.map((column) => (
                <TableHead
                  key={column.key}
                  className="whitespace-nowrap font-semibold text-gray-700 text-base py-3 px-4"
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient, index: number) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {patientFields.map((column) => {
                  const value = patient[column.key as keyof InterviewedPerson]
                  const formattedValue = column.formatter
                    ? column.formatter(value)
                    : (value as string)

                  return (
                    <TableCell
                      key={column.key}
                      className="whitespace-nowrap text-base"
                    >
                      {formattedValue}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
