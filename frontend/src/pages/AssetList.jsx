import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';
import { useOwners } from '../hooks/useOwners';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export default function AssetList() {
  const { assets, loading: assetsLoading, error, deleteAsset } = useAssets();
  const { owners, loading: ownersLoading } = useOwners();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const categories = useMemo(() => {
    const unique = [...new Set(assets.map((asset) => asset.category))];
    return unique.sort();
  }, [assets]);

  const getOwnerName = (ownerId) => {
    if (!ownerId) return '-';
    const owner = owners.find((o) => o.id === ownerId);
    return owner ? owner.name : 'Desconhecido';
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || asset.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (asset) => {
    setConfirmDelete(asset);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deleteAsset(confirmDelete.id);
      toast.success('Ativo excluído com sucesso!');
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir ativo');
    } finally {
      setDeleting(false);
    }
  };

  if (assetsLoading || ownersLoading) {
    return (
      <div className="container">
        <Loading size="large" text="Carregando ativos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Ativos</h1>
        <div className="page-actions">
          <Link to="/assets/new" className="btn btn-primary">
            ➕ Novo Ativo
          </Link>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{assets.length}</span>
            <span className="stat-label">Total de Ativos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{categories.length}</span>
            <span className="stat-label">Categorias</span>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Buscar por nome ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {filteredAssets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>
              {searchTerm || categoryFilter
                ? 'Nenhum ativo encontrado com esses filtros.'
                : 'Nenhum ativo cadastrado ainda.'}
            </p>
            {!searchTerm && !categoryFilter && (
              <Link to="/assets/new" className="btn btn-primary">
                Cadastrar Primeiro Ativo
              </Link>
            )}
          </div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Responsável</th>
                  <th style={{ width: '180px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <strong>{asset.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-primary">{asset.category}</span>
                    </td>
                    <td>{getOwnerName(asset.owner)}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/assets/${asset.id}`}
                          className="btn btn-sm btn-secondary"
                          title="Ver detalhes"
                        >
                          👁️
                        </Link>
                        <Link
                          to={`/assets/edit/${asset.id}`}
                          className="btn btn-sm btn-secondary"
                          title="Editar"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(asset)}
                          className="btn btn-sm btn-danger"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                padding: '1rem',
                textAlign: 'center',
                color: 'var(--gray-500)',
                fontSize: '0.875rem',
              }}
            >
              {filteredAssets.length} ativo(s) encontrado(s)
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir "${confirmDelete?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
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
}
