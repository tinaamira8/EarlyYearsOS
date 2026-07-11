
import { db, DbStaff, DbChild } from './database';
import { notificationService } from './notifications';

export interface ComplianceAlert {
  id: string;
  type: 'staff_qualification' | 'child_immunization';
  subjectId: string;
  subjectName: string;
  qualificationType?: string;
  expiryDate: string;
  daysRemaining: number;
  severity: 'critical' | 'warning' | 'info';
}

class ComplianceService {
  async getAlerts(centreId: string): Promise<ComplianceAlert[]> {
    const alerts: ComplianceAlert[] = [];
    const now = new Date();
    
    // 1. Check Staff Qualifications
    const staff = await db.getStaff(centreId);
    staff.forEach(s => {
      this.checkExpiry(alerts, s, 'WWCC', s.wwccExpiry, 'staff_qualification');
      this.checkExpiry(alerts, s, 'First Aid', s.firstAidExpiry, 'staff_qualification');
      this.checkExpiry(alerts, s, 'CPR', s.cprExpiry, 'staff_qualification');
    });

    // 2. Check Child Immunizations
    const children = await db.getChildren(centreId);
    children.forEach(c => {
      this.checkExpiry(alerts, c, 'Immunization', c.immunizationExpiry, 'child_immunization');
    });

    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  private checkExpiry(
    alerts: ComplianceAlert[], 
    subject: DbStaff | DbChild, 
    qualType: string, 
    expiryDate: string | undefined,
    type: 'staff_qualification' | 'child_immunization'
  ) {
    if (!expiryDate) return;

    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 60) {
      let severity: 'critical' | 'warning' | 'info' = 'info';
      if (diffDays <= 0) severity = 'critical';
      else if (diffDays <= 30) severity = 'warning';

      alerts.push({
        id: `${type}-${subject.id}-${qualType}`,
        type,
        subjectId: subject.id,
        subjectName: subject.name,
        qualificationType: qualType,
        expiryDate,
        daysRemaining: diffDays,
        severity
      });
    }
  }

  async sendAutomatedReminders(centreId: string) {
    const alerts = await this.getAlerts(centreId);
    const pendingAlerts = alerts.filter(a => a.daysRemaining === 30 || a.daysRemaining === 60 || a.daysRemaining <= 0);

    for (const alert of pendingAlerts) {
      const message = alert.daysRemaining <= 0 
        ? `CRITICAL: ${alert.qualificationType} for ${alert.subjectName} has EXPIRED on ${alert.expiryDate}.`
        : `REMINDER: ${alert.qualificationType} for ${alert.subjectName} expires in ${alert.daysRemaining} days (${alert.expiryDate}).`;

      await notificationService.sendNotification(centreId, {
        title: 'Compliance Alert',
        content: message,
        type: 'incident', // Using incident type for higher visibility
        subjectId: alert.subjectId,
        subjectType: alert.type
      });
    }
    
    return pendingAlerts.length;
  }
}

export const complianceService = new ComplianceService();
