import { useState, useEffect } from 'react';
import api from '../services/api';

export function useOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar owners da API
  const fetchOwners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/integrations/owners');
      setOwners(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao carregar responsáveis');
      console.error('Erro ao buscar owners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const addOwner = async (ownerData) => {
    try {
      const response = await api.post('/integrations/owner', ownerData);
      setOwners(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao adicionar responsável';
      throw new Error(errorMsg);
    }
  };

  const updateOwner = async (id, ownerData) => {
    try {
      const response = await api.put(`/integrations/owner/${id}`, ownerData);
      setOwners(prev =>
        prev.map(owner => (owner.id === id ? response.data : owner))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao atualizar responsável';
      throw new Error(errorMsg);
    }
  };

  const deleteOwner = async (id) => {
    try {
      await api.delete(`/integrations/owner/${id}`);
      setOwners(prev => prev.filter(owner => owner.id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao excluir responsável';
      throw new Error(errorMsg);
    }
  };

  const getOwnerById = (id) => {
    return owners.find(owner => owner.id === id);
  };

  return {
    owners,
    loading,
    error,
    addOwner,
    updateOwner,
    deleteOwner,
    getOwnerById,
    refreshOwners: fetchOwners,
  };
}
