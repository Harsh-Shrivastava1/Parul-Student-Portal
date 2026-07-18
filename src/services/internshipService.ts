import { db, delay } from '../mock/db';
import type { Internship } from '../types';

export const internshipService = {
  getInternships: async (): Promise<Internship[]> => {
    await delay();
    return db.internships;
  },

  getInternshipById: async (id: string): Promise<Internship | undefined> => {
    await delay();
    return db.internships.find(i => i.id === id);
  },

  searchInternships: async (query: string): Promise<Internship[]> => {
    await delay();
    const lowerQuery = query.toLowerCase();
    return db.internships.filter(
      i => 
        i.postName.toLowerCase().includes(lowerQuery) ||
        i.department.toLowerCase().includes(lowerQuery) ||
        i.skills.some(s => s.toLowerCase().includes(lowerQuery))
    );
  },
};
