import { useState } from "react";
import { toast } from "sonner";
import { useCreateAssetMutation } from "./create-asset-mutation";

export function useCreateAssetSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const createAssetMutation = useCreateAssetMutation();

  const handleClose = () => {
    setIsOpen(false);
    setName("");
    setCategory("");
    setOwnerId("");
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
    if (!validateForm()) {
      return;
    }

    createAssetMutation.mutate(
      {
        name: name.trim(),
        category: category.trim() || null,
        owner_id: ownerId.trim(),
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
    isLoading: createAssetMutation.isPending,
  };
}

