/**
 * Página de gestão de responsáveis (Owners).
 * 
 * Página principal para gerenciar responsáveis, incluindo:
 * - Criação de novos responsáveis
 * - Edição de responsáveis existentes
 * - Listagem de todos os responsáveis
 * 
 * Protegida por autenticação via useAuthRedirect.
 */

'use client'; 
import React, { useState } from 'react';
import OwnerForm from '@/app/components/OwnerForm';
import OwnerList from '@/app/components/OwnerList';
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { Owner } from "@/app/types/data"

/**
 * Componente da página de gestão de responsáveis.
 * 
 * Gerencia o estado de edição e coordena a comunicação entre
 * OwnerForm e OwnerList através de callbacks.
 * 
 * @returns Página com formulário e lista de responsáveis
 */
const OwnersPage = () => {
    useAuthRedirect()
    
    const [fetchTrigger, setFetchTrigger] = useState(0); 
    const [editingOwner, setEditingOwner] = useState<Owner | null>(null);

    const refreshList = () => {
        setFetchTrigger(prev => prev + 1);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestão de Responsáveis</h1>
            <OwnerForm 
                onOwnerUpdated={refreshList} 
                initialData={editingOwner}
                onCancelEdit={() => setEditingOwner(null)}
            />
            
            <hr style={{ margin: '20px 0' }} />
            
            <OwnerList 
                fetchTrigger={fetchTrigger} 
                onEdit={(owner) => setEditingOwner(owner)}
            />
        </div>
    );
};

export default OwnersPage;