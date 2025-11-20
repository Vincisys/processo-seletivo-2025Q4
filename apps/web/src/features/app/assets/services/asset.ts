import { api } from "@/lib/api";
import type { AssetCreate, AssetUpdate } from "../types/asset";

export const getAllAssets = async () => {
  const response = await api.get("/integrations/asset/");
  return response.data;
};

export const getAsset = async (assetId: string) => {
  const response = await api.get(`/integrations/asset/${assetId}`);
  return response.data;
};

export const createAsset = async (asset: AssetCreate) => {
  const response = await api.post("/integrations/asset/", asset);
  return response.data;
};

export const updateAsset = async (assetId: string, asset: AssetUpdate) => {
  const response = await api.put(`/integrations/asset/${assetId}`, asset);
  return response.data;
};

export const deleteAsset = async (assetId: string) => {
  await api.delete(`/integrations/asset/${assetId}`);
};

