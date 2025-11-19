import { api } from "@/lib/api";
import type { OwnerCreate, OwnerUpdate } from "../types/owner";

export const getAllOwners = async () => {
  const response = await api.get("/integrations/owner/");
  return response.data;
};

export const getOwner = async (ownerId: string) => {
  const response = await api.get(`/integrations/owner/${ownerId}`);
  return response.data;
};

export const createOwner = async (owner: OwnerCreate) => {
  const response = await api.post("/integrations/owner/", owner);
  return response.data;
};

export const updateOwner = async (ownerId: string, owner: OwnerUpdate) => {
  const response = await api.put(`/integrations/owner/${ownerId}`, owner);
  return response.data;
};

export const deleteOwner = async (ownerId: string) => {
  const response = await api.delete(`/integrations/owner/${ownerId}`);
  return response.data;
};
