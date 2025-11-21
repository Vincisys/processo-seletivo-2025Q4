import './Loading.css';

const Loading = ({ size = 'medium', text = 'Carregando...' }) => {
  return (
    <div className={`loading-container loading-${size}`}>
      <div className="spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
