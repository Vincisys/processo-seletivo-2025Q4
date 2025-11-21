import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOwners } from '../hooks/useOwners';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

export default function OwnerList() {
  const { owners, loading, error, deleteOwner } = useOwners();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone.includes(searchTerm)
  );

  const handleDeleteClick = (owner) => {
    setConfirmDelete(owner);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deleteOwner(confirmDelete.id);
      toast.success('Responsável excluído com sucesso!');
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir responsável');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading size="large" text="Carregando responsáveis..." />
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
        <h1 className="page-title">Responsáveis</h1>
        <div className="page-actions">
          <Link to="/owners/new" className="btn btn-primary">
            ➕ Novo Responsável
          </Link>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        {filteredOwners.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>
              {searchTerm
                ? 'Nenhum responsável encontrado com esse termo de busca.'
                : 'Nenhum responsável cadastrado ainda.'}
            </p>
            {!searchTerm && (
              <Link to="/owners/new" className="btn btn-primary">
                Cadastrar Primeiro Responsável
              </Link>
            )}
          </div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th style={{ width: '180px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>
                      <strong>{owner.name}</strong>
                    </td>
                    <td>{owner.email}</td>
                    <td>{owner.phone}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/owners/${owner.id}`}
                          className="btn btn-sm btn-secondary"
                          title="Ver detalhes"
                        >
                          👁️
                        </Link>
                        <Link
                          to={`/owners/edit/${owner.id}`}
                          className="btn btn-sm btn-secondary"
                          title="Editar"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(owner)}
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
              {filteredOwners.length} responsável(is) encontrado(s)
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
