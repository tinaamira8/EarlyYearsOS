
import { supabase } from './supabaseClient';
import { DbUser } from './types';
import { isDemoMode } from './utils';

export const userService = {
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  },

  upgradeUser: async (userId: string, plan: 'educator' | 'centre'): Promise<DbUser> => {
    if (isDemoMode()) {
      const user = JSON.parse(localStorage.getItem('kindy_user') || '{}');
      user.plan = plan;
      localStorage.setItem('kindy_user', JSON.stringify(user));
      return user as DbUser;
    }
    throw new Error("Real upgrade not implemented");
  },

  get: async (userId: string): Promise<DbUser | null> => {
    if (isDemoMode()) {
      const user = JSON.parse(localStorage.getItem('kindy_user') || '{}');
      if (user.id === userId) return user as DbUser;
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) return null;

    const { data: memberships } = await supabase
      .from('centre_members')
      .select('centre_id, role, centres(id, name)')
      .eq('user_id', userId);

    const primary = memberships?.[0];
    const centreIds = memberships?.map((m: any) => m.centre_id) || [];

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      centreId: primary?.centre_id || '',
      centreName: (primary?.centres as any)?.name || '',
      centreIds: centreIds.length > 1 ? centreIds : undefined,
      plan: profile.plan || 'free',
      role: primary?.role || 'Educator',
      onboardingCompleted: centreIds.length > 0
    } as DbUser;
  }
};
