'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

export function Header() {
  const { itemCount } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">U</span>
          </div>
          <span className="hidden text-xl font-bold text-foreground sm:inline-block">
            Loja UNIFOR
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href="/" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Início
          </Link>
          <Link 
            href="/?category=Camisetas" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Camisetas
          </Link>
          <Link 
            href="/?category=Moletons" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Moletons
          </Link>
          <Link 
            href="/?category=Kits Acadêmicos" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Kits
          </Link>
          <Link 
            href="/?category=Acessórios" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Acessórios
          </Link>
        </nav>

        {/* Desktop Search */}
        <div className="hidden w-full max-w-sm items-center gap-2 lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar produtos..." 
              className="w-full pl-9 bg-secondary border-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          {/* Cart */}
          <Link href="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          <Link href="/login">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card">
              <nav className="flex flex-col gap-4 pt-8">
                <Link 
                  href="/" 
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  Início
                </Link>
                <Link 
                  href="/?category=Camisetas" 
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  Camisetas
                </Link>
                <Link 
                  href="/?category=Moletons" 
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  Moletons
                </Link>
                <Link 
                  href="/?category=Kits Acadêmicos" 
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  Kits Acadêmicos
                </Link>
                <Link 
                  href="/?category=Acessórios" 
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  Acessórios
                </Link>
                <Link 
                  href="/admin" 
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Painel Admin
                </Link>
                <hr className="my-2 border-border" />
                <Link 
                  href="/login" 
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro" 
                  className="text-lg font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Criar conta
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-border px-4 py-3 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar produtos..." 
              className="w-full pl-9 bg-secondary border-0"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
