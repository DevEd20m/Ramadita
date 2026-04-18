"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifyMissingInformationUseCase = void 0;
class IdentifyMissingInformationUseCase {
    execute(details) {
        const requiredFields = ['name', 'phone', 'paymentMethod', 'address', 'reference'];
        const missing = [];
        for (const field of requiredFields) {
            if (!details[field] || details[field]?.trim() === '') {
                missing.push(field);
            }
        }
        return missing;
    }
}
exports.IdentifyMissingInformationUseCase = IdentifyMissingInformationUseCase;
