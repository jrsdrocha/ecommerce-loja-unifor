'use client';

// Página de administração para gerenciar produtos, pedidos, relatórios e configurações da loja

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Home,
  Menu,
  X,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type OrderStatus = 'pending' | 'production' | 'ready' | 'shipped' | 'delivered';

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);

  const [loadingOrders, setLoadingOrders] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: {
        label: 'Pendente',
        icon: Clock,
        className: 'bg-warning/10 text-warning border-warning/20',
      },
      production: {
        label: 'Em Produção',
        icon: Package,
        className: 'bg-primary/10 text-primary border-primary/20',
      },
      ready: {
        label: 'Pronto',
        icon: CheckCircle,
        className: 'bg-success/10 text-success border-success/20',
      },
      shipped: {
        label: 'Enviado',
        icon: Truck,
        className: 'bg-accent/10 text-accent border-accent/20',
      },
      delivered: {
        label: 'Entregue',
        icon: PackageCheck,
        className: 'bg-muted text-muted-foreground border-muted',
      },
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoadingProducts(true);

        const response = await fetch('/api/produtos');

        const data = await response.json();

        setProducts(data.products || []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoadingProducts(false);
      }
    }

    async function fetchOrders() {
      try {
        setLoadingOrders(true);

        const response = await fetch('/api/admin/pedidos');

        const data = await response.json();

        setOrders(data.orders || []);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchProducts();
    fetchOrders();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stock < 50).length;

  const navItems = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">
                U
              </span>
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              Admin UNIFOR
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Back to Store */}
          <div className="border-t border-sidebar-border p-4">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Home className="h-4 w-4" />
                Voltar à Loja
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-sidebar-border bg-sidebar">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                    <span className="text-sm font-bold text-sidebar-primary-foreground">
                      U
                    </span>
                  </div>
                  <span className="text-lg font-bold text-sidebar-foreground">
                    Admin
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-sidebar-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-sidebar-border p-4">
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground"
                  >
                    <Home className="h-4 w-4" />
                    Voltar à Loja
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold capitalize text-foreground">
            {navItems.find((item) => item.id === activeTab)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 bg-secondary border-0"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total de Produtos
                      </p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                      <AlertCircle className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estoque Baixo
                      </p>
                      <p className="text-2xl font-bold">{lowStockProducts}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Mais Vendido
                      </p>
                      <p className="text-lg font-bold truncate">
                        Camiseta UNIFOR
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <DollarSign className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Valor em Estoque
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPrice(
                          products.reduce(
                            (sum, p) => sum + p.price * p.stock,
                            0,
                          ),
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gerenciar Produtos</CardTitle>
                  <Button>Adicionar Produto</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Curso</TableHead>
                          <TableHead className="text-right">Preço</TableHead>
                          <TableHead className="text-right">Estoque</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                  <span className="text-lg font-bold text-primary/30">
                                    {product.name.charAt(0)}
                                  </span>
                                </div>
                                <span className="font-medium">
                                  {product.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {product.course}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPrice(product.price)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  product.stock < 50
                                    ? 'text-warning font-medium'
                                    : ''
                                }
                              >
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="bg-warning/5 border-warning/20">
                  <CardContent className="p-4 text-center">
                    <Clock className="mx-auto h-6 w-6 text-warning" />
                    <p className="mt-2 text-2xl font-bold">
                      {orders.filter((o) => o.status === 'pending').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Package className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-2 text-2xl font-bold">
                      {orders.filter((o) => o.status === 'production').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Em Produção</p>
                  </CardContent>
                </Card>
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="mx-auto h-6 w-6 text-success" />
                    <p className="mt-2 text-2xl font-bold">
                      {orders.filter((o) => o.status === 'ready').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Prontos</p>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-4 text-center">
                    <Truck className="mx-auto h-6 w-6 text-accent" />
                    <p className="mt-2 text-2xl font-bold">
                      {orders.filter((o) => o.status === 'shipped').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Enviados</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="p-4 text-center">
                    <PackageCheck className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-2 text-2xl font-bold">
                      {orders.filter((o) => o.status === 'delivered').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Entregues</p>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Table */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle>Acompanhamento de Pedidos</CardTitle>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 bg-secondary border-0">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="production">Em Produção</SelectItem>
                      <SelectItem value="ready">Prontos</SelectItem>
                      <SelectItem value="shipped">Enviados</SelectItem>
                      <SelectItem value="delivered">Entregues</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pedido</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Entrega</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.id}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {order.customerName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {order.customerEmail}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {order.deliveryMethod === 'campus'
                                  ? 'Retirada'
                                  : 'Entrega'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(order.total)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                      <DollarSign className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Receita Total
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPrice(totalRevenue)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <ShoppingCart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total de Pedidos
                      </p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Clientes Únicos
                      </p>
                      <p className="text-2xl font-bold">
                        {new Set(orders.map((o) => o.customerEmail)).size}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                      <TrendingUp className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ticket Médio
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPrice(totalRevenue / orders.length)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Placeholder */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        'Camisetas',
                        'Moletons',
                        'Kits Acadêmicos',
                        'Acessórios',
                        'Papelaria',
                      ].map((cat, i) => (
                        <div key={cat} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-muted-foreground">
                            {cat}
                          </div>
                          <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${[75, 60, 45, 35, 25][i]}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm font-medium text-right">
                            {[75, 60, 45, 35, 25][i]}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas por Curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        'Medicina',
                        'Direito',
                        'Engenharia',
                        'Administração',
                        'Psicologia',
                      ].map((course, i) => (
                        <div key={course} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-muted-foreground">
                            {course}
                          </div>
                          <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${[80, 65, 55, 40, 30][i]}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm font-medium text-right">
                            {[80, 65, 55, 40, 30][i]}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Inventory Alert */}
              <Card>
                <CardHeader>
                  <CardTitle>Alertas de Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="text-right">
                            Estoque Atual
                          </TableHead>
                          <TableHead className="text-right">
                            Mínimo Recomendado
                          </TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products
                          .filter((p) => p.stock < 100)
                          .sort((a, b) => a.stock - b.stock)
                          .slice(0, 5)
                          .map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">
                                {product.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {product.stock}
                              </TableCell>
                              <TableCell className="text-right">100</TableCell>
                              <TableCell>
                                {product.stock < 50 ? (
                                  <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                                    Crítico
                                  </Badge>
                                ) : (
                                  <Badge className="bg-warning/10 text-warning border-warning/20">
                                    Baixo
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Loja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Loja</label>
                    <Input
                      defaultValue="Loja UNIFOR"
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      E-mail de Contato
                    </label>
                    <Input
                      defaultValue="loja@unifor.br"
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      defaultValue="(85) 3477-3000"
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Valor do Frete (Entrega)
                    </label>
                    <Input
                      defaultValue="15.00"
                      type="number"
                      step="0.01"
                      className="bg-secondary border-0"
                    />
                  </div>
                  <Button>Salvar Alterações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novos Pedidos</p>
                      <p className="text-sm text-muted-foreground">
                        Receber notificação quando um novo pedido for realizado
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Estoque Baixo</p>
                      <p className="text-sm text-muted-foreground">
                        Receber alerta quando o estoque estiver abaixo do mínimo
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
