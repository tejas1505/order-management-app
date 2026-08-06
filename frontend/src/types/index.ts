export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = "ORDER_RECEIVED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED";

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  unitPrice: string;
  menuItem: MenuItem;
}

export interface Order {
  id: number;
  customerName: string;
  address: string;
  phone: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
}

export interface DeliveryDetails {
  customerName: string;
  address: string;
  phone: string;
}
