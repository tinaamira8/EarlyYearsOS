import { auth } from './firebase';

export interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  details?: any;
  centreId?: string;
}

export const auditService = {
  async log(entry: Omit<AuditLogEntry, 'userId'>) {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const response = await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...entry,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        console.error('Failed to log audit entry');
      }
    } catch (error) {
      console.error('Error logging audit entry:', error);
    }
  }
};
