/**
 * Página inicial da aplicação.
 * 
 * Redireciona automaticamente para a página de ativos (/assets)
 * quando o usuário acessa a raiz da aplicação.
 */

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Componente da página inicial.
 * 
 * Redireciona automaticamente para /assets ao montar.
 * 
 * @returns Mensagem de carregamento durante o redirecionamento
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/assets');
  }, [router]);

  return <div>Carregando...</div>;
}