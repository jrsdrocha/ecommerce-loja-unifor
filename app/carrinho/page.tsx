'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'

function CartContent() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const shipping = items.length > 0 ? 15.0 : 0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Seu carrinho está vazio</h1>
            <p className="mt-2 text-muted-foreground">
              Adicione produtos para continuar comprando
            </p>
            <Link href="/">
              <Button className="mt-6">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>

          <h1 className="text-3xl font-bold text-foreground">Carrinho de Compras</h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={`${item.product.id}-${item.size}-${item.color}`} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Product Image */}
                        <div className="relative aspect-square w-full sm:w-32 md:w-40 bg-secondary">
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                            <div className="text-4xl font-bold text-primary/20">
                              {item.product.name.charAt(0)}
                            </div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {item.product.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                              <span>Tamanho: {item.size}</span>
                              <span>•</span>
                              <span>Cor: {item.color}</span>
                              {item.personalization && (
                                <>
                                  <span>•</span>
                                  <span>Personalização: {item.personalization}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Price */}
                            <p className="text-lg font-bold text-primary">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ou 3x de {formatPrice(total / 3)} sem juros
                  </p>

                  <Link href="/checkout" className="block">
                    <Button size="lg" className="w-full h-12 text-base">
                      Finalizar Compra
                    </Button>
                  </Link>

                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full">
                      Continuar Comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CartPage() {
  return <CartContent />
}
