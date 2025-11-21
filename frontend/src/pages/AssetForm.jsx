import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';
import { useOwners } from '../hooks/useOwners';
import { useToast } from '../hooks/useToast';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import api from '../services/api';

const SUGGESTED_CATEGORIES = [
  'Eletrônicos',
  'Mobiliário',
  'Veículos',
  'Equipamentos',
  'Ferramentas',
  'Informática',
];

export default function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAsset, updateAsset } = useAssets();
  const { owners, loading: ownersLoading } = useOwners();
  const toast = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    owner: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAsset = async () => {
      if (isEditing && id) {
        setLoading(true);
        try {
          const response = await api.get(`/integrations/asset/${id}`);
          const asset = response.data;
          console.log('AssetForm - Loaded asset:', asset);
          setFormData({
            name: asset.name,
            category: asset.category,
            owner: asset.owner || '',
          });
        } catch (error) {
          console.error('Erro ao carregar asset:', error);
          toast.error('Ativo não encontrado');
          navigate('/assets');
        } finally {
          setLoading(false);
        }
      }
    };

    loadAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Executar apenas quando o ID mudar

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.length > 140) return 'Nome deve ter no máximo 140 caracteres';
        return '';

      case 'category':
        if (!value.trim()) return 'Categoria é obrigatória';
        if (value.length > 60) return 'Categoria deve ter no máximo 60 caracteres';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCategoryClick = (category) => {
    setFormData((prev) => ({ ...prev, category }));
    setTouched((prev) => ({ ...prev, category: true }));
    const error = validateField('category', category);
    setErrors((prev) => ({ ...prev, category: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    ['name', 'category'].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, category: true });

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      try {
        // Preparar dados para envio
        const dataToSubmit = {
          name: formData.name,
          category: formData.category,
          owner: formData.owner || null,
        };

        // Remover owner se for null para criar sem responsável
        if (!dataToSubmit.owner) {
          delete dataToSubmit.owner;
        }

        if (isEditing) {
          await updateAsset(id, dataToSubmit);
          toast.success('Ativo atualizado com sucesso!');
        } else {
          await addAsset(dataToSubmit);
          toast.success('Ativo cadastrado com sucesso!');
        }
        navigate('/assets');
      } catch (err) {
        console.error('Erro ao salvar ativo:', err);
        toast.error(err.message || 'Erro ao salvar ativo');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading || ownersLoading) {
    return (
      <div className="container">
        <Loading size="large" text="Carregando dados..." />
      </div>
    );
  }

  return (
    <div className="container container-sm">
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? 'Editar Ativo' : 'Novo Ativo'}
        </h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label required">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Digite o nome do ativo"
              disabled={submitting}
            />
            {errors.name && touched.name && (
              <div className="form-error">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label required">
              Categoria
            </label>
            <input
              type="text"
              id="category"
              name="category"
              list="categories"
              className={`form-control ${errors.category && touched.category ? 'is-invalid' : ''}`}
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Digite ou selecione uma categoria"
              disabled={submitting}
            />
            <datalist id="categories">
              {SUGGESTED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && touched.category && (
              <div className="form-error">{errors.category}</div>
            )}

            <div className="category-quick-select">
              {SUGGESTED_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="category-chip"
                  onClick={() => handleCategoryClick(cat)}
                  disabled={submitting}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="owner" className="form-label">
              Responsável
            </label>
            <select
              id="owner"
              name="owner"
              className="form-control"
              value={formData.owner}
              onChange={handleChange}
              disabled={submitting || ownersLoading}
            >
              <option value="">Sem responsável</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Campo opcional. Selecione um responsável para vincular ao ativo.
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting
                ? '💾 Salvando...'
                : isEditing
                ? '💾 Salvar Alterações'
                : '➕ Cadastrar'}
            </button>
            <Link to="/assets" className="btn btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>

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
