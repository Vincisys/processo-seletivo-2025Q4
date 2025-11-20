export interface Asset {
  id: string;
  name: string;
  category: string | null;
  owner_id: string;
}

export interface AssetCreate {
  name: string;
  category?: string | null;
  owner_id: string;
}

export interface AssetUpdate {
  name?: string;
  category?: string | null;
  owner_id?: string;
}

export type AssetField = {
  label: string;
  key: string;
  width: string;
};
