// Secure Storage Utility
// Handles localStorage with error handling, expiration, and cleanup

const STORAGE_PREFIX = 'vibes_';
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit

class SecureStorage {
  // Set item with optional expiration
  static setItem(key, value, expiresInMs = null) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      const data = {
        value,
        timestamp: Date.now(),
        expires: expiresInMs ? Date.now() + expiresInMs : null
      };
      
      const serialized = JSON.stringify(data);
      
      // Check storage size
      if (this.getStorageSize() + serialized.length > MAX_STORAGE_SIZE) {
        console.warn('Storage limit approaching, cleaning up old data');
        this.cleanup();
      }
      
      localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
      }
      return false;
    }
  }

  // Get item with expiration check
  static getItem(key) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      const item = localStorage.getItem(prefixedKey);
      
      if (!item) return null;
      
      const data = JSON.parse(item);
      
      // Check expiration
      if (data.expires && Date.now() > data.expires) {
        this.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  }

  // Remove item
  static removeItem(key) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Storage removal error:', error);
    }
  }

  // Clear all app data
  static clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  // Cleanup expired items
  static cleanup() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const data = JSON.parse(item);
              if (data.expires && Date.now() > data.expires) {
                localStorage.removeItem(key);
              }
            } catch (e) {
              // Invalid data, remove it
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('Storage cleanup error:', error);
    }
  }

  // Get storage size
  static getStorageSize() {
    let total = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
          total += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Storage size calculation error:', error);
    }
    return total;
  }

  // Check if storage is available
  static isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Auto cleanup on page load
if (typeof window !== 'undefined') {
  SecureStorage.cleanup();
}

export default SecureStorage;
