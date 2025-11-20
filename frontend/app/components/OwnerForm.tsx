'use client'
import React, { useState } from 'react';
import { BaseFormProps } from '../types/data';

const OwnerForm: React.FC<BaseFormProps> = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
        return setMessage("Falha: Nome e Email são obrigatórios!");
    }

    console.log("Submissão Mockada:", formData);
    setMessage(`Sucesso: Proprietário ${formData.name} pronto para ser enviado!`);
    setFormData({ name: '', email: '', phone: '' }); 
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Responsável</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome Completo" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Corporativo" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} />
        <button type="submit">Cadastrar (Mock)</button>
      </form>
    </div>
  );
};

export default OwnerForm;