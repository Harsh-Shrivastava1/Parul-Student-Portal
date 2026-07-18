import { db, delay } from '../mock/db';
import type { User } from '../types';

export const profileService = {
  getUserProfile: async (userId: string): Promise<User | null> => {
    await delay();
    const user = db.users.find(u => u.enrollmentNumber === userId || u.id === userId);
    return user || null;
  },

  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User | null> => {
    await delay();
    const user = db.users.find(u => u.enrollmentNumber === userId || u.id === userId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...data };
    await db.saveUser(updatedUser);
    return updatedUser;
  },
};
