
import { supabase } from './supabaseClient';
import { isDemoMode } from './utils';

export const storageService = {
  uploadFile: async (file: File, path: string) => {
    if (isDemoMode()) return `https://fake-url.com/${path}`;
    
    const { data, error } = await supabase.storage
        .from('documents')
        .upload(path, file);
        
    if (error) throw error;
    return data.path;
  },

  getSignedUrl: async (path: string) => {
    if (isDemoMode()) return `https://fake-url.com/${path}`;

    const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(path, 3600);

    if (error) throw error;
    return data.signedUrl;
  },

  deleteFile: async (path: string) => {
    if (isDemoMode()) return;
    
    const { error } = await supabase.storage
        .from('documents')
        .remove([path]);
        
    if (error) throw error;
  }
};
