import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export class StorageAdapter {
  
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      // Silent error handling for storage operations
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Silent error handling for storage operations
      throw error;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Silent error handling for storage operations
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      // Silent error handling for storage operations
      throw error;
    }
  }

  // Métodos específicos para autenticación
  static async getToken(): Promise<string | null> {
    return await this.getItem(TOKEN_KEY);
  }

  static async setToken(token: string): Promise<void> {
    await this.setItem(TOKEN_KEY, token);
  }

  static async removeToken(): Promise<void> {
    await this.removeItem(TOKEN_KEY);
  }

  static async getUser(): Promise<any | null> {
    const userStr = await this.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        // Silent error handling for JSON parsing
        return null;
      }
    }
    return null;
  }

  static async setUser(user: any): Promise<void> {
    await this.setItem(USER_KEY, JSON.stringify(user));
  }

  static async removeUser(): Promise<void> {
    await this.removeItem(USER_KEY);
  }

  static async clearAuthData(): Promise<void> {
    await Promise.all([
      this.removeToken(),
      this.removeUser()
    ]);
  }
}