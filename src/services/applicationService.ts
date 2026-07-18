import { db, delay } from '../mock/db';
import type { Application, ApplicationFormData, ApplicationStatus } from '../types';

export const applicationService = {
  getApplications: async (userId: string): Promise<Application[]> => {
    await delay();
    return db.applications.filter(a => a.userId === userId);
  },

  getApplicationById: async (id: string): Promise<Application | undefined> => {
    await delay();
    return db.applications.find(a => a.id === id);
  },

  submitApplication: async (
    internshipId: string,
    userId: string,
    internship: Application['internship'],
    formData: ApplicationFormData,
  ): Promise<Application> => {
    await delay();
    const newApp: Application = {
      id: `app_${Date.now()}`,
      internshipId,
      internship,
      userId,
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'Applied' as ApplicationStatus,
      formData,
      timeline: [
        {
          status: 'Applied' as ApplicationStatus,
          timestamp: new Date().toISOString(),
          notes: 'Application submitted successfully.'
        }
      ]
    };
    await db.addApplication(newApp);
    return newApp;
  },

  withdrawApplication: async (appId: string): Promise<void> => {
    await delay();
    const index = db.applications.findIndex(a => a.id === appId);
    if (index >= 0) {
      db.applications.splice(index, 1);
    }
  },
};
