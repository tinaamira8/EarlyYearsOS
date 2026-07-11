
import { supabase } from './supabaseClient';
import { DbCentre, DbRoom, DbRoster, DbEvent, DbSustainabilityAudit, DbSustainabilityGoal, DbCurriculumBoard, DbLandingPageConfig, DbMaintenanceRequest, DbAsset, DbMaintenanceLog, DbResource, DbResourceBooking, DbWellbeingMood } from './types';
import { isDemoMode } from './utils';

export const centreService = {
  createCentre: async (centre: { name: string; address?: string; phone?: string; email?: string; approvalNumber?: string; capacity?: number }, userId: string, role: string = 'Admin'): Promise<DbCentre> => {
    if (isDemoMode()) {
      const id = `centre-${Date.now()}`;
      return { id, name: centre.name, address: centre.address || '', phone: centre.phone || '', email: centre.email || '', capacity: centre.capacity || 0, occupancy: 0, revenue: 0, complianceScore: 0 };
    }
    const { data, error } = await supabase.from('centres').insert([{
      name: centre.name,
      address: centre.address,
      phone: centre.phone,
      email: centre.email,
      approval_number: centre.approvalNumber,
      capacity: centre.capacity || 0
    }]).select().single();
    if (error) throw error;

    const { error: memberError } = await supabase.from('centre_members').insert([{
      centre_id: data.id,
      user_id: userId,
      role
    }]);
    if (memberError) throw memberError;

    return { id: data.id, name: data.name, address: data.address, phone: data.phone, email: data.email, capacity: data.capacity, occupancy: 0, revenue: 0, complianceScore: 0 };
  },

  inviteMember: async (centreId: string, userId: string, role: string = 'Educator'): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('centre_members').insert([{ centre_id: centreId, user_id: userId, role }]);
    if (error) throw error;
  },

  getMembers: async (centreId: string): Promise<{ userId: string; role: string; name: string; email: string }[]> => {
    if (isDemoMode()) return [];
    const { data, error } = await supabase.from('centre_members').select('user_id, role, profiles(name, email)').eq('centre_id', centreId);
    if (error) return [];
    return (data || []).map((m: any) => ({ userId: m.user_id, role: m.role, name: m.profiles?.name || '', email: m.profiles?.email || '' }));
  },

  updateMemberRole: async (centreId: string, userId: string, role: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('centre_members').update({ role }).eq('centre_id', centreId).eq('user_id', userId);
    if (error) throw error;
  },

  removeMember: async (centreId: string, userId: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('centre_members').delete().eq('centre_id', centreId).eq('user_id', userId);
    if (error) throw error;
  },

  getCentre: async (centreId: string): Promise<DbCentre | null> => {
    if (isDemoMode()) {
        return {
            id: centreId,
            name: 'Kindy North',
            address: '123 North St',
            phone: '02 9999 1111',
            email: 'north@kindy.com',
            capacity: 60,
            occupancy: 85,
            revenue: 45000,
            complianceScore: 98
        };
    }

    const { data, error } = await supabase
        .from('centres')
        .select('*')
        .eq('id', centreId)
        .single();

    if (error) {
        console.warn("Fetch centre error:", error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        capacity: data.capacity,
        occupancy: data.occupancy,
        revenue: data.revenue,
        complianceScore: data.compliance_score
    };
  },

  get: async (centreId: string): Promise<DbCentre | null> => {
    return centreService.getCentre(centreId);
  },

  getRooms: async (centreId: string): Promise<DbRoom[]> => {
    if (isDemoMode()) {
        return [
            { id: 'room-1', centreId, name: 'Nursery', ageGroup: '0-2 years', capacity: 12 },
            { id: 'room-2', centreId, name: 'Toddlers', ageGroup: '2-3 years', capacity: 15 },
            { id: 'room-3', centreId, name: 'Preschool', ageGroup: '3-5 years', capacity: 20 }
        ];
    }

    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('centre_id', centreId);

    if (error) {
        console.warn("Fetch rooms error:", error);
        return [];
    }

    return data.map((r: any) => ({
        id: r.id,
        centreId: r.centre_id,
        name: r.name,
        ageGroup: r.age_group,
        capacity: r.capacity
    }));
  },

  getRoster: async (centreId: string, weekStarting: string): Promise<DbRoster | null> => {
    if (isDemoMode()) {
      return { id: 'ros-1', centreId, weekStarting, data: {} };
    }
    const { data, error } = await supabase.from('rosters').select('*').eq('centre_id', centreId).eq('week_starting', weekStarting).single();
    if (error) return null;
    return data;
  },

  saveRoster: async (centreIdOrRoster: any, weekStarting?: string, data?: any): Promise<void> => {
    let roster: Omit<DbRoster, 'id'>;
    if (typeof centreIdOrRoster === 'string') {
        roster = { centreId: centreIdOrRoster, weekStarting: weekStarting!, data: data! };
    } else {
        roster = centreIdOrRoster;
    }
    if (isDemoMode()) return;
    const { error } = await supabase.from('rosters').upsert(roster, { onConflict: 'centre_id,week_starting' });
    if (error) throw error;
  },

  getRosters: async (centreId: string): Promise<DbRoster[]> => {
    if (isDemoMode()) return [];
    const { data, error } = await supabase.from('rosters').select('*').eq('centre_id', centreId);
    if (error) return [];
    return data;
  },

  getEvents: async (centreId: string): Promise<DbEvent[]> => {
    if (isDemoMode()) {
      return [
        { id: 'ev-1', centreId, title: 'Easter Egg Hunt', description: 'Fun hunt in the playground.', date: '2026-04-10', category: 'other', createdAt: '2026-03-20T00:00:00Z' },
        { id: 'ev-2', centreId, title: 'Zoo Excursion', description: 'Trip to Taronga Zoo.', date: '2026-05-15', category: 'excursion', location: 'Taronga Zoo', createdAt: '2026-03-21T00:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('events').select('*').eq('centre_id', centreId).order('date', { ascending: true });
    if (error) throw error;
    return data;
  },

  saveEvent: async (centreIdOrEvent: any, event?: any): Promise<DbEvent> => {
    const actualEvent = typeof centreIdOrEvent === 'string' ? event : centreIdOrEvent;
    if (isDemoMode()) return { ...actualEvent, id: `ev-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('events').insert(actualEvent).select().single();
    if (error) throw error;
    return data;
  },

  getSustainabilityAudits: async (centreId: string): Promise<DbSustainabilityAudit[]> => {
    if (isDemoMode()) {
      return [
        { id: 'sa-1', centreId, category: 'waste', metric: 'bins_emptied', value: 3, unit: 'bins', recordedBy: 'Oliver B.', isChildLed: true, createdAt: '2026-03-22T10:00:00Z' },
        { id: 'sa-2', centreId, category: 'energy', metric: 'lights_off', value: 1, unit: 'check', recordedBy: 'Sarah J.', isChildLed: false, createdAt: '2026-03-22T17:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('sustainability_audits').select('*').eq('centre_id', centreId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveSustainabilityAudit: async (centreIdOrAudit: any, audit?: any): Promise<DbSustainabilityAudit> => {
    const actualAudit = typeof centreIdOrAudit === 'string' ? audit : centreIdOrAudit;
    if (isDemoMode()) return { ...actualAudit, id: `sa-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('sustainability_audits').insert(actualAudit).select().single();
    if (error) throw error;
    return data;
  },

  getSustainabilityGoals: async (centreId: string): Promise<DbSustainabilityGoal[]> => {
    if (isDemoMode()) {
      return [
        { id: 'sg-1', centreId, category: 'waste', title: 'Reduce landfill waste by 20%', targetValue: 80, currentValue: 95, unit: 'kg/week', deadline: '2026-12-31', status: 'active' }
      ];
    }
    const { data, error } = await supabase.from('sustainability_goals').select('*').eq('centre_id', centreId);
    if (error) throw error;
    return data;
  },

  getCurriculumBoard: async (centreId: string, roomId: string, weekStarting: string): Promise<DbCurriculumBoard | null> => {
    if (isDemoMode()) {
      return { id: 'cb-1', centreId, roomId, roomName: 'Toddlers', weekStarting, data: {}, createdAt: '2026-03-20T00:00:00Z' };
    }
    const { data, error } = await supabase.from('curriculum_boards').select('*').eq('centre_id', centreId).eq('room_id', roomId).eq('week_starting', weekStarting).single();
    if (error) return null;
    return data;
  },

  saveCurriculumBoard: async (board: Omit<DbCurriculumBoard, 'id' | 'createdAt'>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('curriculum_boards').upsert(board, { onConflict: 'centre_id,room_id,week_starting' });
    if (error) throw error;
  },

  getLandingPageConfig: async (centreId: string): Promise<DbLandingPageConfig | null> => {
    if (isDemoMode()) {
      return { id: 'lp-1', centreId, heroTitle: 'Welcome to Kindy North', heroSubtitle: 'Where every child shines.', primaryColor: '#4F46E5', showCurriculum: true, featuredRooms: ['room-1', 'room-2'], slug: 'kindy-north', isActive: true, updatedAt: '2026-03-20T00:00:00Z' };
    }
    const { data, error } = await supabase.from('landing_page_configs').select('*').eq('centre_id', centreId).single();
    if (error) return null;
    return data;
  },

  saveLandingPageConfig: async (config: Omit<DbLandingPageConfig, 'id' | 'updatedAt'>): Promise<DbLandingPageConfig> => {
    if (isDemoMode()) return { ...config, id: 'lp-1', updatedAt: new Date().toISOString() };
    const { data, error } = await supabase.from('landing_page_configs').upsert({ ...config, updated_at: new Date().toISOString() }, { onConflict: 'centre_id' }).select().single();
    if (error) throw error;
    return data;
  },

  getMaintenanceRequests: async (centreId: string): Promise<DbMaintenanceRequest[]> => {
    if (isDemoMode()) {
      return [
        { id: 'mr-1', centreId, title: 'Broken swing seat', description: 'The rubber seat on the blue swing is cracked.', location: 'Outdoor Playground', priority: 'high', status: 'pending', reportedBy: 'staff-1', reportedByName: 'Sarah Jenkins', createdAt: new Date().toISOString() },
        { id: 'mr-2', centreId, title: 'Leaking tap', description: 'Tap in the nursery bathroom is dripping.', location: 'Nursery', priority: 'medium', status: 'in_progress', reportedBy: 'staff-2', reportedByName: 'Mike Ross', assignedTo: 'maint-1', assignedToName: 'Bob Fixit', createdAt: new Date().toISOString() }
      ];
    }
    const { data, error } = await supabase.from('maintenance_requests').select('*').eq('centre_id', centreId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  saveMaintenanceRequest: async (request: Omit<DbMaintenanceRequest, 'id' | 'createdAt'>): Promise<DbMaintenanceRequest> => {
    if (isDemoMode()) return { ...request, id: `mr-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('maintenance_requests').insert(request).select().single();
    if (error) throw error;
    return data;
  },

  updateMaintenanceRequest: async (id: string, updates: Partial<DbMaintenanceRequest>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('maintenance_requests').update(updates).eq('id', id);
    if (error) throw error;
  },

  getAssets: async (centreId: string): Promise<DbAsset[]> => {
    if (isDemoMode()) return [{ id: 'a1', centreId, name: 'Climbing Frame', category: 'Playground', location: 'Backyard', status: 'Functional' }];
    const { data, error } = await supabase.from('assets').select('*').eq('centre_id', centreId);
    if (error) return [];
    return data || [];
  },

  addAsset: async (asset: Omit<DbAsset, 'id'>): Promise<string> => {
    if (isDemoMode()) return 'demo-a-' + Math.random();
    const { data, error } = await supabase.from('assets').insert([asset]).select();
    if (error) throw error;
    return data[0].id;
  },

  getMaintenanceLogs: async (assetId: string): Promise<DbMaintenanceLog[]> => {
    if (isDemoMode()) return [{ id: 'l1', assetId, centreId: 'c1', date: '2024-01-01', type: 'Routine Check', description: 'Checked bolts', performedBy: 'John', status: 'Completed' }];
    const { data, error } = await supabase.from('maintenance_logs').select('*').eq('assetId', assetId);
    if (error) return [];
    return data || [];
  },

  addMaintenanceLog: async (log: Omit<DbMaintenanceLog, 'id'>): Promise<string> => {
    if (isDemoMode()) return 'demo-l-' + Math.random();
    const { data, error } = await supabase.from('maintenance_logs').insert([log]).select();
    if (error) throw error;
    return data[0].id;
  },

  getResources: async (centreId: string): Promise<DbResource[]> => {
    if (isDemoMode()) return [{ id: 'r1', centreId, name: 'Art Room', type: 'Room', status: 'Available' }];
    const { data, error } = await supabase.from('resources').select('*').eq('centre_id', centreId);
    if (error) return [];
    return data || [];
  },

  getResourceBookings: async (centreId: string, date?: string): Promise<DbResourceBooking[]> => {
    if (isDemoMode()) return [{ id: 'b1', centreId, resourceId: 'r1', resourceName: 'Art Room', staffId: 's1', staffName: 'Sarah', date: date || '2024-03-20', startTime: '10:00', endTime: '11:00', purpose: 'Painting', createdAt: new Date().toISOString() }];
    let query = supabase.from('resource_bookings').select('*').eq('centre_id', centreId);
    if (date) query = query.eq('date', date);
    const { data, error } = await query;
    if (error) return [];
    return data || [];
  },

  addResourceBooking: async (booking: Omit<DbResourceBooking, 'id' | 'createdAt'>): Promise<string> => {
    if (isDemoMode()) return 'demo-b-' + Math.random();
    const { data, error } = await supabase.from('resource_bookings').insert([booking]).select();
    if (error) throw error;
    return data[0].id;
  },

  getWellbeingMoods: async (centreId: string): Promise<DbWellbeingMood[]> => {
    if (isDemoMode()) return [{ id: 'm1', centreId, mood: 'great', date: '2024-03-20', createdAt: new Date().toISOString() }];
    const { data, error } = await supabase.from('wellbeing_moods').select('*').eq('centreId', centreId);
    if (error) return [];
    return data || [];
  },

  saveWellbeingMood: async (centreIdOrMood: any, mood?: any): Promise<void> => {
    const actualMood = typeof centreIdOrMood === 'string' ? mood : centreIdOrMood;
    if (isDemoMode()) return;
    const { error } = await supabase.from('wellbeing_moods').insert([actualMood]);
    if (error) throw error;
  },

  addWellbeingMood: async (centreIdOrMood: any, mood?: any): Promise<void> => {
    return centreService.saveWellbeingMood(centreIdOrMood, mood);
  },

  updateAssetStatus: async (id: string, status: string, lastInspected?: string): Promise<void> => {
    if (isDemoMode()) return;
    const updates: any = { status };
    if (lastInspected) updates.last_inspected = lastInspected;
    const { error } = await supabase.from('assets').update(updates).eq('id', id);
    if (error) throw error;
  },

  updateEvent: async (id: string, updates: Partial<DbEvent>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('events').update(updates).eq('id', id);
    if (error) throw error;
  },

  addEvent: async (centreIdOrEvent: any, event?: any): Promise<DbEvent> => {
    return centreService.saveEvent(centreIdOrEvent, event);
  },

  deleteEvent: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  addSustainabilityAudit: async (centreIdOrAudit: any, audit?: any): Promise<DbSustainabilityAudit> => {
    return centreService.saveSustainabilityAudit(centreIdOrAudit, audit);
  },

  getCurriculumBoards: async (centreId: string, weekStarting?: string): Promise<DbCurriculumBoard[]> => {
    if (isDemoMode()) return [];
    let query = supabase.from('curriculum_boards').select('*').eq('centre_id', centreId);
    if (weekStarting) query = query.eq('week_starting', weekStarting);
    const { data, error } = await query;
    if (error) return [];
    return data;
  },

  addRoom: async (centreIdOrRoom: any, room?: any): Promise<DbRoom> => {
    const centreId = typeof centreIdOrRoom === 'string' ? centreIdOrRoom : (centreIdOrRoom as DbRoom).centreId;
    const actualRoom = typeof centreIdOrRoom === 'string' ? room : centreIdOrRoom;
    if (isDemoMode()) return { ...actualRoom, id: `room-${Date.now()}`, centreId } as DbRoom;
    const { data, error } = await supabase.from('rooms').insert([{ ...actualRoom, centre_id: centreId }]).select().single();
    if (error) throw error;
    return {
        id: data.id,
        centreId: data.centre_id,
        name: data.name,
        ageGroup: data.age_group,
        capacity: data.capacity
    };
  },

  deleteResourceBooking: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('resource_bookings').delete().eq('id', id);
    if (error) throw error;
  }
};
