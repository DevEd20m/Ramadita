import { OrderItem } from '../domain/entities';

export class EvaluateOrderTotalUseCase {
  constructor(private readonly menuPrices: Record<string, number>) {}

  execute(items: OrderItem[]): number {
    return items.reduce((total, item) => {
      // In a real scenario, map item.productName to the key in menuPrices exactly
      const price = this.menuPrices[item.productName] || item.price;
      return total + (price * item.quantity);
    }, 0);
  }
}
