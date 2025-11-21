import { useState, useEffect } from 'react';
import api from '../services/api';

export function useAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar assets da API
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/integrations/assets');
      setAssets(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao carregar ativos');
      console.error('Erro ao buscar assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const addAsset = async (assetData) => {
    try {
      const response = await api.post('/integrations/asset', assetData);
      setAssets(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao adicionar ativo';
      throw new Error(errorMsg);
    }
  };

  const updateAsset = async (id, assetData) => {
    try {
      const response = await api.put(`/integrations/asset/${id}`, assetData);
      setAssets(prev =>
        prev.map(asset => (asset.id === id ? response.data : asset))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao atualizar ativo';
      throw new Error(errorMsg);
    }
  };

  const deleteAsset = async (id) => {
    try {
      await api.delete(`/integrations/asset/${id}`);
      setAssets(prev => prev.filter(asset => asset.id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao excluir ativo';
      throw new Error(errorMsg);
    }
  };

  const getAssetById = (id) => {
    return assets.find(asset => asset.id === id);
  };

  return {
    assets,
    loading,
    error,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById,
    refreshAssets: fetchAssets,
  };
}
