import { formatDate } from 'date-fns'
import type { TableField } from '@/features/app/aps-indicators/types'

function maskCpf(cpf: string): string {
  if (!cpf) return ''
  // Remove non-numeric
  const nums = cpf.replace(/\D/g, '')
  if (nums.length !== 11) return cpf
  return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function maskCns(cns: string): string {
  if (!cns) return ''
  // Remove non-numeric
  const nums = cns.replace(/\D/g, '')
  if (nums.length !== 15) return cns
  return nums.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
}

function formatCondition(value: boolean): string {
  return value ? 'Sim' : 'Não'
}

export const patientFields: Array<TableField> = [
  { label: 'Nome', key: 'fullName', width: '500px' },
  { label: 'CPF', key: 'cpf', formatter: maskCpf },
  { label: 'CNS', key: 'cns', formatter: maskCns },
  {
    label: 'Data de Nascimento',
    key: 'birthdate',
    formatter: (value: string) => formatDate(new Date(value), 'dd/MM/yyyy'),
  },
  { label: 'Sexo Biológico', key: 'biologicalSex' },
  { label: 'Gênero', key: 'gender' },
  { label: 'Raça/Cor', key: 'race' },
  { label: 'Telefone', key: 'contactPhone' },
  {
    label: 'Na Escola',
    key: 'isAtSchool',
    formatter: (value: boolean) => formatCondition(value),
  },
  {
    label: 'Tem Transporte',
    key: 'isUsingSchoolTransport',
    formatter: (value: boolean) => formatCondition(value),
  },
  { label: 'Tipo de Escola', key: 'schoolType' },
  { label: 'Tipo de Inclusão', key: 'inclusionType' },
  {
    label: 'Tem Cuidador',
    key: 'hasSchoolCaretaker',
    formatter: (value: boolean) => formatCondition(value),
  },
  {
    label: 'Última atualização',
    key: 'updatedAt',
    formatter: (value: string) => formatDate(new Date(value), 'dd/MM/yyyy'),
  },
]
