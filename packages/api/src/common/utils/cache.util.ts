interface CacheItem {
  value: unknown;
  timeoutId: NodeJS.Timeout;
}

class Cache {
  private cache: Map<string, CacheItem>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Sets a value in the cache with an optional TTL (Time To Live).
   * @param key The key under which the value is stored.
   * @param value The value to store in the cache.
   * @param ttl Optional time-to-live in milliseconds (default is 5000ms).
   */
  set<T>(key: string, value: T, ttl = 5000): void {
    this.setCache(key, value, ttl);
  }

  /**
   * Retrieves a value from the cache.
   * @param key The key of the value to retrieve.
   * @returns The cached value if present and not expired; otherwise, null.
   */
  get<T>(key: string): T | null {
    return this.getCache<T>(key);
  }

  /**
   * Deletes a value from the cache.
   * @param key The key of the value to delete.
   */
  delete(key: string): void {
    this.deleteCache(key);
  }

  /**
   * Internal method to set a value in the cache.
   * @param key The key under which the value is stored.
   * @param value The value to store in the cache.
   * @param ttl Time-to-live in milliseconds.
   */
  private setCache<T>(key: string, value: T, ttl: number): void {
    // If the key exists, clear the existing timeout to prevent premature deletion
    const existingItem = this.cache.get(key);
    if (existingItem) {
      clearTimeout(existingItem.timeoutId);
    }

    // Set a timeout to automatically delete the key after TTL expires
    const timeoutId = setTimeout(() => {
      this.cache.delete(key);
    }, ttl);

    // Store the value and its associated timeout ID in the cache
    this.cache.set(key, { value, timeoutId });
  }

  /**
   * Internal method to retrieve a value from the cache.
   * @param key The key of the value to retrieve.
   * @returns The cached value if present; otherwise, null.
   */
  private getCache<T>(key: string): T | null {
    const cachedItem = this.cache.get(key);
    return cachedItem ? (cachedItem.value as T) : null;
  }

  /**
   * Internal method to delete a value from the cache.
   * @param key The key of the value to delete.
   */
  private deleteCache(key: string): void {
    const cachedItem = this.cache.get(key);
    if (cachedItem) {
      // Clear the timeout to prevent the automatic deletion callback from running
      clearTimeout(cachedItem.timeoutId);
    }
    this.cache.delete(key);
  }
}

export const inMemoryCache = new Cache();
