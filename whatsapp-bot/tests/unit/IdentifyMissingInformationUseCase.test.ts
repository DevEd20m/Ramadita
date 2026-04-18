import { IdentifyMissingInformationUseCase } from '../../src/use-cases/IdentifyMissingInformationUseCase';

describe('IdentifyMissingInformationUseCase', () => {
  const useCase = new IdentifyMissingInformationUseCase();

  it('should return empty array if all information is provided', () => {
    const missing = useCase.execute({
      name: 'Juan Perez',
      phone: '987654321',
      paymentMethod: 'Yape',
      address: 'Av. Larco 123',
      reference: 'Frente al parque'
    });
    expect(missing.length).toBe(0);
  });

  it('should return missing fields if some are omitted', () => {
    const missing = useCase.execute({
      name: 'Juan Perez',
      phone: '987654321',
      // paymentMethod omitted
      address: 'Av. Larco 123'
      // reference omitted
    });
    expect(missing).toContain('paymentMethod');
    expect(missing).toContain('reference');
    expect(missing.length).toBe(2);
  });
});
