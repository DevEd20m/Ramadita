import { CustomerDetails } from '../domain/entities';

export class IdentifyMissingInformationUseCase {
  execute(details: Partial<CustomerDetails>): string[] {
    const requiredFields: (keyof CustomerDetails)[] = ['name', 'phone', 'paymentMethod', 'address', 'reference'];
    const missing: string[] = [];

    for (const field of requiredFields) {
      if (!details[field] || details[field]?.trim() === '') {
        missing.push(field);
      }
    }

    return missing;
  }
}
