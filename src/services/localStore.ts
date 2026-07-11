const PREFIX = 'eyos_';

function key(collection: string, centreId?: string): string {
  return centreId ? `${PREFIX}${centreId}_${collection}` : `${PREFIX}${collection}`;
}

export const localStore = {
  get<T>(collection: string, centreId?: string): T[] {
    try {
      const raw = localStorage.getItem(key(collection, centreId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  set<T>(collection: string, data: T[], centreId?: string): void {
    try {
      localStorage.setItem(key(collection, centreId), JSON.stringify(data));
    } catch (e) {
      console.warn('localStore write failed:', e);
    }
  },

  getOne<T>(collection: string, id: string, centreId?: string): T | null {
    const items = this.get<T & { id: string }>(collection, centreId);
    return items.find(i => i.id === id) || null;
  },

  upsert<T extends { id: string }>(collection: string, item: T, centreId?: string): T {
    const items = this.get<T>(collection, centreId);
    const idx = items.findIndex(i => (i as any).id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.push(item);
    this.set(collection, items, centreId);
    return item;
  },

  remove(collection: string, id: string, centreId?: string): void {
    const items = this.get<{ id: string }>(collection, centreId);
    this.set(collection, items.filter(i => i.id !== id), centreId);
  },

  getSingle<T>(key_name: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(`${PREFIX}${key_name}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  setSingle<T>(key_name: string, value: T): void {
    try {
      localStorage.setItem(`${PREFIX}${key_name}`, JSON.stringify(value));
    } catch (e) {
      console.warn('localStore write failed:', e);
    }
  },
};
