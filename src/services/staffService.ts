
import { supabase } from './supabaseClient';
import { DbStaff, DbStaffTraining, DbPDPortfolioEntry, DbStaffFloat, DbRequiredTraining, DbStaffTrainingProgress } from './types';
import { isDemoMode } from './utils';

export const staffService = {
  getStaff: async (centreId: string): Promise<DbStaff[]> => {
    if (isDemoMode()) return [];

    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('centre_id', centreId);

    if (error) {
        console.warn("Fetch staff error:", error);
        return [];
    }

    return data.map((s: any) => ({
        id: s.id,
        centreId: s.centre_id,
        name: s.name,
        role: s.role || 'Educator',
        wwcc: s.wwcc || '',
        firstAid: s.first_aid || '',
        cpr: s.cpr || '',
        employeeId: s.employee_id || '',
        pin: s.pin || ''
    }));
  },

  addStaff: async (centreId: string, staff: Omit<DbStaff, 'id' | 'centreId'>): Promise<DbStaff> => {
    if (!centreId) throw new Error("Missing centre ID. Please ensure you are logged in.");
    if (isDemoMode()) {
        return { id: `demo-staff-${Date.now()}`, centreId, ...staff };
    }

    // Ensure profile exists first to avoid foreign key violation
    try {
        const { data: profile, error: fetchError } = await supabase.from('profiles').select('id').eq('id', centreId).maybeSingle();
        if (!profile || fetchError) {
            await supabase.from('profiles').insert([{ id: centreId, name: 'Director', email: '', centre_name: 'My Centre', plan: 'free' }]);
        }
    } catch (e) {}

    try {
        let pinToSave = staff.pin;
        if (pinToSave && pinToSave.length >= 4) {
            pinToSave = await staffService.hashPin(pinToSave);
        }

        const { data, error } = await supabase
            .from('staff')
            .insert([{ 
                centre_id: centreId, 
                name: staff.name,
                role: staff.role,
                wwcc: staff.wwcc || null,
                first_aid: staff.firstAid || null,
                cpr: staff.cpr || null,
                employee_id: staff.employeeId || null,
                pin: pinToSave || null
            }])
            .select()
            .single();

        if (!error && data) {
            return {
                id: data.id,
                centreId: data.centre_id,
                name: data.name,
                role: data.role,
                wwcc: data.wwcc,
                firstAid: data.first_aid,
                cpr: data.cpr,
                employeeId: data.employee_id,
                pin: data.pin
            };
        }
        if (error) throw error;
    } catch (e: any) {
        console.warn("Staff insert failed, trying legacy:", e.message);
    }

    // Legacy fallback logic simplified for brevity
    const { data, error } = await supabase
        .from('staff')
        .insert([{ centre_id: centreId, name: staff.name, role: staff.role }])
        .select()
        .single();
    if (error) throw error;
    return { id: data.id, centreId: data.centre_id, name: data.name, role: data.role, wwcc: '', firstAid: '', cpr: '' };
  },

  updateStaff: async (id: string, staff: Partial<DbStaff>): Promise<void> => {
      if (isDemoMode()) return;
      
      let pinToSave = staff.pin;
      if (pinToSave && pinToSave.length >= 4 && !pinToSave.startsWith('$2a$')) {
          pinToSave = await staffService.hashPin(pinToSave);
      }

      const { error } = await supabase
          .from('staff')
          .update({
              name: staff.name,
              role: staff.role,
              wwcc: staff.wwcc || null,
              first_aid: staff.firstAid || null,
              cpr: staff.cpr || null,
              employee_id: staff.employeeId || null,
              pin: pinToSave || null
          })
          .eq('id', id);
          
      if (error) throw error;
  },

  deleteStaff: async (id: string): Promise<void> => {
      if (isDemoMode()) return;
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
  },

  hashPin: async (pin: string): Promise<string> => {
    const response = await fetch("/api/staff/hash-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.hashedPin;
  },

  verifyPin: async (pin: string, hashedPin: string): Promise<boolean> => {
    const response = await fetch("/api/staff/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, hashedPin })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.success;
  },

  getStaffTraining: async (staffId: string): Promise<DbStaffTraining[]> => {
    if (isDemoMode()) {
      return [{ id: 'tr-1', staffId, title: 'Child Protection Refresher', provider: 'Early Childhood Australia', completionDate: '2025-11-15', expiryDate: '2026-11-15', hours: 3, status: 'completed' }];
    }
    const { data, error } = await supabase.from('staff_training').select('*').eq('staff_id', staffId).order('completion_date', { ascending: false });
    if (error) return [];
    return data.map((t: any) => ({ id: t.id, staffId: t.staff_id, title: t.title, provider: t.provider, completionDate: t.completion_date, expiryDate: t.expiry_date, hours: t.hours, certificateUrl: t.certificate_url, status: t.status }));
  },

  addStaffTraining: async (staffIdOrTraining: any, training?: any): Promise<DbStaffTraining> => {
    const actualTraining = typeof staffIdOrTraining === 'string' ? training : staffIdOrTraining;
    if (isDemoMode()) return { ...actualTraining, id: `tr-${Date.now()}` };
    const { data, error } = await supabase.from('staff_training').insert([actualTraining]).select().single();
    if (error) throw error;
    return { id: data.id, staffId: data.staff_id, title: data.title, provider: data.provider, completionDate: data.completion_date, expiryDate: data.expiry_date, hours: data.hours, certificateUrl: data.certificate_url, status: data.status };
  },

  getPDPortfolio: async (staffId: string): Promise<DbPDPortfolioEntry[]> => {
    if (isDemoMode()) {
      return [{ id: 'pd-1', staffId, staffName: 'Sarah Jenkins', centreId: 'centre-1', title: 'Trauma-Informed Practice Workshop', provider: 'Early Childhood Australia', date: '2024-02-15', hours: 6, category: 'workshop', nqsStandards: ['QA 1', 'QA 5'], reflection: '...', impactOnPractice: '...', evidenceUrls: [], status: 'completed', createdAt: new Date().toISOString() }];
    }
    const { data, error } = await supabase.from('pd_portfolio').select('*').eq('staff_id', staffId).order('date', { ascending: false });
    if (error) return [];
    return data.map((d: any) => ({ id: d.id, staffId: d.staff_id, staffName: d.staff_name, centreId: d.centre_id, title: d.title, provider: d.provider, date: d.date, hours: d.hours, category: d.category, nqsStandards: d.nqs_standards || [], reflection: d.reflection, impactOnPractice: d.impact_on_practice, evidenceUrls: d.evidence_urls || [], status: d.status, feedback: d.feedback, createdAt: d.created_at }));
  },

  savePDPortfolioEntry: async (centreIdOrEntry: any, entry?: any): Promise<DbPDPortfolioEntry> => {
    const actualEntry = typeof centreIdOrEntry === 'string' ? entry : centreIdOrEntry;
    if (isDemoMode()) return { ...actualEntry, id: `pd-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('pd_portfolio').insert([actualEntry]).select().single();
    if (error) throw error;
    return { id: data.id, staffId: data.staff_id, staffName: data.staff_name, centreId: data.centre_id, title: data.title, provider: data.provider, date: data.date, hours: data.hours, category: data.category, nqsStandards: data.nqs_standards || [], reflection: data.reflection, impactOnPractice: data.impact_on_practice, evidenceUrls: data.evidence_urls || [], status: data.status, feedback: data.feedback, createdAt: data.created_at };
  },

  getStaffFloats: async (centreId: string): Promise<DbStaffFloat[]> => {
    if (isDemoMode()) return [{ id: 'float-1', staffId: 'staff-1', staffName: 'Sarah Jenkins', fromCentreId: 'centre-1', toCentreId: 'centre-2', startDate: '2024-03-15', reason: 'Maternity leave cover', status: 'active', createdAt: new Date().toISOString() }];
    const { data, error } = await supabase.from('staff_floats').select('*').or(`from_centre_id.eq.${centreId},to_centre_id.eq.${centreId}`);
    if (error) return [];
    return data.map((d: any) => ({ id: d.id, staffId: d.staff_id, staffName: d.staff_name, fromCentreId: d.from_centre_id, toCentreId: d.to_centre_id, startDate: d.start_date, endDate: d.end_date, reason: d.reason, status: d.status, createdAt: d.created_at }));
  },

  addStaffFloat: async (float: Omit<DbStaffFloat, 'id' | 'createdAt'>): Promise<DbStaffFloat> => {
    if (isDemoMode()) return { ...float, id: `float-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('staff_floats').insert([float]).select().single();
    if (error) throw error;
    return { id: data.id, staffId: data.staff_id, staffName: data.staff_name, fromCentreId: data.from_centre_id, toCentreId: data.to_centre_id, startDate: data.start_date, endDate: data.end_date, reason: data.reason, status: data.status, createdAt: data.created_at };
  },

  getRequiredTraining: async (centreId: string): Promise<DbRequiredTraining[]> => {
    if (isDemoMode()) return [{ id: 't1', centreId, title: 'Child Protection 2024', description: '...', dueDate: '2024-12-31', category: 'Compliance', createdAt: new Date().toISOString() }];
    const { data, error } = await supabase.from('required_training').select('*').eq('centreId', centreId);
    if (error) return [];
    return data || [];
  },

  addRequiredTraining: async (training: Omit<DbRequiredTraining, 'id' | 'createdAt'>): Promise<string> => {
    if (isDemoMode()) return 'demo-t-' + Math.random();
    const { data, error } = await supabase.from('required_training').insert([training]).select();
    if (error) throw error;
    return data[0].id;
  },

  updateRequiredTraining: async (id: string, updates: Partial<DbRequiredTraining>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('required_training').update(updates).eq('id', id);
    if (error) throw error;
  },

  deleteRequiredTraining: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('required_training').delete().eq('id', id);
    if (error) throw error;
  },

  getStaffTrainingProgress: async (staffId: string): Promise<DbStaffTrainingProgress[]> => {
    if (isDemoMode()) return [{ id: 'p1', staffId, trainingId: 't1', status: 'completed', completedAt: '2024-02-15', createdAt: new Date().toISOString() }];
    const { data, error } = await supabase.from('staff_training_progress').select('*').eq('staffId', staffId);
    if (error) return [];
    return data || [];
  },

  updateStaffTrainingStatus: async (staffId: string, trainingId: string, status: 'pending' | 'completed'): Promise<void> => {
    if (isDemoMode()) return;
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    const { error } = await supabase.from('staff_training_progress').upsert({ staffId, trainingId, status, completedAt }, { onConflict: 'staffId,trainingId' });
    if (error) throw error;
  },

  getStaffPDPortfolios: async (centreId: string): Promise<DbPDPortfolioEntry[]> => {
    if (isDemoMode()) return [];
    const { data, error } = await supabase.from('pd_portfolio').select('*').eq('centre_id', centreId).order('date', { ascending: false });
    if (error) return [];
    return data.map((d: any) => ({ id: d.id, staffId: d.staff_id, staffName: d.staff_name, centreId: d.centre_id, title: d.title, provider: d.provider, date: d.date, hours: d.hours, category: d.category, nqsStandards: d.nqs_standards || [], reflection: d.reflection, impactOnPractice: d.impact_on_practice, evidenceUrls: d.evidence_urls || [], status: d.status, feedback: d.feedback, createdAt: d.created_at }));
  },

  saveStaffPDPortfolio: async (entry: Omit<DbPDPortfolioEntry, 'id' | 'createdAt'>): Promise<DbPDPortfolioEntry> => {
    return staffService.savePDPortfolioEntry(entry);
  },

  saveStaffFloat: async (float: Omit<DbStaffFloat, 'id' | 'createdAt'>): Promise<DbStaffFloat> => {
    return staffService.addStaffFloat(float);
  },

  saveRequiredTraining: async (training: Omit<DbRequiredTraining, 'id' | 'createdAt'>): Promise<string> => {
    return staffService.addRequiredTraining(training);
  }
};
