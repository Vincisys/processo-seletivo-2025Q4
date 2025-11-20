import React from 'react';
import { Asset } from '../types/data';

const MOCK_DATA: Asset[] = [
    { id: 'A1', name: 'Empilhadeira', category: 'Veículo', owner_id: '1', owner_ref: {id: '1', name: 'João Silva', email: '', phone: ''} },
    { id: 'A2', name: 'Caminhão', category: 'Veículo', owner_id: '1', owner_ref: {id: '1', name: 'João Silva', email: '', phone: ''} },
    { id: 'A3', name: 'Carro', category: 'Veículo', owner_id: '3', owner_ref: {id: '3', name: 'Jasmine Leal', email: '', phone: ''} },
];

const AssetList = () => {
  return (
    <div className="list-container">
      <h2>Lista de Ativos (Mock)</h2>
      <table>
        <thead>
          <tr><th>Nome</th><th>Categoria</th>{/* <th>Responsável</th> */}</tr>
        </thead>
        <tbody>
          {MOCK_DATA.map(asset => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.category}</td>
              {/* <td>{asset.owner_ref ? asset.owner_ref.name : 'N/A'}</td> */} 
              {/* Não entendi porque não exibir o Owner, mas, caso seja preciso adicionar, basta descomentar os trechos de código acima */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;