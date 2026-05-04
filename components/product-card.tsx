import Link from 'next/link'
import { Product } from '@/lib/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-6xl font-bold text-primary/20">
              {product.name.charAt(0)}
            </div>
          </div>
          {product.stock < 20 && (
            <Badge className="absolute right-2 top-2 bg-warning text-warning-foreground">
              Últimas unidades
            </Badge>
          )}
        </div>
        <div className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.course}
          </Badge>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {product.category}
          </p>
          <p className="mt-2 text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/produto/${product.id}`} className="w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
