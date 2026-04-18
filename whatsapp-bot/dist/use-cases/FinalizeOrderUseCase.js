"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizeOrderUseCase = void 0;
class FinalizeOrderUseCase {
    execute(customer, order) {
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
exports.FinalizeOrderUseCase = FinalizeOrderUseCase;
