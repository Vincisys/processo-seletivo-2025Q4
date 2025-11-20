import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUpdateAssetMutation } from "./update-asset-mutation";
import type { Asset } from "../types/asset";

export function useEditAssetSheet(asset: Asset | null) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const updateAssetMutation = useUpdateAssetMutation();

  useEffect(() => {
    if (asset && isOpen) {
      setName(asset.name || "");
      setCategory(asset.category || "");
      setOwnerId(asset.owner_id || "");
    }
  }, [asset, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (asset) {
      setName(asset.name || "");
      setCategory(asset.category || "");
      setOwnerId(asset.owner_id || "");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error("O nome é obrigatório");
      return false;
    }

    if (!ownerId.trim()) {
      toast.error("O responsável é obrigatório");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!asset || !validateForm()) {
      return;
    }

    updateAssetMutation.mutate(
      {
        assetId: asset.id,
        data: {
          name: name.trim(),
          category: category.trim() || null,
          owner_id: ownerId.trim(),
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return {
    isOpen,
    name,
    category,
    ownerId,
    setName,
    setCategory,
    setOwnerId,
    handleOpenChange,
    handleSubmit,
    handleClose,
    isLoading: updateAssetMutation.isPending,
  };
}

