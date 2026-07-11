
import { supabase } from './supabaseClient';
import { DbInvoice, DbEnquiry, DbPaymentMethod, DbInventoryItem, DbInventoryTransfer, DbExpense, DbCentre } from './types';
import { isDemoMode } from './utils';

export const financeService = {
  getInvoices: async (centreId: string, parentId?: string): Promise<DbInvoice[]> => {
    if (isDemoMode()) {
      return [
        { id: 'inv-1', centreId, parentId: 'p-1', parentName: 'John Doe', childName: 'Leo Doe', amount: 450.00, dueDate: '2026-04-01', status: 'sent', items: [{ description: 'Weekly Fees - Week 12', amount: 450.00 }], createdAt: '2026-03-20T00:00:00Z' },
        { id: 'inv-2', centreId, parentId: 'p-1', parentName: 'John Doe', childName: 'Leo Doe', amount: 450.00, dueDate: '2026-03-25', status: 'paid', items: [{ description: 'Weekly Fees - Week 11', amount: 450.00 }], createdAt: '2026-03-13T00:00:00Z' },
        { id: 'inv-3', centreId, parentId: 'p-2', parentName: 'Jane Smith', childName: 'Mia Smith', amount: 380.00, dueDate: '2026-03-15', status: 'overdue', items: [{ description: 'Weekly Fees - Week 10', amount: 380.00 }], createdAt: '2026-03-06T00:00:00Z' }
      ];
    }
    let query = supabase.from('invoices').select('*').eq('centre_id', centreId);
    if (parentId) query = query.eq('parent_id', parentId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  createInvoice: async (centreIdOrInvoice: any, invoice?: any): Promise<DbInvoice> => {
    const actualInvoice = typeof centreIdOrInvoice === 'string' ? invoice : centreIdOrInvoice;
    if (isDemoMode()) return { ...actualInvoice, id: `inv-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('invoices').insert(actualInvoice).select().single();
    if (error) throw error;
    return data;
  },

  updateInvoiceStatus: async (id: string, status: DbInvoice['status']): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('invoices').update({ status }).eq('id', id);
    if (error) throw error;
  },

  getEnquiries: async (centreId: string): Promise<DbEnquiry[]> => {
    if (isDemoMode()) {
      const demoEnquiries = JSON.parse(localStorage.getItem('demo_enquiries') || '[]');
      const defaultEnquiries = [
        { id: 'enq-1', centreId, parentName: 'Alice Johnson', childName: 'Baby Johnson', childDob: '2025-12-01', email: 'alice@example.com', phone: '0412345678', status: 'new', createdAt: '2026-03-20T10:00:00Z' },
        { id: 'enq-2', centreId, parentName: 'Bob Wilson', childName: 'Toddler Wilson', childDob: '2024-05-15', email: 'bob@example.com', phone: '0423456789', status: 'tour_booked', notes: 'Tour scheduled for Friday 10am', createdAt: '2026-03-15T14:30:00Z' }
      ];
      // Combine defaults with any submitted during the session
      return [...demoEnquiries.filter((e: any) => e.centreId === centreId), ...defaultEnquiries] as DbEnquiry[];
    }
    const { data, error } = await supabase.from('enquiries').select('*').eq('centre_id', centreId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  updateEnquiryStatus: async (id: string, status: DbEnquiry['status']): Promise<void> => {
    if (isDemoMode()) {
      const demoEnquiries = JSON.parse(localStorage.getItem('demo_enquiries') || '[]');
      const updated = demoEnquiries.map((e: any) => e.id === id ? { ...e, status } : e);
      localStorage.setItem('demo_enquiries', JSON.stringify(updated));
      return;
    }
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (error) throw error;
  },

  submitEnquiry: async (enquiry: Omit<DbEnquiry, 'id' | 'createdAt' | 'status'>): Promise<DbEnquiry> => {
    if (isDemoMode()) {
      const newEnquiry = { ...enquiry, id: `enq-${Date.now()}`, status: 'new', createdAt: new Date().toISOString() } as DbEnquiry;
      const demoEnquiries = JSON.parse(localStorage.getItem('demo_enquiries') || '[]');
      localStorage.setItem('demo_enquiries', JSON.stringify([newEnquiry, ...demoEnquiries]));
      return newEnquiry;
    }
    const { data, error } = await supabase.from('enquiries').insert([{ ...enquiry, status: 'new' }]).select().single();
    if (error) throw error;
    return data;
  },

  getPaymentMethods: async (userId: string): Promise<DbPaymentMethod[]> => {
    if (isDemoMode()) {
      return [{ id: 'pm-1', userId, type: 'card', last4: '4242', brand: 'visa', isDefault: true, createdAt: '2026-01-01T00:00:00Z' }];
    }
    const { data, error } = await supabase.from('payment_methods').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  getInventory: async (centreId: string): Promise<DbInventoryItem[]> => {
    if (isDemoMode()) {
      return [
        { id: 'inv-1', centreId, name: 'Nappies (Size 3)', category: 'Consumables', currentStock: 45, minStock: 50, unit: 'packs', updatedAt: '2026-03-20T00:00:00Z' },
        { id: 'inv-2', centreId, name: 'Milk (Full Cream)', category: 'Kitchen', currentStock: 12, minStock: 10, unit: 'litres', updatedAt: '2026-03-22T00:00:00Z' },
        { id: 'inv-3', centreId, name: 'Sunscreen (SPF 50+)', category: 'Safety', currentStock: 3, minStock: 5, unit: 'bottles', updatedAt: '2026-03-15T00:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('inventory').select('*').eq('centre_id', centreId);
    if (error) throw error;
    return data;
  },

  updateStock: async (id: string, currentStock: number): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('inventory').update({ current_stock: currentStock, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },

  getInventoryTransfers: async (centreId: string): Promise<DbInventoryTransfer[]> => {
    if (isDemoMode()) {
      return [{ id: 'tr-1', itemId: 'inv-1', itemName: 'Nappies (Size 3)', fromCentreId: 'centre-2', toCentreId: centreId, quantity: 10, unit: 'packs', status: 'pending', requestedBy: 'Sarah Jenkins', createdAt: new Date().toISOString() }];
    }
    const { data, error } = await supabase.from('inventory_transfers').select('*').or(`from_centre_id.eq.${centreId},to_centre_id.eq.${centreId}`);
    if (error) return [];
    return data.map((d: any) => ({ id: d.id, itemId: d.item_id, itemName: d.item_name, fromCentreId: d.from_centre_id, toCentreId: d.to_centre_id, quantity: d.quantity, unit: d.unit, status: d.status, requestedBy: d.requested_by, createdAt: d.created_at }));
  },

  addInventoryTransfer: async (transfer: Omit<DbInventoryTransfer, 'id' | 'createdAt'>): Promise<DbInventoryTransfer> => {
    if (isDemoMode()) return { ...transfer, id: `tr-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('inventory_transfers').insert([transfer]).select().single();
    if (error) throw error;
    return { id: data.id, itemId: data.item_id, itemName: data.item_name, fromCentreId: data.from_centre_id, toCentreId: data.to_centre_id, quantity: data.quantity, unit: data.unit, status: data.status, requestedBy: data.requested_by, createdAt: data.created_at };
  },

  getExpenses: async (centreId: string): Promise<DbExpense[]> => {
    if (isDemoMode()) {
      return [
        { id: 'e1', centreId, date: '2024-03-01', category: 'Supplies', amount: 450.00, description: 'Art supplies and nappies', status: 'Paid' },
        { id: 'e2', centreId, date: '2024-03-05', category: 'Maintenance', amount: 1200.00, description: 'Garden landscaping', status: 'Pending' }
      ];
    }
    const { data, error } = await supabase.from('expenses').select('*').eq('centre_id', centreId);
    if (error) return [];
    return data || [];
  },

  addExpense: async (expense: Omit<DbExpense, 'id'>): Promise<string> => {
    if (isDemoMode()) return 'demo-e-' + Math.random();
    const { data, error } = await supabase.from('expenses').insert([expense]).select();
    if (error) throw error;
    return data[0].id;
  },

  addInventoryItem: async (item: Omit<DbInventoryItem, 'id' | 'updatedAt'>): Promise<DbInventoryItem> => {
    if (isDemoMode()) return { ...item, id: `inv-${Date.now()}`, updatedAt: new Date().toISOString() } as DbInventoryItem;
    const { data, error } = await supabase.from('inventory').insert(item).select().single();
    if (error) throw error;
    return data;
  },

  updateInventoryItem: async (id: string, updates: Partial<DbInventoryItem>): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('inventory').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },

  restockInventoryItem: async (id: string, centreIdOrQuantity: any, itemName?: string, quantity?: number, cost?: number): Promise<void> => {
    const actualQuantity = typeof centreIdOrQuantity === 'number' ? centreIdOrQuantity : quantity!;
    if (isDemoMode()) return;
    const { data: item } = await supabase.from('inventory').select('current_stock').eq('id', id).single();
    const newStock = (item?.current_stock || 0) + actualQuantity;
    return financeService.updateStock(id, newStock);
  },

  addPaymentMethod: async (userIdOrMethod: any, method?: any): Promise<void> => {
    const userId = typeof userIdOrMethod === 'string' ? userIdOrMethod : (userIdOrMethod as DbPaymentMethod).userId;
    const actualMethod = typeof userIdOrMethod === 'string' ? method : userIdOrMethod;
    if (isDemoMode()) return;
    const { error } = await supabase.from('payment_methods').insert([{ ...actualMethod, user_id: userId }]);
    if (error) throw error;
  },

  getCentres: async (centreIds?: string[]): Promise<DbCentre[]> => {
    if (isDemoMode()) {
      const centres = [
        { id: 'centre-1', name: 'Kindy North', address: '123 North St', phone: '02 9999 1111', email: 'north@kindy.com', capacity: 60, occupancy: 85, revenue: 45000, complianceScore: 98 },
        { id: 'centre-2', name: 'Kindy South', address: '456 South Ave', phone: '02 9999 2222', email: 'south@kindy.com', capacity: 45, occupancy: 92, revenue: 38000, complianceScore: 95 },
        { id: 'centre-3', name: 'Kindy West', address: '789 West Rd', phone: '02 9999 3333', email: 'west@kindy.com', capacity: 80, occupancy: 78, revenue: 52000, complianceScore: 92 }
      ];
      if (centreIds && centreIds.length > 0) return centres.filter(c => centreIds.includes(c.id));
      return centres;
    }
    let query = supabase.from('centres').select('*');
    if (centreIds && centreIds.length > 0) query = query.in('id', centreIds);
    const { data, error } = await query;
    if (error) return [];
    return data || [];
  }
};
