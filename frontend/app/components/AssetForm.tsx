'use client'
import React, { useState } from 'react';
import { BaseFormProps } from '../types/data';

const MOCK_OWNERS = [ 
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Souza' },
    { id: '3', name: 'Jasmine Leal' },
];

const AssetForm: React.FC<BaseFormProps> = () => {
  const [formData, setFormData] = useState({ name: '', category: '', owner_id: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.owner_id) {
        return setMessage("Falha: Todos os campos são obrigatórios!");
    }
    
    console.log("Submissão Mockada:", formData);
    setMessage(`Sucesso: Ativo ${formData.name} pronto para ser enviado!`);
    setFormData({ name: '', category: '', owner_id: '' }); 
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Ativo</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome do Ativo" value={formData.name} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Categoria" value={formData.category} onChange={handleChange} required />
        <input type="text" name="owner" placeholder="Owner" value={formData.owner_id} onChange={handleChange} required />

        {/* 
        Se pudesse exibir os Owners, essa solução seria legal, fazendo uma listagem de todos os Owners existentes

        <select name="owner_id" value={formData.owner_id} onChange={handleChange} required>
            <option value="">Selecione o Responsável</option>
            {MOCK_OWNERS.map(owner => (
                <option key={owner.id} value={owner.id}>
                    {owner.name}
                </option>
            ))}
        </select>
        */}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default AssetForm;