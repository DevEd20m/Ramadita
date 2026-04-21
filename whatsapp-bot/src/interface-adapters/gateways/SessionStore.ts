import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { SessionError } from '../../errors/AppError';
import { logger } from '../../utils/logger';

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SessionData {
  history: ConversationMessage[];
  lastOrderConfirmedAt?: number; // Timestamp in ms
}

export class SessionStore {
  private db: Firestore;
  private readonly collectionName = 'sessions';

  constructor() {
    // Use the specific database ID 'botcito' provided by the user
    // In firebase-admin, you can pass the database name to getFirestore
    this.db = getFirestore('botcito');
  }

  async getHistory(phoneNumber: string): Promise<ConversationMessage[]> {
    try {
      const doc = await this.db.collection(this.collectionName).doc(phoneNumber).get();
      if (!doc.exists) return [];
      return (doc.data() as SessionData).history || [];
    } catch (error) {
      logger.error('Error loading session history', error, { phoneNumber });
      throw new SessionError('Failed to load session history', { phoneNumber });
    }
  }

  async addMessage(phoneNumber: string, message: ConversationMessage): Promise<void> {
    try {
      const docRef = this.db.collection(this.collectionName).doc(phoneNumber);
      const doc = await docRef.get();

      if (!doc.exists) {
        await docRef.set({ history: [message] });
      } else {
        await docRef.update({
          history: FieldValue.arrayUnion(message)
        });
      }
    } catch (error) {
      logger.error('Error saving session message', error, { phoneNumber, role: message.role });
      throw new SessionError('Failed to save session message', {
        phoneNumber,
        role: message.role,
      });
    }
  }

  async setOrderConfirmedAt(phoneNumber: string, timestamp: number): Promise<void> {
    try {
      await this.db.collection(this.collectionName).doc(phoneNumber).set({
        lastOrderConfirmedAt: timestamp
      }, { merge: true });
    } catch (error) {
      logger.error('Error saving order confirmation timestamp', error, { phoneNumber, timestamp });
      throw new SessionError('Failed to save order confirmation timestamp', {
        phoneNumber,
        timestamp,
      });
    }
  }

  async getLastOrderConfirmedAt(phoneNumber: string): Promise<number | undefined> {
    try {
      const doc = await this.db.collection(this.collectionName).doc(phoneNumber).get();
      if (!doc.exists) return undefined;
      return (doc.data() as SessionData).lastOrderConfirmedAt;
    } catch (error) {
      logger.error('Error loading order confirmation timestamp', error, { phoneNumber });
      throw new SessionError('Failed to load order confirmation timestamp', { phoneNumber });
    }
  }

  async clearSession(phoneNumber: string): Promise<void> {
    try {
      await this.db.collection(this.collectionName).doc(phoneNumber).delete();
    } catch (error) {
      logger.error('Error clearing session', error, { phoneNumber });
      throw new SessionError('Failed to clear session', { phoneNumber });
    }
  }
}
