/**
 * Módulo de definições de tipos TypeScript para a aplicação.
 * 
 * Contém interfaces e tipos usados em toda a aplicação frontend,
 * incluindo modelos de dados, props de componentes e estruturas de erro.
 */

/**
 * Interface que representa um responsável (Owner) no sistema.
 */
export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * Interface para dados de criação de um responsável.
 * Usada em formulários de criação (sem o campo ID).
 */
export interface OwnerCreateData {
  name: string;
  email: string;
  phone: string;
}

/**
 * Props do componente OwnerList.
 */
export interface OwnerListProps {
  fetchTrigger: number;
  onEdit: (owner: Owner) => void
}

/**
 * Props do componente OwnerForm.
 */
export interface OwnerFormProps {
  onOwnerUpdated: () => void;
  initialData?: Owner | null; 
  onCancelEdit: () => void;
}

/**
 * Interface para erros retornados pela API FastAPI.
 * O campo detail pode ser uma string, array ou objeto.
 */
export interface FastAPIError {
  detail: string | any[] | object;
}

/**
 * Interface que representa um ativo (Asset) no sistema.
 */
export interface Asset {
  id: string;
  name: string;
  category: string;
  owner_id: string;
  owner_ref?: Owner; 
}

/**
 * Interface para dados de criação de um ativo.
 * Usada em formulários de criação (sem o campo ID).
 */
export interface AssetCreateData {
  name: string;
  category: string;
  owner_id: string; 
}

/**
 * Props do componente AssetList.
 */
export interface AssetListProps {
  fetchTrigger: number;
  onEdit: (asset: Asset) => void
}

/**
 * Props do componente AssetForm.
 */
export interface AssetFormProps {
  onAssetUpdated: () => void;
  initialData?: Asset | null; 
  onCancelEdit: () => void;
}

/**
 * Props base para componentes de formulário.
 */
export interface BaseFormProps {
    onSubmitted?: () => void; 
}