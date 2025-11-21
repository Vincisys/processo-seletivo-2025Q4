import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useOwners } from '../hooks/useOwners';
import { useToast } from '../hooks/useToast';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import api from '../services/api';

export default function OwnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addOwner, updateOwner } = useOwners();
  const toast = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOwner = async () => {
      if (isEditing && id) {
        setLoading(true);
        try {
          const response = await api.get(`/integrations/owner/${id}`);
          const owner = response.data;
          console.log('OwnerForm - Loaded owner:', owner);
          setFormData(owner);
        } catch (error) {
          console.error('Erro ao carregar owner:', error);
          toast.error('Responsável não encontrado');
          navigate('/owners');
        } finally {
          setLoading(false);
        }
      }
    };

    loadOwner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Executar apenas quando o ID mudar

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.length > 140) return 'Nome deve ter no máximo 140 caracteres';
        return '';

      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        if (value.length > 140) return 'Email deve ter no máximo 140 caracteres';
        return '';

      case 'phone':
        if (!value.trim()) return 'Telefone é obrigatório';
        if (value.length > 20) return 'Telefone deve ter no máximo 20 caracteres';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true });

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      try {
        if (isEditing) {
          await updateOwner(id, formData);
          toast.success('Responsável atualizado com sucesso!');
        } else {
          await addOwner(formData);
          toast.success('Responsável cadastrado com sucesso!');
        }
        navigate('/owners');
      } catch (err) {
        toast.error(err.message || 'Erro ao salvar responsável');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
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
          {isEditing ? 'Editar Responsável' : 'Novo Responsável'}
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
              placeholder="Digite o nome completo"
              disabled={submitting}
            />
            {errors.name && touched.name && (
              <div className="form-error">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label required">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="email@exemplo.com"
              disabled={submitting}
            />
            {errors.email && touched.email && (
              <div className="form-error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label required">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="(00) 00000-0000"
              disabled={submitting}
            />
            {errors.phone && touched.phone && (
              <div className="form-error">{errors.phone}</div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting
                ? '💾 Salvando...'
                : isEditing
                ? '💾 Salvar Alterações'
                : '➕ Cadastrar'}
            </button>
            <Link to="/owners" className="btn btn-secondary">
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
