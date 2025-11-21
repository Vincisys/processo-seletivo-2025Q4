import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>Bem-vindo ao EyesOnAsset</h1>
        <p className="text-lg text-muted">
          Sistema de Gestão de Ativos Físicos
        </p>
      </div>

      <div className="alert alert-info">
        <strong>ℹ️ Modo Demonstração</strong>
        <p className="mb-0 mt-1">
          Os dados são armazenados localmente no seu navegador (LocalStorage).
          Nenhuma conexão com backend é necessária neste nível.
        </p>
      </div>

      <div className="home-grid">
        <Link to="/owners" className="home-card">
          <div className="home-card-icon">👤</div>
          <h3 className="home-card-title">Responsáveis</h3>
          <p className="home-card-description">
            Gerencie as pessoas responsáveis pelos ativos
          </p>
        </Link>

        <Link to="/assets" className="home-card">
          <div className="home-card-icon">📦</div>
          <h3 className="home-card-title">Ativos</h3>
          <p className="home-card-description">
            Cadastre e acompanhe seus ativos físicos
          </p>
        </Link>
      </div>

      <div className="card">
        <h3 className="mb-3">Funcionalidades Disponíveis</h3>
        <ul className="features-list">
          <li>Cadastro completo de responsáveis com validação</li>
          <li>Listagem e busca de responsáveis</li>
          <li>Cadastro de ativos com categorias</li>
          <li>Filtros e estatísticas de ativos</li>
        </ul>
      </div>
    </div>
  )
}
