import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUpdateOwnerMutation } from "./update-owner-mutation";
import type { Owner } from "../types/owner";

export function useEditOwnerSheet(owner: Owner | null) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const updateOwnerMutation = useUpdateOwnerMutation();

  useEffect(() => {
    if (owner && isOpen) {
      setName(owner.name || "");
      setEmail(owner.email || "");
      setPhone(owner.phone || "");
    }
  }, [owner, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (owner) {
      setName(owner.name || "");
      setEmail(owner.email || "");
      setPhone(owner.phone || "");
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

    if (!email.trim()) {
      toast.error("O email é obrigatório");
      return false;
    }

    if (!phone.trim()) {
      toast.error("O telefone é obrigatório");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email inválido");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!owner || !validateForm()) {
      return;
    }

    updateOwnerMutation.mutate(
      {
        ownerId: owner.id,
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
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
    email,
    phone,
    setName,
    setEmail,
    setPhone,
    handleOpenChange,
    handleSubmit,
    handleClose,
    isLoading: updateOwnerMutation.isPending,
  };
}

