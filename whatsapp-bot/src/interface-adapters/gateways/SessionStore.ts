export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class SessionStore {
  // In-memory store: Mapping from phoneNumber to array of messages.
  private sessions: Map<string, ConversationMessage[]> = new Map();

  getHistory(phoneNumber: string): ConversationMessage[] {
    return this.sessions.get(phoneNumber) || [];
  }

  addMessage(phoneNumber: string, message: ConversationMessage): void {
    const history = this.getHistory(phoneNumber);
    history.push(message);
    this.sessions.set(phoneNumber, history);
  }

  clearSession(phoneNumber: string): void {
    this.sessions.delete(phoneNumber);
  }
}
