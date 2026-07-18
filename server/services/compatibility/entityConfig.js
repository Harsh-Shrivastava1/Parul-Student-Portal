const ENTITY_CONFIG = {
  internships: {
    collections: ['internships', 'advertisements'],
    idFields: ['internshipId', 'id', '_id'],
    businessFields: ['internshipTitle', 'title', 'companyDepartment', 'department', 'applicationDeadline', 'deadline'],
  },
  applications: {
    collections: ['applications', 'internshipApplications', 'application'],
    idFields: ['applicationId', 'id', '_id'],
    businessFields: ['internshipId', 'userId', 'studentId', 'appliedDate'],
  },
  notifications: {
    collections: ['notifications', 'notification', 'alerts'],
    idFields: ['notificationId', 'id', '_id'],
    businessFields: ['userId', 'title', 'message', 'date'],
  },
  trainings: {
    collections: ['trainings', 'training'],
    idFields: ['trainingId', 'id', '_id'],
    businessFields: ['applicationId', 'studentId', 'internshipId', 'startDate'],
  },
  attendance: {
    collections: ['attendance', 'attendances'],
    idFields: ['attendanceId', 'id', '_id'],
    businessFields: ['trainingId', 'studentId', 'date'],
  },
  feedbacks: {
    collections: ['feedback', 'feedbacks'],
    idFields: ['feedbackId', 'id', '_id'],
    businessFields: ['applicationId', 'studentId', 'internshipId', 'submittedAt', 'createdAt'],
  },
  advertisements: {
    collections: ['advertisements', 'ads'],
    idFields: ['id', '_id'],
    businessFields: ['title', 'department', 'applicationDeadline'],
  },
  certificates: {
    collections: ['certificates', 'certificate'],
    idFields: ['certificateId', 'id', '_id'],
    businessFields: ['studentId', 'applicationId', 'createdAt'],
  },
  reports: {
    collections: ['reports', 'report'],
    idFields: ['reportId', 'id', '_id'],
    businessFields: ['studentId', 'applicationId', 'createdAt'],
  },
  students: {
    collections: ['students', 'student', 'profiles', 'users'],
    idFields: ['studentId', 'enrollmentNumber', 'id', '_id'],
    businessFields: ['studentName', 'name', 'email', 'enrollmentNumber'],
  },
};

module.exports = {
  ENTITY_CONFIG,
};
