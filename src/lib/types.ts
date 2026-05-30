// Definindo os tipos de dados para a aplicação

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  course: string
  sizes: string[]
  colors: string[]
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
  personalization?: string
}

export interface Order {
  id: string
  items: CartItem[]
  status: 'pending' | 'production' | 'ready' | 'shipped' | 'delivered'
  customerName: string
  customerEmail: string
  deliveryMethod: 'campus' | 'delivery'
  paymentMethod: 'credit' | 'pix' | 'boleto'
  address?: Address
  subtotal: number
  shipping: number
  total: number
  createdAt: Date
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'staff' | 'admin'
  course?: string
}
