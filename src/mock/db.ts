import type { User, Internship, Application, Notification, ApplicationStatus } from '../types';

export const mockUsers: User[] = [
  {
    id: 'student_1',
    name: 'John Doe',
    enrollmentNumber: '12345678',
    email: 'john.doe@example.com',
    department: 'Computer Science',
    semester: 6,
    contact: '9876543210',
    address: '123 University Campus',
    cgpa: 8.5,
    spi: 8.7,
    skills: ['React', 'TypeScript', 'Node.js'],
    languages: ['English', 'Hindi'],
    backlogs: 0,
    attendance: 85,
    instituteId: 'PU',
  }
];

export const mockInternships: Internship[] = [
  {
    id: 'int_1',
    postName: 'Frontend Developer Intern',
    department: 'IT Cell',
    stipend: '15000',
    duration: '6 Months',
    skills: ['React', 'JavaScript', 'HTML/CSS'],
    vacancy: 5,
    interviewDate: '2026-08-01',
    interviewTime: '10:00 AM',
    venue: 'IT Cell Office, Block B',
    status: 'Open',
    tasks: ['Develop UI components', 'Integrate APIs', 'Fix frontend bugs'],
    postedDate: '2026-07-10',
    description: 'We are looking for an enthusiastic frontend intern to join our dynamic IT Cell team.',
    contactPerson: 'Mr. Smith',
    category: 'Software Development',
    minCGPA: 7.0,
  },
  {
    id: 'int_2',
    postName: 'Data Analyst Intern',
    department: 'Analytics Cell',
    stipend: '12000',
    duration: '3 Months',
    skills: ['Python', 'SQL', 'Data Visualization'],
    vacancy: 3,
    interviewDate: '2026-08-05',
    interviewTime: '02:00 PM',
    venue: 'Analytics Lab',
    status: 'Open',
    tasks: ['Data cleaning', 'Create dashboards', 'Report generation'],
    postedDate: '2026-07-12',
    description: 'Join us to analyze university data and create meaningful reports.',
    category: 'Data Science',
    minCGPA: 7.5,
  }
];

// Initialize some mock applications
export const mockApplications: Application[] = [
  {
    id: 'app_1',
    internshipId: 'int_2',
    internship: mockInternships[1],
    userId: 'student_1',
    appliedDate: new Date().toISOString(),
    status: 'Applied',
    lastUpdated: new Date().toISOString(),
    timeline: [
      {
        status: 'Applied',
        timestamp: new Date().toISOString(),
        notes: 'Application submitted successfully.'
      }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'student_1',
    title: 'Welcome to Student Internship Portal',
    message: 'Complete your profile to start applying for internships.',
    date: new Date().toISOString(),
    read: false,
    type: 'info'
  }
];

// Helper to simulate API delay
export const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  users: mockUsers,
  internships: mockInternships,
  applications: mockApplications,
  notifications: mockNotifications,
  
  async saveUser(user: User) {
    const index = this.users.findIndex(u => u.enrollmentNumber === user.enrollmentNumber);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return user;
  },
  
  async addApplication(application: Application) {
    this.applications.push(application);
  },
  
  async updateApplicationStatus(id: string, newStatus: ApplicationStatus, notes?: string) {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = newStatus;
      app.lastUpdated = new Date().toISOString();
      app.timeline.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        notes
      });
    }
  },
  
  async addNotification(notification: Notification) {
    this.notifications.push(notification);
  },
  
  async markNotificationRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
    }
  },
  
  async markAllNotificationsRead(userId: string) {
    this.notifications.filter(n => n.userId === userId).forEach(n => {
      n.read = true;
    });
  }
};
