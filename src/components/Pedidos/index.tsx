"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CreditCard, Package, Truck } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  production: "Em produção",
  ready: "Pronto",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const deliveryLabel: Record<string, string> = {
  campus: "Retirada no campus",
  delivery: "Entrega em domicílio",
};

const paymentLabel: Record<string, string> = {
  pix: "PIX",
  credit: "Cartão de Crédito",
  debit: "Cartão de Débito",
  boleto: "Boleto",
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [pendingConfirmationId, setPendingConfirmationId] = useState<
    string | null
  >(null);
  const [statusLoading, setStatusLoading] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const response = await fetch("/api/pedidos", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Erro ao buscar pedidos.");
          setOrders([]);
        } else {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setMessage("Erro ao buscar pedidos.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const handleRequestConfirm = (orderId: string) => {
    setPendingConfirmationId((current) =>
      current === orderId ? null : orderId,
    );
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setMessage("");
    setStatusLoading((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await fetch(`/api/pedidos/${orderId}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erro ao confirmar entrega.");
        return;
      }

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? data.order : order)),
      );
      setPendingConfirmationId(null);
      setMessage("Entrega confirmada com sucesso.");
    } catch (error) {
      console.error("Erro ao confirmar entrega:", error);
      setMessage("Erro ao confirmar entrega.");
    } finally {
      setStatusLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Meus pedidos
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Histórico de compras
            </h1>
            <p className="text-sm text-muted-foreground">
              Aqui você vê todos os pedidos realizados e pode confirmar entrega
              quando o pedido chegar.
            </p>
          </div>

          {loading ? (
            <div className="rounded-lg border border-border bg-secondary/50 p-8 text-center text-sm text-muted-foreground">
              Carregando pedidos...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-border bg-secondary p-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/80 text-primary">
                <Package className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Nenhuma compra realizada ainda
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Quando você fizer um pedido, ele aparecerá aqui para
                acompanhamento.
              </p>
              <Link href="/">
                <Button className="mt-6">Continuar Comprando</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {message ? (
                <div className="rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground">
                  {message}
                </div>
              ) : null}

              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="space-y-4 border-b border-border px-6 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Pedido {order.id}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          {statusLabel[order.status] || order.status}
                        </Button>
                        {order.status !== "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestConfirm(order.id)}
                          >
                            Confirmar entrega
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-border bg-secondary/80 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Entrega
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {deliveryLabel[order.deliveryMethod] ||
                            order.deliveryMethod}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-secondary/80 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Pagamento
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {paymentLabel[order.paymentMethod] ||
                            order.paymentMethod}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-secondary/80 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Total
                        </p>
                        <p className="mt-2 text-lg font-semibold text-primary">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 px-6 py-4">
                    {pendingConfirmationId === order.id && (
                      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                        <div className="flex items-center gap-2 font-medium">
                          <AlertTriangle className="h-4 w-4" />
                          Deseja confirmar entrega deste pedido?
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleConfirmDelivery(order.id)}
                            disabled={statusLoading[order.id]}
                          >
                            {statusLoading[order.id]
                              ? "Confirmando..."
                              : "Sim, confirmar entrega"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPendingConfirmationId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-[0.2em]">
                          <Package className="h-4 w-4" />
                          Itens do pedido
                        </div>
                        <div className="space-y-3">
                          {order.items.map((item: any, index: number) => (
                            <div
                              key={`${order.id}-${index}`}
                              className="rounded-2xl border border-border bg-background p-4"
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <h3 className="font-semibold text-foreground">
                                    {item.productName}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Quantidade: {item.quantity} • Tamanho:{" "}
                                    {item.size} • Cor: {item.color}
                                  </p>
                                </div>
                                <p className="font-semibold text-foreground">
                                  {formatPrice(item.totalPrice)}
                                </p>
                              </div>
                              {item.personalization ? (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Personalização: {item.personalization}
                                </p>
                              ) : null}
                              <p className="mt-2 text-sm text-muted-foreground">
                                Valor unitário: {formatPrice(item.unitPrice)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 rounded-2xl border border-border bg-secondary/80 p-4 overflow-hidden break-words">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-[0.2em]">
                            <Truck className="h-4 w-4" />
                            Informações de entrega
                          </div>
                          {order.deliveryMethod === "delivery" &&
                          order.address ? (
                            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                              <p>
                                <span className="font-medium text-foreground">
                                  Endereço:
                                </span>{" "}
                                {order.address.street}, {order.address.number}
                              </p>
                              {order.address.complement ? (
                                <p>
                                  <span className="font-medium text-foreground">
                                    Complemento:
                                  </span>{" "}
                                  {order.address.complement}
                                </p>
                              ) : null}
                              <p>
                                <span className="font-medium text-foreground">
                                  Bairro:
                                </span>{" "}
                                {order.address.neighborhood}
                              </p>
                              <p>
                                <span className="font-medium text-foreground">
                                  Cidade/UF:
                                </span>{" "}
                                {order.address.city} - {order.address.state}
                              </p>
                              <p>
                                <span className="font-medium text-foreground">
                                  CEP:
                                </span>{" "}
                                {order.address.cep}
                              </p>
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-muted-foreground">
                              Retirada diretamente no campus.
                            </p>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-[0.2em]">
                            <CreditCard className="h-4 w-4" />
                            Método de pagamento
                          </div>
                          <p className="mt-3 text-sm text-foreground">
                            {paymentLabel[order.paymentMethod] ||
                              order.paymentMethod}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">
                            Resumo do pedido
                          </p>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Frete</span>
                              <span>{formatPrice(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-foreground">
                              <span>Total</span>
                              <span>{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
