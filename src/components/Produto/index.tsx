"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCart } from "@/providers/CartProvider";

// Componente customizado do toast para o Sonner
const CartToast = ({ t }: { t: string | number }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Pequeno atraso para garantir que a transição do CSS seja acionada
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={() => toast.dismiss(t)}
      className="pointer-events-auto relative flex w-[320px] sm:w-[350px] cursor-pointer items-center gap-3 overflow-hidden rounded-lg bg-[#22c55e] p-4 text-white shadow-lg transition-colors hover:bg-[#16a34a]"
    >
      <Check className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">Item adicionado ao carrinho</span>

      <div
        className="absolute bottom-0 left-0 h-1 bg-white/60 transition-all ease-linear"
        style={{
          width: isMounted ? "0%" : "100%",
          transitionDuration: "3000ms",
        }}
      />
    </div>
  );
};

export default function ProductDetailComponent() {
  const params = useParams();
  const router = useRouter();

  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [personalization, setPersonalization] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        const response = await fetch(`/api/produtos/${params.id}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar produto");
        }

        const data = await response.json();

        setProduct(data.product);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || !product) return;

    addItem(
      product,
      quantity,
      selectedSize,
      selectedColor,
      personalization || undefined,
    );

    // Limpar os campos após adicionar ao carrinho
    setSelectedSize("");
    setSelectedColor("");
    setPersonalization("");

    setAdded(true);

    setTimeout(() => setAdded(false), 2000);

    // Chama o toast customizado
    toast.custom((t) => <CartToast t={t} />, {
      duration: 3000,
    });
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Carregando produto...</p>
        </main>

        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Produto não encontrado
            </h1>

            <Link
              href="/"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Voltar para a loja
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="text-9xl font-bold text-primary/20">
                  {product.name?.charAt(0)}
                </div>
              </div>

              {product.stock < 20 && (
                <Badge className="absolute right-4 top-4 bg-warning text-warning-foreground">
                  Últimas unidades
                </Badge>
              )}
            </div>

            <div className="flex flex-col">
              <Badge variant="secondary" className="w-fit mb-2">
                {product.course}
              </Badge>

              <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                {product.name}
              </h1>

              <p className="mt-2 text-lg text-muted-foreground">
                {product.category}
              </p>

              <p className="mt-4 text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                ou 3x de {formatPrice(product.price / 3)} sem juros
              </p>

              <p className="mt-6 text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="size">Tamanho</Label>

                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger
                      id="size"
                      className="w-full bg-secondary border-0"
                    >
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>

                    <SelectContent>
                      {product.sizes?.map((size: string) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>

                  <Select
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                  >
                    <SelectTrigger
                      id="color"
                      className="w-full bg-secondary border-0"
                    >
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>

                    <SelectContent>
                      {product.colors?.map((color: string) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalization">
                    Personalização{" "}
                    <span className="text-muted-foreground">(opcional)</span>
                  </Label>

                  <Input
                    id="personalization"
                    placeholder="Digite o nome para personalização"
                    value={personalization}
                    onChange={(e) => setPersonalization(e.target.value)}
                    maxLength={30}
                    className="bg-secondary border-0"
                  />

                  <p className="text-xs text-muted-foreground">
                    Máximo de 30 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Quantidade</Label>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="w-12 text-center text-lg font-semibold">
                      {quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      {product.stock} disponíveis
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 text-lg"
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor || added}
                >
                  {added ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Adicionado ao Carrinho
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>

                {(!selectedSize || !selectedColor) && (
                  <p className="text-sm text-center text-muted-foreground">
                    Selecione tamanho e cor para continuar
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
