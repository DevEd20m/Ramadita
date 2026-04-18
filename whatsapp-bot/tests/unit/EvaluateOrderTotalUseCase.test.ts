import { EvaluateOrderTotalUseCase } from '../../src/use-cases/EvaluateOrderTotalUseCase';

describe('EvaluateOrderTotalUseCase', () => {
  const menuPrices = {
    'Ceviche Mixto': 35.0,
    'Jalea': 30.0,
    'Chicha Morada 1L': 15.0
  };

  const useCase = new EvaluateOrderTotalUseCase(menuPrices);

  it('should calculate the total correctly based on prices and quantities', () => {
    const items = [
      { productName: 'Ceviche Mixto', quantity: 2, price: 35.0 }, // 70
      { productName: 'Jalea', quantity: 1, price: 30.0 }           // 30
    ];

    const total = useCase.execute(items);
    expect(total).toBe(100.0);
  });

  it('should fallback to provided price if item is not in dictionary', () => {
    const items = [
      { productName: 'Producto Nuevo', quantity: 1, price: 20.0 }
    ];

    const total = useCase.execute(items);
    expect(total).toBe(20.0);
  });
});
