import React from 'react';
import { Owner } from '../types/data';


const MOCK_DATA: Owner[] = [
    { id: '1', name: 'João Silva', email: 'joao@teste.com', phone: '1111' },
    { id: '2', name: 'Maria Silva', email: 'maria@teste.com', phone: '22' },
    { id: '3', name: 'Jasmine Leal', email: 'jas@teste.com', phone: '119' },
];

const OwnerList = () => {
  return (
    <div className="list-container">
      <h2>Lista de Responsáveis (Mock)</h2>
      <table>
        <thead>
          <tr><th>Nome</th><th>Email</th><th>Telefone</th></tr>
        </thead>
        <tbody>
          {MOCK_DATA.map(owner => (
            <tr key={owner.id}>
              <td>{owner.name}</td>
              <td>{owner.email}</td>
              <td>{owner.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerList;