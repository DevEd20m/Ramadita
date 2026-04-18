export interface CustomerDetails {
  name?: string;
  phone?: string;
  paymentMethod?: string;
  address?: string;
  reference?: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  items: OrderItem[];
  totalAmount: number;
}

export enum ConversationState {
  GREETING = 'GREETING',
  ORDERING = 'ORDERING',
  COLLECTING_INFO = 'COLLECTING_INFO',
  CONFIRMED = 'CONFIRMED'
}

export interface SessionContext {
  phoneNumber: string;
  state: ConversationState;
  customerDetails: CustomerDetails;
  order?: Order;
}
