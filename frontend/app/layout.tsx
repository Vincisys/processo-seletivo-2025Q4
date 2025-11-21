/**
 * Layout raiz da aplicação Next.js.
 * 
 * Define a estrutura HTML base e inclui o componente Navbar
 * em todas as páginas. Configura metadados da aplicação.
 */

import type { Metadata } from 'next'
import Navbar from '@/app/components/Navbar' 

/**
 * Metadados da aplicação para SEO e compartilhamento.
 */
export const metadata: Metadata = {
  title: 'EyesOnAsset CMMS',
  description: 'Gestão de Ativos e Responsáveis',
}

/**
 * Componente de layout raiz que envolve todas as páginas.
 * 
 * @param children - Conteúdo das páginas filhas
 * @returns Estrutura HTML com Navbar e container principal
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
        <Navbar />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {children}
        </main>
      </body>
    </html>
  )
}