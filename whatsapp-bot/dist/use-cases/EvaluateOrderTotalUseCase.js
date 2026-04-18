"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateOrderTotalUseCase = void 0;
class EvaluateOrderTotalUseCase {
    menuPrices;
    constructor(menuPrices) {
        this.menuPrices = menuPrices;
    }
    execute(items) {
        return items.reduce((total, item) => {
            // In a real scenario, map item.productName to the key in menuPrices exactly
            const price = this.menuPrices[item.productName] || item.price;
            return total + (price * item.quantity);
        }, 0);
    }
}
exports.EvaluateOrderTotalUseCase = EvaluateOrderTotalUseCase;
