import type { User } from '../types';
import { db, delay } from '../mock/db';

export const authService = {
  login: async (enrollmentNumber: string, password: string): Promise<User> => {
    if (!enrollmentNumber || !password) {
      throw new Error('Invalid credentials');
    }

    await delay(500);

    const cleanEnrollmentNumber = enrollmentNumber.trim();
    const user = db.users.find(u => u.enrollmentNumber === cleanEnrollmentNumber);
    if (!user) {
      console.error(`Login failed: Could not find user with enrollment number "${cleanEnrollmentNumber}"`);
      throw new Error('Invalid enrollment number or password');
    }

    // In a mock setup, any password works as long as user exists, or we could skip password check entirely.
    return user;
  },

  logout: async (): Promise<void> => {
    await delay(300);
  },

  getCurrentUser: async (): Promise<User | null> => {
    return null;
  },
};
