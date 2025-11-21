import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOwners } from '../hooks/useOwners';
import { useAssets } from '../hooks/useAssets';
import { useToast } from '../hooks/useToast';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import api from '../services/api';

const OwnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteOwner } = useOwners();
  const { assets } = useAssets();
  const toast = useToast();

  const [owner, setOwner] = useState(null);
  const [ownerAssets, setOwnerAssets] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOwnerDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/integrations/owner/${id}`);
        const ownerData = response.data;
        console.log('OwnerDetails - Loaded owner:', ownerData);
        setOwner(ownerData);

        // Filtrar ativos deste responsável
        const filtered = assets.filter(asset => asset.owner === id);
        console.log('Filtered assets:', filtered);
        setOwnerAssets(filtered);
      } catch (error) {
        console.error('Erro ao carregar owner:', error);
        toast.error('Responsável não encontrado');
        navigate('/owners');
      } finally {
        setLoading(false);
      }
    };

    loadOwnerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, assets]); // Executar quando ID ou assets mudarem

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteOwner(id);
      toast.success('Responsável excluído com sucesso!');
      navigate('/owners');
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir responsável');
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

  if (!owner) {
    return null;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Detalhes do Responsável</h1>
        <div className="page-actions">
          <Link to={`/owners/edit/${id}`} className="btn btn-secondary">
            ✏️ Editar
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="btn btn-danger"
          >
            🗑️ Excluir
          </button>
          <Link to="/owners" className="btn btn-secondary">
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
            <p style={{ margin: 0, fontSize: '1.1rem' }}>{owner.name}</p>
          </div>
          <div>
            <label style={{ 
              fontWeight: '600', 
              color: 'var(--text-muted)', 
              fontSize: '0.875rem',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              Email
            </label>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              <a href={`mailto:${owner.email}`}>{owner.email}</a>
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
              Telefone
            </label>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              <a href={`tel:${owner.phone}`}>{owner.phone}</a>
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Ativos Vinculados ({ownerAssets.length})
        </h2>
        {ownerAssets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p>Nenhum ativo vinculado a este responsável.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ownerAssets.map(asset => (
                <tr key={asset.id}>
                  <td><strong>{asset.name}</strong></td>
                  <td>
                    <span className="badge">{asset.category}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/assets/${asset.id}`}
                        className="btn btn-sm btn-secondary"
                        title="Ver detalhes"
                      >
                        👁️
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir "${owner.name}"? ${
          ownerAssets.length > 0 
            ? `Este responsável possui ${ownerAssets.length} ativo(s) vinculado(s). ` 
            : ''
        }Esta ação não pode ser desfeita.`}
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

export default OwnerDetails;
