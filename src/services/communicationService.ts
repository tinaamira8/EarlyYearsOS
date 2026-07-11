
import { supabase } from './supabaseClient';
import { DbMessage, DbNotification, DbCommunityPost, DbCommunication } from './types';
import { isDemoMode } from './utils';

export const communicationService = {
  getMessages: async (centreId: string, userId: string): Promise<DbMessage[]> => {
    if (isDemoMode()) {
        return [
            { id: 'msg-1', centreId, senderId: 'parent-1', senderName: 'John Doe', receiverId: userId, content: 'Hi, just checking in on Leo.', createdAt: '2024-03-20T09:00:00Z', read: false },
            { id: 'msg-2', centreId, senderId: userId, senderName: 'Educator', receiverId: 'parent-1', content: 'He is doing great!', createdAt: '2024-03-20T09:15:00Z', read: true }
        ];
    }

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('centre_id', centreId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
        console.warn("Fetch messages error:", error);
        return [];
    }

    return data.map((m: any) => ({
        id: m.id,
        centreId: m.centre_id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        receiverId: m.receiver_id,
        content: m.content,
        createdAt: m.created_at,
        read: m.read
    }));
  },

  sendMessage: async (centreIdOrMessage: any, message?: any): Promise<DbMessage> => {
    const centreId = typeof centreIdOrMessage === 'string' ? centreIdOrMessage : (centreIdOrMessage as DbMessage).centreId;
    const actualMessage = typeof centreIdOrMessage === 'string' ? message : centreIdOrMessage;
    
    if (isDemoMode()) {
        return { id: `demo-msg-${Date.now()}`, centreId, createdAt: new Date().toISOString(), read: false, ...actualMessage };
    }

    const { data, error } = await supabase
        .from('messages')
        .insert([{
            centre_id: centreId,
            sender_id: actualMessage.senderId,
            sender_name: actualMessage.senderName,
            receiver_id: actualMessage.receiverId,
            content: actualMessage.content,
            read: false
        }])
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        centreId: data.centre_id,
        senderId: data.sender_id,
        senderName: data.sender_name,
        receiverId: data.receiver_id,
        content: data.content,
        createdAt: data.created_at,
        read: data.read
    };
  },

  getNotifications: async (userId: string): Promise<DbNotification[]> => {
    if (isDemoMode()) {
      return [
        { id: 'n-1', userId, title: 'New Learning Story', content: 'A new learning story has been posted for Oliver.', type: 'learning_story', read: false, createdAt: '2026-03-22T10:00:00Z' },
        { id: 'n-2', userId, title: 'Incident Report', content: 'An incident report has been filed for Mia.', type: 'incident', read: true, createdAt: '2026-03-21T15:30:00Z' }
      ];
    }
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  markNotificationRead: async (id: string): Promise<void> => {
    if (isDemoMode()) return;
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },

  createNotification: async (notification: Omit<DbNotification, 'id' | 'createdAt' | 'read'>): Promise<DbNotification> => {
    if (isDemoMode()) return { ...notification, id: `n-${Date.now()}`, read: false, createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('notifications').insert(notification).select().single();
    if (error) throw error;
    return data;
  },

  getCommunityPosts: async (centreId: string): Promise<DbCommunityPost[]> => {
    if (isDemoMode()) {
      return [
        { id: 'cp-1', centreId, authorId: 'u-1', authorName: 'Sarah Jenkins', category: 'playdate', title: 'Weekend Playdate at the Park', content: 'Anyone interested in a playdate this Saturday at 10am?', createdAt: '2026-03-20T10:00:00Z', comments: [{ id: 'c-1', authorName: 'John Doe', content: 'We would love to come!', createdAt: '2026-03-20T11:30:00Z' }] },
        { id: 'cp-2', centreId, authorId: 'u-2', authorName: 'Mike Ross', category: 'marketplace', title: 'Baby Stroller for Sale', content: 'Excellent condition, barely used. $50.', mediaUrl: 'https://picsum.photos/seed/stroller/800/600', createdAt: '2026-03-18T14:00:00Z' }
      ];
    }
    const { data, error } = await supabase.from('community_posts').select('*').eq('centre_id', centreId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  addCommunityPost: async (post: Omit<DbCommunityPost, 'id' | 'createdAt' | 'comments'>): Promise<DbCommunityPost> => {
    if (isDemoMode()) return { ...post, id: `cp-${Date.now()}`, createdAt: new Date().toISOString(), comments: [] };
    const { data, error } = await supabase.from('community_posts').insert([post]).select().single();
    if (error) throw error;
    return data;
  },

  saveCommunityPost: async (post: Partial<DbCommunityPost> & { centreId: string, authorId: string, authorName: string, title: string, content: string, category: DbCommunityPost['category'] }): Promise<DbCommunityPost> => {
    if (isDemoMode()) return { ...post, id: post.id || `cp-${Date.now()}`, createdAt: new Date().toISOString(), comments: post.comments || [] } as DbCommunityPost;
    if (post.id) {
      const { data, error } = await supabase.from('community_posts').update(post).eq('id', post.id).select().single();
      if (error) throw error;
      return data;
    } else {
      return communicationService.addCommunityPost(post);
    }
  },

  addCommunityComment: async (postId: string, comment: { authorName: string; content: string }): Promise<void> => {
    if (isDemoMode()) return;
    const { data: post } = await supabase.from('community_posts').select('comments').eq('id', postId).single();
    const updatedComments = [...(post?.comments || []), { ...comment, id: `c-${Date.now()}`, createdAt: new Date().toISOString() }];
    const { error } = await supabase.from('community_posts').update({ comments: updatedComments }).eq('id', postId);
    if (error) throw error;
  },

  getCommunications: async (centreId: string): Promise<DbCommunication[]> => {
    if (isDemoMode()) return [{ id: 'c1', centreId, type: 'email', subject: 'Welcome!', content: '...', status: 'sent', createdAt: new Date().toISOString() }];
    const { data, error } = await supabase.from('communications').select('*').eq('centreId', centreId);
    if (error) return [];
    return data || [];
  },

  addCommunication: async (comm: Omit<DbCommunication, 'id'>): Promise<string> => {
    if (isDemoMode()) return 'demo-c-' + Math.random();
    const { data, error } = await supabase.from('communications').insert([comm]).select();
    if (error) throw error;
    return data[0].id;
  },

  sendEmail: async (to: string, subject: string, html: string, metadata?: { centreId: string, childId?: string, parentId?: string }) => {
    if (isDemoMode()) {
        console.log("DEMO MODE: Email would be sent to", to, "with subject", subject);
        
        if (metadata) {
          await communicationService.addCommunication({
            centreId: metadata.centreId,
            childId: metadata.childId,
            parentId: metadata.parentId,
            type: 'email',
            subject,
            content: html,
            status: 'sent',
            metadata: {},
            createdAt: new Date().toISOString()
          });
        }
        return { success: true };
    }

    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, html }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send email');
    }

    return response.json();
  }
};
