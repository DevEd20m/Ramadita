"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = void 0;
const firestore_1 = require("firebase-admin/firestore");
const AppError_1 = require("../../errors/AppError");
const logger_1 = require("../../utils/logger");
class SessionStore {
    db;
    collectionName = 'sessions';
    constructor() {
        // Use the specific database ID 'botcito' provided by the user
        // In firebase-admin, you can pass the database name to getFirestore
        this.db = (0, firestore_1.getFirestore)('botcito');
    }
    async getHistory(phoneNumber) {
        try {
            const doc = await this.db.collection(this.collectionName).doc(phoneNumber).get();
            if (!doc.exists)
                return [];
            return doc.data().history || [];
        }
        catch (error) {
            logger_1.logger.error('Error loading session history', error, { phoneNumber });
            throw new AppError_1.SessionError('Failed to load session history', { phoneNumber });
        }
    }
    async addMessage(phoneNumber, message) {
        try {
            const docRef = this.db.collection(this.collectionName).doc(phoneNumber);
            const doc = await docRef.get();
            if (!doc.exists) {
                await docRef.set({ history: [message] });
            }
            else {
                await docRef.update({
                    history: firestore_1.FieldValue.arrayUnion(message)
                });
            }
        }
        catch (error) {
            logger_1.logger.error('Error saving session message', error, { phoneNumber, role: message.role });
            throw new AppError_1.SessionError('Failed to save session message', {
                phoneNumber,
                role: message.role,
            });
        }
    }
    async setOrderConfirmedAt(phoneNumber, timestamp) {
        try {
            await this.db.collection(this.collectionName).doc(phoneNumber).set({
                lastOrderConfirmedAt: timestamp
            }, { merge: true });
        }
        catch (error) {
            logger_1.logger.error('Error saving order confirmation timestamp', error, { phoneNumber, timestamp });
            throw new AppError_1.SessionError('Failed to save order confirmation timestamp', {
                phoneNumber,
                timestamp,
            });
        }
    }
    async getLastOrderConfirmedAt(phoneNumber) {
        try {
            const doc = await this.db.collection(this.collectionName).doc(phoneNumber).get();
            if (!doc.exists)
                return undefined;
            return doc.data().lastOrderConfirmedAt;
        }
        catch (error) {
            logger_1.logger.error('Error loading order confirmation timestamp', error, { phoneNumber });
            throw new AppError_1.SessionError('Failed to load order confirmation timestamp', { phoneNumber });
        }
    }
    async clearSession(phoneNumber) {
        try {
            await this.db.collection(this.collectionName).doc(phoneNumber).delete();
        }
        catch (error) {
            logger_1.logger.error('Error clearing session', error, { phoneNumber });
            throw new AppError_1.SessionError('Failed to clear session', { phoneNumber });
        }
    }
}
exports.SessionStore = SessionStore;
