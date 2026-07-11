
import { supabase } from './supabaseClient';
import { DbChild, DbWaitlist, DbHealthRecord, DbInclusionProfile, DbSIP, DbSpecialistVisit, DbChildVoice, DbCollector } from './types';
import { isDemoMode } from './utils';

export const childService = {
  getChildren: async (centreId: string): Promise<DbChild[]> => {
    if (isDemoMode()) {
        return [
            { id: 'demo-1', centreId, name: 'Oliver B.', medicalCondition: 'Anaphylaxis', severity: 'High', allergies: ['Peanuts'], medication: 'EpiPen', actionPlanDate: '2024-02-15', immunizationExpiry: '2024-04-15' },
            { id: 'demo-2', centreId, name: 'Mia T.', medicalCondition: 'Asthma', severity: 'Medium', allergies: ['Dust'], medication: 'Ventolin', actionPlanDate: '2024-03-10', immunizationExpiry: '2024-03-25' },
            { id: 'demo-3', centreId, name: 'Leo S.', immunizationExpiry: '2024-05-20' }
        ];
    }

    const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('centre_id', centreId);

    if (error) {
        console.warn("Fetch children error:", error);
        return [
            { id: 'demo-1', centreId, name: 'Oliver B.', medicalCondition: 'Anaphylaxis', severity: 'High', allergies: ['Peanuts'], medication: 'EpiPen', actionPlanDate: '2024-02-15', immunizationExpiry: '2024-04-15' },
            { id: 'demo-2', centreId, name: 'Mia T.', medicalCondition: 'Asthma', severity: 'Medium', allergies: ['Dust'], medication: 'Ventolin', actionPlanDate: '2024-03-10', immunizationExpiry: '2024-03-25' },
            { id: 'demo-3', centreId, name: 'Leo S.', immunizationExpiry: '2024-05-20' }
        ];
    }

    if (!data || data.length === 0) {
        return [
            { id: 'demo-1', centreId, name: 'Oliver B.', medicalCondition: 'Anaphylaxis', severity: 'High', allergies: ['Peanuts'], medication: 'EpiPen', actionPlanDate: '2024-02-15', immunizationExpiry: '2024-04-15' },
            { id: 'demo-2', centreId, name: 'Mia T.', medicalCondition: 'Asthma', severity: 'Medium', allergies: ['Dust'], medication: 'Ventolin', actionPlanDate: '2024-03-10', immunizationExpiry: '2024-03-25' },
            { id: 'demo-3', centreId, name: 'Leo S.', immunizationExpiry: '2024-05-20' }
        ];
    }

    return data.map((c: any) => ({
        id: c.id,
        centreId: c.centre_id,
        name: c.name,
        birthday: c.birthday,
        roomId: c.room_id,
        medicalCondition: c.medical_condition,
        severity: c.severity,
        allergies: c.allergies,
        medication: c.medication,
        actionPlanDate: c.action_plan_date,
        immunizationExpiry: c.immunization_expiry,
        parentId: c.parent_id
    }));
  },

  getChild: async (centreId: string, childId: string): Promise<DbChild | null> => {
    const children = await childService.getChildren(centreId);
    return children.find(c => c.id === childId) || null;
  },

  getParentChildren: async (parentId: string): Promise<DbChild[]> => {
    if (isDemoMode()) {
        return [
            { id: 'demo-1', centreId: 'demo-centre', name: 'Oliver B.', parentId: 'demo-parent' }
        ];
    }
    
    const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', parentId);

    if (error) {
        console.warn("Fetch parent children error:", error);
        return [];
    }

    return data.map((c: any) => ({
        id: c.id,
        centreId: c.centre_id,
        name: c.name,
        birthday: c.birthday,
        roomId: c.room_id,
        medicalCondition: c.medical_condition,
        severity: c.severity,
        allergies: c.allergies,
        medication: c.medication,
        actionPlanDate: c.action_plan_date,
        immunizationExpiry: c.immunization_expiry,
        parentId: c.parent_id
    }));
  },

  addChild: async (centreId: string, child: Omit<DbChild, 'id' | 'centreId'>): Promise<DbChild> => {
    if (!centreId) throw new Error("Missing centre ID. Please ensure you are logged in.");
    
    if (isDemoMode()) {
        return { id: `demo-child-${Date.now()}`, centreId, ...child };
    }

    const { data, error } = await supabase
        .from('children')
        .insert([{
            centre_id: centreId,
            name: child.name,
            birthday: child.birthday,
            room_id: child.roomId,
            medical_condition: child.medicalCondition,
            severity: child.severity,
            allergies: child.allergies,
            medication: child.medication,
            action_plan_date: child.actionPlanDate,
            immunization_expiry: child.immunizationExpiry,
            parent_id: child.parentId
        }])
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        centreId: data.centre_id,
        name: data.name,
        birthday: data.birthday,
        roomId: data.room_id,
        medicalCondition: data.medical_condition,
        severity: data.severity,
        allergies: data.allergies,
        medication: data.medication,
        actionPlanDate: data.action_plan_date,
        immunizationExpiry: data.immunization_expiry,
        parentId: data.parent_id
    };
  },

  updateChild: async (id: string, child: Partial<DbChild>): Promise<void> => {
      if (isDemoMode()) return;
      
      const updateData: any = {};
      if (child.name !== undefined) updateData.name = child.name;
      if (child.birthday !== undefined) updateData.birthday = child.birthday;
      if (child.roomId !== undefined) updateData.room_id = child.roomId;
      if (child.medicalCondition !== undefined) updateData.medical_condition = child.medicalCondition;
      if (child.severity !== undefined) updateData.severity = child.severity;
      if (child.allergies !== undefined) updateData.allergies = child.allergies;
      if (child.medication !== undefined) updateData.medication = child.medication;
      if (child.actionPlanDate !== undefined) updateData.action_plan_date = child.actionPlanDate;
      if (child.immunizationExpiry !== undefined) updateData.immunization_expiry = child.immunizationExpiry;
      if (child.parentId !== undefined) updateData.parent_id = child.parentId;
      
      const { error } = await supabase
          .from('children')
          .update(updateData)
          .eq('id', id);

      if (error) throw error;
  },

  deleteChild: async (id: string): Promise<void> => {
      if (isDemoMode()) return;
      
      const { error } = await supabase
          .from('children')
          .delete()
          .eq('id', id);

      if (error) throw error;
  },

  getWaitlist: async (centreId: string): Promise<DbWaitlist[]> => {
    if (isDemoMode()) {
      return [
        { id: 'w-1', centreId, childName: 'Baby A', birthday: '2025-06-01', requestedStartDate: '2026-06-01', status: 'active', createdAt: '2026-01-01T00:00:00Z' },
        { id: 'w-2', centreId, childName: 'Toddler B', birthday: '2024-03-01', requestedStartDate: '2026-04-01', status: 'active', createdAt: '2026-01-01T00:00:00Z' },
        { id: 'w-3', centreId, childName: 'Preschooler C', birthday: '2022-09-01', requestedStartDate: '2026-08-01', status: 'active', createdAt: '2026-01-01T00:00:00Z' },
      ];
    }
    const { data, error } = await supabase.from('waitlist').select('*').eq('centre_id', centreId);
    if (error) throw error;
    return data;
  },

  getHealthRecords: async (centreId: string): Promise<DbHealthRecord[]> => {
    if (isDemoMode()) {
      return [
        { id: 'hr-1', childId: 'child-1', childName: 'Leo Jenkins', centreId, immunizationStatus: 'up_to_date', airStatementExpiry: '2024-12-15', medicalActionPlanType: 'asthma', medicalActionPlanExpiry: '2024-05-10', notes: 'Asthma action plan updated recently.', createdAt: new Date().toISOString() },
        { id: 'hr-2', childId: 'child-2', childName: 'Mia Thompson', centreId, immunizationStatus: 'expired', airStatementExpiry: '2024-02-10', medicalActionPlanType: 'none', medicalActionPlanExpiry: '', createdAt: new Date().toISOString() },
        { id: 'hr-3', childId: 'child-3', childName: 'Noah Smith', centreId, immunizationStatus: 'up_to_date', airStatementExpiry: '2025-01-20', medicalActionPlanType: 'anaphylaxis', medicalActionPlanExpiry: '2024-03-25', notes: 'Peanut allergy.', createdAt: new Date().toISOString() }
      ];
    }
    const { data, error } = await supabase.from('health_records').select('*').eq('centre_id', centreId);
    if (error) throw error;
    return data;
  },

  saveHealthRecord: async (record: Omit<DbHealthRecord, 'id' | 'createdAt'>): Promise<DbHealthRecord> => {
    if (isDemoMode()) {
      return { ...record, id: `hr-${Date.now()}`, createdAt: new Date().toISOString() };
    }
    const { data, error } = await supabase.from('health_records').insert([record]).select().single();
    if (error) throw error;
    return data;
  },

  sendHealthReminder: async (recordId: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('health_records').update({ last_reminder_sent: new Date().toISOString() }).eq('id', recordId);
    if (error) throw error;
  },

  getInclusionProfiles: async (centreId: string): Promise<DbInclusionProfile[]> => {
    if (isDemoMode()) {
      return [
        { id: 'inc-1', centreId, childId: 'child-1', diagnosis: 'Autism Spectrum Disorder (Level 2)', supportNeeds: 'Requires 1:1 support during transitions and sensory regulation activities.', fundingStatus: 'approved', fundingExpiry: '2026-12-31', lastReviewDate: '2026-02-15', createdAt: '2026-01-01T00:00:00Z' },
        { id: 'inc-2', centreId, childId: 'child-2', diagnosis: 'Developmental Delay', supportNeeds: 'Support with fine motor skills and social interaction.', fundingStatus: 'pending', lastReviewDate: '2026-03-01', createdAt: '2026-02-01T00:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('inclusion_profiles').select('*').eq('centre_id', centreId);
    if (error) throw error;
    return data;
  },

  getInclusionProfile: async (centreId: string, childId: string): Promise<DbInclusionProfile | null> => {
    if (isDemoMode()) return null;
    const { data, error } = await supabase.from('inclusion_profiles').select('*').eq('centre_id', centreId).eq('child_id', childId).maybeSingle();
    if (error) return null;
    return data;
  },

  saveInclusionProfile: async (profile: Omit<DbInclusionProfile, 'id' | 'createdAt'>): Promise<DbInclusionProfile> => {
    if (isDemoMode()) return { ...profile, id: `inc-${Date.now()}`, createdAt: new Date().toISOString() } as DbInclusionProfile;
    const { data, error } = await supabase.from('inclusion_profiles').insert(profile).select().single();
    if (error) throw error;
    return data;
  },

  getSIPs: async (centreId: string, childId?: string): Promise<DbSIP[]> => {
    if (isDemoMode()) {
      return [
        { id: 'sip-1', centreId, childId: 'child-1', title: 'Strategic Inclusion Plan 2026', goals: ['Improve social interaction with peers', 'Enhance verbal communication during group time'], strategies: ['Use visual schedules', 'Implement "quiet zone" for sensory breaks'], reviewDate: '2026-06-15', status: 'active', createdAt: '2026-01-15T00:00:00Z' }
      ];
    }
    let query = supabase.from('sips').select('*').eq('centre_id', centreId);
    if (childId) query = query.eq('child_id', childId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  saveSIP: async (sip: Omit<DbSIP, 'id' | 'createdAt'>): Promise<DbSIP> => {
    if (isDemoMode()) return { ...sip, id: `sip-${Date.now()}`, createdAt: new Date().toISOString() } as DbSIP;
    const { data, error } = await supabase.from('sips').insert(sip).select().single();
    if (error) throw error;
    return data;
  },

  deleteSIP: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('sips').delete().eq('id', id);
    if (error) throw error;
  },

  getSpecialistVisits: async (centreId: string, childId?: string): Promise<DbSpecialistVisit[]> => {
    if (isDemoMode()) {
      return [
        { id: 'visit-1', centreId, childId: 'child-1', specialistName: 'Dr. Sarah Smith', specialistType: 'speech_pathologist', visitDate: '2026-03-10', purpose: 'Initial assessment and goal setting', outcomes: 'Child responded well to play-based assessment. Identified 3 key focus areas.', nextSteps: 'Fortnightly visits starting next month.', createdAt: '2026-03-10T14:00:00Z' }
      ];
    }
    let query = supabase.from('specialist_visits').select('*').eq('centre_id', centreId);
    if (childId) query = query.eq('child_id', childId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  saveSpecialistVisit: async (visit: Omit<DbSpecialistVisit, 'id' | 'createdAt'>): Promise<DbSpecialistVisit> => {
    if (isDemoMode()) {
      return { ...visit, id: `visit-${Date.now()}`, createdAt: new Date().toISOString() } as DbSpecialistVisit;
    }
    const { data, error } = await supabase.from('specialist_visits').insert(visit).select().single();
    if (error) throw error;
    return data;
  },

  deleteSpecialistVisit: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('specialist_visits').delete().eq('id', id);
    if (error) throw error;
  },

  getChildVoiceLogs: async (centreId: string, childId?: string): Promise<DbChildVoice[]> => {
    if (isDemoMode()) {
      const logs: DbChildVoice[] = [
        { id: 'cv-1', centreId, childId: 'child-1', type: 'proud_moment', mediaType: 'photo', content: 'https://picsum.photos/seed/painting/800/600', prompt: 'What did you make today that you are proud of?', date: '2026-03-15', createdAt: '2026-03-15T10:00:00Z' },
        { id: 'cv-2', centreId, childId: 'child-1', type: 'reflection', mediaType: 'audio', content: 'mock-audio-base64', prompt: 'How did you feel when you were playing with the blocks?', date: '2026-03-16', createdAt: '2026-03-16T11:30:00Z' }
      ];
      return childId ? logs.filter(l => l.childId === childId) : logs;
    }
    let query = supabase.from('child_voice').select('*').eq('centre_id', centreId);
    if (childId) query = query.eq('child_id', childId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveChildVoiceLog: async (log: Omit<DbChildVoice, 'id' | 'createdAt'>): Promise<DbChildVoice> => {
    if (isDemoMode()) {
      return { ...log, id: `cv-${Date.now()}`, createdAt: new Date().toISOString() } as DbChildVoice;
    }
    const { data, error } = await supabase.from('child_voice').insert(log).select().single();
    if (error) throw error;
    return data;
  },

  deleteChildVoiceLog: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('child_voice').delete().eq('id', id);
    if (error) throw error;
  },

  getCollectors: async (childId: string): Promise<DbCollector[]> => {
    if (isDemoMode()) return [{ id: 'col-1', centreId: 'c1', childId, name: 'John Doe', relationship: 'Father', phone: '0412345678', pin: '1234', permissions: ['pickup'], isAuthorized: true, createdAt: new Date().toISOString() }];
    const { data, error } = await supabase.from('collectors').select('*').eq('child_id', childId);
    if (error) return [];
    return data;
  },

  addCollector: async (centreIdOrCollector: any, collector?: any): Promise<void> => {
    const actualCollector = typeof centreIdOrCollector === 'string' ? collector : centreIdOrCollector;
    if (isDemoMode()) return;
    const { error } = await supabase.from('collectors').insert(actualCollector);
    if (error) throw error;
  },

  updateCollector: async (id: string, updates: Partial<DbCollector>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('collectors').update(updates).eq('id', id);
    if (error) throw error;
  },

  deleteCollector: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('collectors').delete().eq('id', id);
    if (error) throw error;
  }
};
