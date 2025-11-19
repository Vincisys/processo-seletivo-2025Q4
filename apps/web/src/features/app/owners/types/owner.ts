export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface OwnerCreate {
  name: string;
  email: string;
  phone: string;
}

export interface OwnerUpdate {
  name?: string;
  email?: string;
  phone?: string;
}
