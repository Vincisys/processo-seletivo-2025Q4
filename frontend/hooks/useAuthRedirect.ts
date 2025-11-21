/**
 * Hook customizado para validação de autenticação e redirecionamento.
 * 
 * Este hook verifica se o usuário está autenticado ao montar o componente.
 * Se não houver token ou se o token for inválido, redireciona para a página de login.
 * 
 * @example
 * ```tsx
 * const MyPage = () => {
 *   useAuthRedirect(); // Protege a página
 *   return <div>Conteúdo protegido</div>;
 * };
 * ```
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/axios';

/**
 * Hook que valida a sessão do usuário e redireciona para login se necessário.
 * 
 * Executa uma validação ao montar o componente:
 * - Verifica se existe token no localStorage
 * - Valida o token fazendo uma requisição à API
 * - Redireciona para /login se não autenticado ou token inválido
 */
export const useAuthRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('access_token');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                await api.get('/integrations/user'); 
            } catch (error: any) {
                console.error("Sessão inválida:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    router.push('/login');
                }
            }
        };

        validateSession();
    }, [router]);
};