"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = void 0;
class SessionStore {
    // In-memory store: Mapping from phoneNumber to array of messages.
    sessions = new Map();
    getHistory(phoneNumber) {
        return this.sessions.get(phoneNumber) || [];
    }
    addMessage(phoneNumber, message) {
        const history = this.getHistory(phoneNumber);
        history.push(message);
        this.sessions.set(phoneNumber, history);
    }
    clearSession(phoneNumber) {
        this.sessions.delete(phoneNumber);
    }
}
exports.SessionStore = SessionStore;
