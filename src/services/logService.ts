
import { supabase } from './supabaseClient';
import { DbDailyLog, DbSleepSession, DbEmergencyDrill, DbEmergencyRollCall, DbIncident } from './types';
import { isDemoMode } from './utils';

export const logService = {
  getDailyLogs: async (centreId: string, date: string, type?: string): Promise<DbDailyLog[]> => {
    if (isDemoMode()) {
        const docs: any[] = [
            { id: 'log-1', centreId, date, type: 'sleep_check', data: { childName: 'Oliver B.', time: '12:30', status: 'Sleeping' }, createdAt: '2024-03-20T12:30:00Z' },
            { id: 'log-2', centreId, date, type: 'nutrition', data: { childName: 'Mia T.', meal: 'Lunch', amount: 'All' }, createdAt: '2024-03-20T12:45:00Z' }
        ];
        return (type ? docs.filter(d => d.type === type) : docs) as DbDailyLog[];
    }

    let query = supabase
        .from('daily_logs')
        .select('*')
        .eq('centre_id', centreId)
        .eq('date', date);

    if (type) {
        query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
        console.warn("Fetch logs error:", error);
        return [];
    }

    return data.map((l: any) => ({
        id: l.id,
        centreId: l.centre_id,
        date: l.date,
        type: l.type,
        data: l.data,
        createdAt: l.created_at
    }));
  },

  addDailyLog: async (centreIdOrLog: any, logOrType?: any, data?: any): Promise<DbDailyLog> => {
    let centreId: string;
    let actualLog: any;

    if (typeof centreIdOrLog === 'string') {
        centreId = centreIdOrLog;
        if (typeof logOrType === 'string' && data) {
            // Legacy 3-argument call: centreId, type, data
            actualLog = { type: logOrType, data: data, date: new Date().toISOString().split('T')[0] };
        } else {
            // New 2-argument call: centreId, log
            actualLog = logOrType;
        }
    } else {
        // New 1-argument call: log
        centreId = (centreIdOrLog as DbDailyLog).centreId;
        actualLog = centreIdOrLog;
    }
    
    if (isDemoMode()) {
        return { id: `demo-log-${Date.now()}`, centreId, createdAt: new Date().toISOString(), ...actualLog };
    }

    const { data: savedData, error } = await supabase
        .from('daily_logs')
        .insert([{
            centre_id: centreId,
            date: actualLog.date || new Date().toISOString().split('T')[0],
            type: actualLog.type,
            data: actualLog.data
        }])
        .select()
        .single();

    if (error) throw error;

    return {
        id: savedData.id,
        centreId: savedData.centre_id,
        date: savedData.date,
        type: savedData.type,
        data: savedData.data,
        createdAt: savedData.created_at
    };
  },

  getSleepSessions: async (centreId: string): Promise<DbSleepSession[]> => {
    if (isDemoMode()) {
      return [
        { id: 's-1', centreId, childId: 'c-1', childName: 'Oliver B.', startTime: '12:00', lastCheckTime: '12:15', status: 'sleeping', checks: [{ time: '12:15', status: 'Sleeping', educatorId: 'e-1' }], createdAt: '2026-03-22T12:00:00Z' },
        { id: 's-2', centreId, childId: 'c-2', childName: 'Mia T.', startTime: '12:15', lastCheckTime: '12:30', status: 'sleeping', checks: [{ time: '12:30', status: 'Sleeping', educatorId: 'e-1' }], createdAt: '2026-03-22T12:15:00Z' }
      ];
    }
    const { data, error } = await supabase.from('sleep_sessions').select('*').eq('centre_id', centreId).eq('status', 'sleeping');
    if (error) throw error;
    return data;
  },

  startSleepSession: async (centreIdOrSession: any, childId?: string, childName?: string): Promise<DbSleepSession> => {
    let session: Omit<DbSleepSession, 'id' | 'createdAt' | 'checks'>;
    if (typeof centreIdOrSession === 'string') {
      session = { 
        centreId: centreIdOrSession, 
        childId: childId!, 
        childName: childName!, 
        startTime: new Date().toISOString(), 
        lastCheckTime: new Date().toISOString(),
        status: 'sleeping' 
      };
    } else {
      session = centreIdOrSession;
    }

    if (isDemoMode()) return { ...session, id: `s-${Date.now()}`, checks: [], createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('sleep_sessions').insert([{ ...session, checks: [] }]).select().single();
    if (error) throw error;
    return data;
  },

  addSleepCheck: async (sessionId: string, check: { time: string; status: string; educatorId: string }): Promise<void> => {
    if (isDemoMode()) return;
    const { data: session } = await supabase.from('sleep_sessions').select('checks').eq('id', sessionId).single();
    const updatedChecks = [...(session?.checks || []), check];
    const { error } = await supabase.from('sleep_sessions').update({ checks: updatedChecks, last_check_time: check.time }).eq('id', sessionId);
    if (error) throw error;
  },

  logSleepCheck: async (sessionId: string, status: string, educatorId: string): Promise<void> => {
    return logService.addSleepCheck(sessionId, { time: new Date().toISOString(), status, educatorId });
  },

  endSleepSession: async (sessionId: string, endTime?: string): Promise<void> => {
    const time = endTime || new Date().toISOString();
    if (isDemoMode()) return;
    const { error } = await supabase.from('sleep_sessions').update({ end_time: time, status: 'awake' }).eq('id', sessionId);
    if (error) throw error;
  },

  getEmergencyDrills: async (centreId: string): Promise<DbEmergencyDrill[]> => {
    if (isDemoMode()) {
      return [
        { id: 'd-1', centreId, type: 'evacuation', date: '2026-02-15', startTime: '10:00', endTime: '10:05', duration: '5m', staffInvolved: ['Sarah J.', 'Mike R.'], childrenInvolved: 24, location: 'Main Gate', notes: 'Smooth evacuation, all children accounted for.', success: true, createdAt: '2026-02-15T10:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('emergency_drills').select('*').eq('centre_id', centreId).order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveEmergencyDrill: async (centreIdOrDrill: any, drill?: any): Promise<DbEmergencyDrill> => {
    const actualDrill = typeof centreIdOrDrill === 'string' ? drill : centreIdOrDrill;
    if (isDemoMode()) return { ...actualDrill, id: `d-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('emergency_drills').insert(actualDrill).select().single();
    if (error) throw error;
    return data;
  },

  getEmergencyRollCalls: async (centreId: string): Promise<DbEmergencyRollCall[]> => {
    if (isDemoMode()) {
      return [
        { id: 'rc-1', centreId, timestamp: '2026-03-22T10:02:00Z', totalChildren: 24, presentChildren: Array(24).fill('c-id'), missingChildren: [], status: 'completed', createdAt: '2026-03-22T10:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('emergency_roll_calls').select('*').eq('centre_id', centreId).order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveEmergencyRollCall: async (centreIdOrRollCall: any, rollCall?: any): Promise<DbEmergencyRollCall> => {
    const actualRollCall = typeof centreIdOrRollCall === 'string' ? rollCall : centreIdOrRollCall;
    if (isDemoMode()) return { ...actualRollCall, id: `rc-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('emergency_roll_calls').insert(actualRollCall).select().single();
    if (error) throw error;
    return data;
  },

  getIncidents: async (centreId: string): Promise<DbIncident[]> => {
    if (isDemoMode()) {
      return [
        { id: 'inc-1', centreId, childId: 'c-1', childName: 'Oliver B.', date: '2024-03-20', time: '10:30', location: 'Outdoor Playground', description: 'Minor scrape on knee while climbing.', actionTaken: 'Cleaned with antiseptic wipe and applied band-aid.', parentNotified: true, staffSignature: 'Sarah Jenkins', createdAt: '2024-03-20T10:45:00Z' }
      ];
    }
    const { data, error } = await supabase.from('incidents').select('*').eq('centre_id', centreId).order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveIncident: async (incident: Omit<DbIncident, 'id' | 'createdAt'>): Promise<DbIncident> => {
    if (isDemoMode()) return { ...incident, id: `inc-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('incidents').insert(incident).select().single();
    if (error) throw error;
    return data;
  },

  signIncident: async (id: string, signature: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('incidents').update({ parent_signature: signature, parent_notified: true }).eq('id', id);
    if (error) throw error;
  },

  getFamilyAuditLog: async (centreId: string, childId?: string): Promise<any[]> => {
    if (isDemoMode()) return [];
    let query = supabase.from('family_audit_logs').select('*').eq('centre_id', centreId);
    if (childId) query = query.eq('child_id', childId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  updateDailyLog: async (id: string, updates: Partial<DbDailyLog>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('daily_logs').update(updates).eq('id', id);
    if (error) throw error;
  },

  logEmergencyDrill: async (drill: Omit<DbEmergencyDrill, 'id' | 'createdAt'>): Promise<DbEmergencyDrill> => {
    return logService.saveEmergencyDrill(drill);
  },

  getActiveEmergencyRollCall: async (centreId: string): Promise<DbEmergencyRollCall | null> => {
    if (isDemoMode()) return null;
    const { data, error } = await supabase.from('emergency_roll_calls').select('*').eq('centre_id', centreId).eq('status', 'in_progress').maybeSingle();
    if (error) return null;
    return data;
  },

  updateEmergencyRollCall: async (id: string, updates: Partial<DbEmergencyRollCall>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('emergency_roll_calls').update(updates).eq('id', id);
    if (error) throw error;
  }
};
