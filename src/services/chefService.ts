
import { supabase } from './supabaseClient';
import { DbMenu, DbShoppingList } from './types';
import { isDemoMode } from './utils';

export const chefService = {
  getMenus: async (centreId: string): Promise<DbMenu[]> => {
    if (isDemoMode()) {
      return [
        { 
          id: 'm-1', 
          centreId, 
          name: 'Summer Menu',
          weekNumber: 1,
          data: { 
            monday: { morningTea: 'Fruit', lunch: 'Pasta', afternoonTea: 'Yogurt' },
            tuesday: { morningTea: 'Toast', lunch: 'Rice', afternoonTea: 'Cheese' },
            wednesday: { morningTea: 'Muffin', lunch: 'Chicken', afternoonTea: 'Fruit' },
            thursday: { morningTea: 'Cereal', lunch: 'Fish', afternoonTea: 'Crackers' },
            friday: { morningTea: 'Fruit', lunch: 'Vegetable', afternoonTea: 'Dip' }
          }, 
          createdAt: new Date().toISOString() 
        }
      ];
    }
    const { data, error } = await supabase.from('menus').select('*').eq('centre_id', centreId).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  saveMenu: async (menu: Omit<DbMenu, 'id' | 'createdAt'>): Promise<DbMenu> => {
    if (isDemoMode()) return { ...menu, id: `menu-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('menus').insert(menu).select().single();
    if (error) throw error;
    return data;
  },

  getShoppingLists: async (centreId: string): Promise<DbShoppingList[]> => {
    if (isDemoMode()) {
      return [
        { id: 'sl-1', centreId, menuId: 'm-1', items: [{ name: 'Apples', quantity: '5kg', category: 'Fruit' }], createdAt: new Date().toISOString() }
      ];
    }
    const { data, error } = await supabase.from('shopping_lists').select('*').eq('centre_id', centreId).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  saveShoppingList: async (list: Omit<DbShoppingList, 'id' | 'createdAt'>): Promise<DbShoppingList> => {
    if (isDemoMode()) return { ...list, id: `sl-${Date.now()}`, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('shopping_lists').insert(list).select().single();
    if (error) throw error;
    return data;
  }
};
