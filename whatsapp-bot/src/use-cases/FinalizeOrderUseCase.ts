import { CustomerDetails, Order } from '../domain/entities';

export class FinalizeOrderUseCase {
  execute(customer: CustomerDetails, order: Order): string {
    let summary = `¡Pedido Confirmado! 🎯\n`;
    summary += `*Cliente:* ${customer.name}\n`;
    summary += `*Celular:* ${customer.phone}\n`;
    summary += `*Dirección:* ${customer.address}\n`;
    summary += `*Referencia:* ${customer.reference}\n`;
    summary += `*Pago con:* ${customer.paymentMethod}\n\n`;
    
    summary += `*Pedido:*\n`;
    order.items.forEach(item => {
      summary += `- ${item.quantity}x ${item.productName} (S/ ${item.price})\n`;
    });
    
    summary += `\n*Monto a cobrar:* S/ ${order.totalAmount.toFixed(2)}`;
    return summary;
  }
}
