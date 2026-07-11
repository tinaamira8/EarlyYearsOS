
import { supabase } from './supabaseClient';
import { DbDocument, DbObservation, DbPolicy, DbPolicySignOff, DbProfessionalMapping } from './types';
import { isDemoMode } from './utils';

const demoObservationSeed = [
  { id: 'obs-1', centreId: 'mock_centre_1', childId: 'c1', childName: 'Oliver B.', educatorId: 'e1', educatorName: 'Sarah J.', title: 'Building a Tall Tower', data: { content: 'Oliver showed great persistence...' }, date: '2024-03-20', status: 'published', createdAt: '2024-03-20T10:00:00Z' },
  { id: 'obs-2', centreId: 'mock_centre_1', childId: 'c2', childName: 'Mia T.', educatorId: 'e1', educatorName: 'Sarah J.', title: 'Sharing with Friends', data: { content: 'Mia initiated a cooperative game...' }, date: '2024-03-21', status: 'published', createdAt: '2024-03-21T11:00:00Z' }
] as DbObservation[];

const demoObservationCache = new Map<string, DbObservation[]>();

const getDemoObservationStore = (centreId: string) => {
  if (demoObservationCache.has(centreId)) {
    return demoObservationCache.get(centreId)!;
  }
  try {
    const raw = localStorage.getItem(`demo_observations_${centreId}`);
    if (!raw) {
      const seed = demoObservationSeed.filter(obs => obs.centreId === centreId);
      demoObservationCache.set(centreId, seed);
      return seed;
    }
    const parsed = JSON.parse(raw) as DbObservation[];
    const observations = Array.isArray(parsed) ? parsed : demoObservationSeed.filter(obs => obs.centreId === centreId);
    demoObservationCache.set(centreId, observations);
    return observations;
  } catch {
    const seed = demoObservationSeed.filter(obs => obs.centreId === centreId);
    demoObservationCache.set(centreId, seed);
    return seed;
  }
};

const setDemoObservationStore = (centreId: string, observations: DbObservation[]) => {
  demoObservationCache.set(centreId, observations);
  try {
    localStorage.setItem(`demo_observations_${centreId}`, JSON.stringify(observations));
  } catch {
    // Ignore storage failures in demo mode.
  }
};

export const documentService = {
  getDocuments: async (centreId: string, type?: DbDocument['type'] | 'all'): Promise<DbDocument[]> => {
    if (isDemoMode()) {
        const docs: DbDocument[] = [
            { id: 'doc-1', centreId, type: 'philosophy', title: 'Our Centre Philosophy', data: { content: 'We believe in child-led learning...' }, createdAt: '2024-01-01T00:00:00Z' },
            { id: 'doc-2', centreId, type: 'qip', title: 'Quality Improvement Plan 2024', data: { status: 'In Progress' }, createdAt: '2024-02-01T00:00:00Z' }
        ];
        return (type && type !== 'all') ? docs.filter(d => d.type === type) : docs;
    }

    let query = supabase
        .from('documents')
        .select('*')
        .eq('centre_id', centreId);

    if (type && type !== 'all') {
        query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
        console.warn("Fetch documents error:", error);
        return [];
    }

    return data.map((d: any) => ({
        id: d.id,
        centreId: d.centre_id,
        type: d.type,
        title: d.title,
        data: d.data,
        createdAt: d.created_at
    }));
  },

  addDocument: async (centreId: string, doc: Omit<DbDocument, 'id' | 'centreId' | 'createdAt'>): Promise<DbDocument> => {
    if (isDemoMode()) {
        return { id: `demo-doc-${Date.now()}`, centreId, createdAt: new Date().toISOString(), ...doc };
    }

    const { data, error } = await supabase
        .from('documents')
        .insert([{
            centre_id: centreId,
            type: doc.type,
            title: doc.title,
            data: doc.data
        }])
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        centreId: data.centre_id,
        type: data.type,
        title: data.title,
        data: data.data,
        createdAt: data.created_at
    };
  },

  getObservations: async (centreId: string): Promise<DbObservation[]> => {
    if (isDemoMode()) {
      return getDemoObservationStore(centreId);
    }
    const { data, error } = await supabase.from('observations').select('*').eq('centre_id', centreId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveObservation: async (obsOrCentreId: any, childName?: string, title?: string, data?: any): Promise<DbObservation> => {
    let observation: Omit<DbObservation, 'id' | 'createdAt'>;
    if (typeof obsOrCentreId === 'string') {
        observation = {
            centreId: obsOrCentreId,
            childId: 'demo-child-id', // Default for legacy call
            childName: childName!,
            title: title!,
            data: data!,
            educatorId: 'demo-educator-id',
            educatorName: 'Sarah Jenkins',
            date: new Date().toISOString().split('T')[0],
            status: 'published'
        };
    } else {
        observation = obsOrCentreId;
    }

    if (isDemoMode()) {
      const savedObservation = { ...observation, id: `obs-${Date.now()}`, createdAt: new Date().toISOString() };
      const current = getDemoObservationStore(savedObservation.centreId);
      const updated = [savedObservation, ...current.filter(obs => obs.id !== savedObservation.id)];
      setDemoObservationStore(savedObservation.centreId, updated);
      return savedObservation;
    }
    const { data: savedData, error } = await supabase.from('observations').insert(observation).select().single();
    if (error) throw error;
    return savedData;
  },

  getPolicies: async (centreId: string): Promise<DbPolicy[]> => {
    if (isDemoMode()) {
      return [
        { id: 'p-1', centreId, title: 'Child Protection Policy', category: 'Safety', version: '2024.1', status: 'active', lastReviewed: '2024-01-15', nextReviewDate: '2025-01-15', description: 'Comprehensive guidelines for child safety and mandatory reporting.', createdAt: '2024-01-01T00:00:00Z' },
        { id: 'p-2', centreId, title: 'Health and Hygiene Policy', category: 'Health', version: '2024.1', status: 'active', lastReviewed: '2024-02-10', nextReviewDate: '2025-02-10', description: 'Procedures for maintaining a healthy and clean environment.', createdAt: '2024-01-01T00:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('policies').select('*').eq('centre_id', centreId).order('title', { ascending: true });
    if (error) throw error;
    return data;
  },

  savePolicy: async (policy: Omit<DbPolicy, 'id' | 'createdAt'>): Promise<DbPolicy> => {
    if (isDemoMode()) return { ...policy, id: `p-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('policies').insert(policy).select().single();
    if (error) throw error;
    return data;
  },

  getPolicySignOffs: async (policyId: string): Promise<DbPolicySignOff[]> => {
    if (isDemoMode()) {
      return [{ id: 's-1', policyId, staffId: 'staff-1', staffName: 'Sarah Jenkins', signedAt: '2024-02-15T10:00:00Z', version: '2024.1' }];
    }
    const { data, error } = await supabase.from('policy_sign_offs').select('*').eq('policy_id', policyId);
    if (error) throw error;
    return data;
  },

  signOffPolicy: async (signOff: Omit<DbPolicySignOff, 'id'>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('policy_sign_offs').insert(signOff);
    if (error) throw error;
  },

  getProfessionalMappings: async (centreId: string, staffId?: string): Promise<DbProfessionalMapping[]> => {
    if (isDemoMode()) {
      return [
        { id: 'm-1', centreId, staffId: 'staff-1', sourceId: 'obs-1', sourceType: 'observation', sourceTitle: 'Building a Tall Tower', standardIds: ['1.1', '1.2'], reflections: 'This observation demonstrates my ability to support child-led learning...', createdAt: '2026-03-20T00:00:00Z' }
      ];
    }
    let query = supabase.from('professional_mappings').select('*').eq('centre_id', centreId);
    if (staffId) query = query.eq('staff_id', staffId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveProfessionalMapping: async (mapping: Omit<DbProfessionalMapping, 'id' | 'createdAt'>): Promise<DbProfessionalMapping> => {
    if (isDemoMode()) return { ...mapping, id: `m-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('professional_mappings').insert(mapping).select().single();
    if (error) throw error;
    return data;
  },

  saveDocument: async (centreId: string, docOrType: any, title?: string, data?: any): Promise<DbDocument> => {
    if (isDemoMode()) {
        if (typeof docOrType === 'string') {
            return { id: `demo-doc-${Date.now()}`, centreId, type: docOrType as any, title: title!, data: data!, createdAt: new Date().toISOString() };
        }
        return { 
            id: docOrType.id || `demo-doc-${Date.now()}`, 
            centreId, 
            createdAt: new Date().toISOString(), 
            ...docOrType 
        } as DbDocument;
    }

    if (typeof docOrType === 'string') {
        return documentService.addDocument(centreId, { type: docOrType as any, title: title!, data: data! });
    }

    const doc = docOrType;
    if (doc.id) {
        const { data: updatedData, error } = await supabase
            .from('documents')
            .update({
                title: doc.title,
                data: doc.data
            })
            .eq('id', doc.id)
            .select()
            .single();
        if (error) throw error;
        return {
            id: updatedData.id,
            centreId: updatedData.centre_id,
            type: updatedData.type,
            title: updatedData.title,
            data: updatedData.data,
            createdAt: updatedData.created_at
        };
    } else {
        return documentService.addDocument(centreId, doc);
    }
  },

  deleteDocument: async (docId: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('documents').delete().eq('id', docId);
    if (error) throw error;
  },

  deleteObservation: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('observations').delete().eq('id', id);
    if (error) throw error;
  },

  deletePolicy: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('policies').delete().eq('id', id);
    if (error) throw error;
  },

  deleteProfessionalMapping: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('professional_mappings').delete().eq('id', id);
    if (error) throw error;
  }
};
