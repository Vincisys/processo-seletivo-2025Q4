import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';
import { useToast } from '../hooks/useToast';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import api from '../services/api';

const AssetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteAsset } = useAssets();
  const toast = useToast();

  const [asset, setAsset] = useState(null);
  const [owner, setOwner] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssetDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/integrations/asset/${id}`);
        const assetData = response.data;
        console.log('AssetDetails - Loaded asset:', assetData);
        setAsset(assetData);

        // Buscar dados do responsável se houver
        if (assetData.owner) {
          try {
            const ownerResponse = await api.get(`/integrations/owner/${assetData.owner}`);
            console.log('Loaded owner:', ownerResponse.data);
            setOwner(ownerResponse.data);
          } catch (error) {
            console.error('Erro ao carregar owner:', error);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar asset:', error);
        toast.error('Ativo não encontrado');
        navigate('/assets');
      } finally {
        setLoading(false);
      }
    };

    loadAssetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Executar apenas quando o ID mudar

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAsset(id);
      toast.success('Ativo excluído com sucesso!');
      navigate('/assets');
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir ativo');
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading size="large" text="Carregando detalhes..." />
      </div>
    );
  }

  if (!asset) {
    return null;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Detalhes do Ativo</h1>
        <div className="page-actions">
          <Link to={`/assets/edit/${id}`} className="btn btn-secondary">
            ✏️ Editar
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="btn btn-danger"
          >
            🗑️ Excluir
          </button>
          <Link to="/assets" className="btn btn-secondary">
            ← Voltar
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Informações
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ 
              fontWeight: '600', 
              color: 'var(--text-muted)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              Nome
            </label>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>{asset.name}</p>
          </div>
          <div>
            <label style={{ 
              fontWeight: '600', 
              color: 'var(--text-muted)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              Categoria
            </label>
            <p style={{ margin: 0 }}>
              <span className="badge" style={{ fontSize: '1rem' }}>
                {asset.category}
              </span>
            </p>
          </div>
          <div>
            <label style={{ 
              fontWeight: '600', 
              color: 'var(--text-muted)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              Responsável
            </label>
            {owner ? (
              <p style={{ margin: 0, fontSize: '1.1rem' }}>
                <Link 
                  to={`/owners/${owner.id}`}
                  style={{ 
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  {owner.name}
                </Link>
                <br />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {owner.email} • {owner.phone}
                </span>
              </p>
            ) : (
              <p style={{ 
                margin: 0, 
                color: 'var(--text-muted)', 
                fontStyle: 'italic' 
              }}>
                Sem responsável vinculado
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir "${asset.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        confirmText={deleting ? 'Excluindo...' : 'Excluir'}
        cancelText="Cancelar"
        type="danger"
      />

      {/* Toast notifications */}
      <div className="toast-container">
        {toast.toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={() => toast.hideToast(t.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetDetails;
