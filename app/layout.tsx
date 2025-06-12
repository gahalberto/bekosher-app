import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import ClientToaster from '@/components/ClientToaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BeKosher - Plataforma Kosher',
  description: 'Conectando estabelecimentos kosher com clientes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <ClientToaster />
      </body>
    </html>
  )
} 