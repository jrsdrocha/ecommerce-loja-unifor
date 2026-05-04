'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, QrCode, FileText, MapPin, Building2, Check } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { CartProvider, useCart } from '@/lib/cart-context'

function CheckoutContent() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [deliveryMethod, setDeliveryMethod] = useState('campus')
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const shipping = deliveryMethod === 'delivery' ? 15.0 : 0
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`
    setOrderId(newOrderId)
    setOrderComplete(true)
    clearCart()
    setIsSubmitting(false)
  }

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="mx-auto max-w-md text-center px-4">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Pedido Confirmado!</h1>
            <p className="mt-2 text-muted-foreground">
              Seu pedido <span className="font-semibold text-foreground">{orderId}</span> foi realizado com sucesso.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Você receberá um e-mail com os detalhes do pedido e informações de acompanhamento.
            </p>
            <Link href="/">
              <Button className="mt-8">
                Voltar para a Loja
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Carrinho vazio</h1>
            <p className="mt-2 text-muted-foreground">
              Adicione produtos ao carrinho para finalizar a compra
            </p>
            <Link href="/">
              <Button className="mt-6">
                Ir para a Loja
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
            href="/carrinho"
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao carrinho
          </Link>

          <h1 className="text-3xl font-bold text-foreground">Finalizar Compra</h1>

          <form onSubmit={handleSubmit}>
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              {/* Checkout Form */}
              <div className="space-y-6 lg:col-span-2">
                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" placeholder="Seu nome" required className="bg-secondary border-0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required className="bg-secondary border-0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(00) 00000-0000" required className="bg-secondary border-0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="000.000.000-00" required className="bg-secondary border-0" />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Método de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                      <label
                        htmlFor="campus"
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                          deliveryMethod === 'campus'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="campus" id="campus" />
                        <Building2 className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Retirada no Campus</p>
                          <p className="text-sm text-muted-foreground">
                            Retire seu pedido na loja UNIFOR - Grátis
                          </p>
                        </div>
                        <span className="font-semibold text-success">Grátis</span>
                      </label>
                      <label
                        htmlFor="delivery"
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                          deliveryMethod === 'delivery'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="delivery" id="delivery" />
                        <MapPin className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Entrega em Domicílio</p>
                          <p className="text-sm text-muted-foreground">
                            Receba em casa (Fortaleza e região)
                          </p>
                        </div>
                        <span className="font-semibold">{formatPrice(15)}</span>
                      </label>
                    </RadioGroup>

                    {/* Address Fields */}
                    {deliveryMethod === 'delivery' && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="cep">CEP</Label>
                          <Input id="cep" placeholder="00000-000" required className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="street">Endereço</Label>
                          <Input id="street" placeholder="Rua, Avenida..." required className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="number">Número</Label>
                          <Input id="number" placeholder="123" required className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complement">Complemento</Label>
                          <Input id="complement" placeholder="Apt, Bloco..." className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="neighborhood">Bairro</Label>
                          <Input id="neighborhood" placeholder="Seu bairro" required className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input id="city" placeholder="Fortaleza" required className="bg-secondary border-0" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <label
                        htmlFor="pix"
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                          paymentMethod === 'pix'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="pix" id="pix" />
                        <QrCode className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">PIX</p>
                          <p className="text-sm text-muted-foreground">
                            Pagamento instantâneo - 5% de desconto
                          </p>
                        </div>
                      </label>
                      <label
                        htmlFor="credit"
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                          paymentMethod === 'credit'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="credit" id="credit" />
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Cartão de Crédito</p>
                          <p className="text-sm text-muted-foreground">
                            Parcele em até 3x sem juros
                          </p>
                        </div>
                      </label>
                      <label
                        htmlFor="boleto"
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                          paymentMethod === 'boleto'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="boleto" id="boleto" />
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Boleto Bancário</p>
                          <p className="text-sm text-muted-foreground">
                            Vencimento em 3 dias úteis
                          </p>
                        </div>
                      </label>
                    </RadioGroup>

                    {/* Credit Card Fields */}
                    {paymentMethod === 'credit' && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <Input id="cardNumber" placeholder="0000 0000 0000 0000" required className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="cardName">Nome no Cartão</Label>
                          <Input id="cardName" placeholder="Nome como está no cartão" required className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Validade</Label>
                          <Input id="cardExpiry" placeholder="MM/AA" required className="bg-secondary border-0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input id="cardCvv" placeholder="000" required className="bg-secondary border-0" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={`${item.product.id}-${item.size}-${item.color}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                              <span className="text-lg font-bold text-primary/30">
                                {item.product.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.size} • {item.color} • Qtd: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Frete</span>
                        <span className="font-medium">
                          {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                        </span>
                      </div>
                      {paymentMethod === 'pix' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Desconto PIX (5%)</span>
                          <span className="font-medium text-success">
                            -{formatPrice(total * 0.05)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(paymentMethod === 'pix' ? total * 0.95 : total)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  )
}
