import { supabase } from './supabaseClient';

export interface SyncOperation {
  id: string;
  table: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: number;
}

class OfflineSyncManager {
  private queueKey = 'earlyyears_offline_sync_queue';
  private isSyncing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.sync.bind(this));
    }
  }

  private getQueue(): SyncOperation[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.queueKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveQueue(queue: SyncOperation[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.queueKey, JSON.stringify(queue));
    }
  }

  public async queueOperation(table: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) {
    if (navigator.onLine) {
      // If online, execute immediately
      return this.executeOperation(table, action, payload);
    }

    // If offline, queue it
    const queue = this.getQueue();
    queue.push({
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      table,
      action,
      payload,
      timestamp: Date.now()
    });
    this.saveQueue(queue);
    console.log(`[OfflineSync] Queued ${action} for ${table}`);
  }

  private async executeOperation(table: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) {
    try {
      if (action === 'INSERT') {
        const { error } = await supabase.from(table).insert(payload);
        if (error) throw error;
      } else if (action === 'UPDATE') {
        const { id, ...updateData } = payload;
        const { error } = await supabase.from(table).update(updateData).eq('id', id);
        if (error) throw error;
      } else if (action === 'DELETE') {
        const { error } = await supabase.from(table).delete().eq('id', payload.id);
        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error(`[OfflineSync] Failed to execute ${action} on ${table}:`, error);
      return false;
    }
  }

  public async sync() {
    if (this.isSyncing || !navigator.onLine) return;
    
    const queue = this.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    console.log(`[OfflineSync] Starting sync of ${queue.length} items...`);

    const newQueue = [];
    for (const op of queue) {
      const success = await this.executeOperation(op.table, op.action, op.payload);
      if (!success) {
        // Keep in queue if failed
        newQueue.push(op);
      }
    }

    this.saveQueue(newQueue);
    this.isSyncing = false;
    
    if (newQueue.length === 0) {
      console.log('[OfflineSync] Sync complete. Queue empty.');
    } else {
      console.log(`[OfflineSync] Sync finished with ${newQueue.length} items remaining.`);
    }
  }
}

export const offlineSync = new OfflineSyncManager();
