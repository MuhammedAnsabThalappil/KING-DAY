export type Role = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

export type OrderStatus =
  | 'PLACED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'COD';
export type PaymentMethod = 'COD' | 'RAZORPAY';

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description: string;
  category: string;
  brand?: string;
  images: string[];
  mrp: number;
  salePrice: number;
  stock: number;
  isPublished: boolean;
  panIndiaEligible: boolean;
  ageSuitability?: string;
  weightCapacity?: string;
  specifications?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingState: string;
  shippingPin: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface DashboardStats {
  todaySales: number;
  monthSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  keralaOrders: number;
  lowStockProducts: number;
  revenueChart: { date: string; revenue: number }[];
}
