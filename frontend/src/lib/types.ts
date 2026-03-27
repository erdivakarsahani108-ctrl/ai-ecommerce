export type Category = { id: number; name: string; slug: string };

export type Product = {
  id: number;
  category: Category;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  image_url: string;
};

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

export type Cart = { id: number; items: CartItem[] };

export type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

export type Order = {
  id: number;
  status: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  shipping_name: string;
  shipping_address1: string;
  shipping_address2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  items: OrderItem[];
  created_at: string;
};

export type User = { id: number; username: string; email: string; first_name: string; last_name: string };

