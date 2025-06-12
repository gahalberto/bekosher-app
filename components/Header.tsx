'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BeKosherLogo from './ui/BeKosherLogo'

export default function Header() {
  const pathname = usePathname()
  
  // Não exibe o header na área administrativa ou de estabelecimentos
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/establishment')) {
    return null
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <BeKosherLogo />
            </Link>
          </div>
          <nav className="hidden sm:flex sm:space-x-8">
            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Início
            </Link>
            <Link href="/estabelecimentos" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              Estabelecimentos
            </Link>
            <Link href="/admin/login" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              Entrar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 