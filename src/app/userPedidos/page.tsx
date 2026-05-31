"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import PedidosPage from "@/components/Pedidos";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando pedidos...</div>}>
      <PedidosPage />
    </Suspense>
  );
}
