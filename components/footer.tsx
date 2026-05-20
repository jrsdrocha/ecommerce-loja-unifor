import Link from 'next/link'

// Componente de rodapé com informações de contato, links úteis e direitos autorais, estilizado para combinar com o tema da loja

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">U</span>
              </div>
              <span className="text-xl font-bold text-foreground">Loja UNIFOR</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A loja oficial da Universidade de Fortaleza. Produtos acadêmicos personalizados para estudantes e funcionários.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Categorias</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/?category=Camisetas" className="hover:text-foreground transition-colors">Camisetas</Link></li>
              <li><Link href="/?category=Moletons" className="hover:text-foreground transition-colors">Moletons</Link></li>
              <li><Link href="/?category=Kits Acadêmicos" className="hover:text-foreground transition-colors">Kits Acadêmicos</Link></li>
              <li><Link href="/?category=Acessórios" className="hover:text-foreground transition-colors">Acessórios</Link></li>
              <li><Link href="/?category=Papelaria" className="hover:text-foreground transition-colors">Papelaria</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Fale Conosco</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Rastrear Pedido</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Av. Washington Soares, 1321</li>
              <li>Edson Queiroz, Fortaleza - CE</li>
              <li>CEP: 60811-905</li>
              <li className="pt-2">
                <a href="mailto:loja@unifor.br" className="hover:text-foreground transition-colors">
                  loja@unifor.br
                </a>
              </li>
              <li>
                <a href="tel:+558534773000" className="hover:text-foreground transition-colors">
                  (85) 3477-3000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 Loja UNIFOR. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
