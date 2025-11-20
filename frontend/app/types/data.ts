export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  owner_id: string;
  owner_ref?: Owner; 
}

export interface BaseFormProps {
    onSubmitted?: () => void; 
}