import { useState } from "react";
import { toast } from "sonner";
import { useCreateOwnerMutation } from "./create-owner-mutation";

export function useCreateOwnerSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const createOwnerMutation = useCreateOwnerMutation();

  const handleClose = () => {
    setIsOpen(false);
    setName("");
    setEmail("");
    setPhone("");
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
    if (!validateForm()) {
      return;
    }

    createOwnerMutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
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
    isLoading: createOwnerMutation.isPending,
  };
}
