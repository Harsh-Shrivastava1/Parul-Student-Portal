const Student = require('../models/Student');
const Cell = require('../models/Cell');
const bcrypt = require('bcryptjs');
const Internship = require('../models/Internship');
const Notification = require('../models/Notification');

// ─── Seed Data ─────────────────────────────────────────────────────────────

const cellsData = [
  {
    cellId: 'CELL001',
    cellName: 'Internship Cell',
    department: 'Internship Cell',
    coordinatorName: 'M.J.Rathod',
    coordinatorEmail: 'mohitkumar.rathod20807@paruluniversity.ac.in',
    loginId: 'mjrathod',
    loginPassword: 'mjr@intern01',
  },
  {
    cellId: 'CELL002',
    cellName: 'TEC Cell',
    department: 'TEC Cell',
    coordinatorName: 'OMKAMAL VASHI',
    coordinatorEmail: 'omkamal.vashi@paruluniversity.ac.in',
    loginId: 'omkamal',
    loginPassword: 'om@tec02',
  },
];

const studentsData = [
  {
    studentId: 'ST001',
    studentName: 'Ankush Sharma',
    enrollmentNumber: '2216331000008',
    department: 'Internship Cell',
    semester: 6,
    email: '2216331000008@paruluniversity.ac.in',
    contactNumber: '7058330296',
  },
  {
    studentId: 'ST002',
    studentName: 'Bhavyansh Parihar',
    enrollmentNumber: '2503031260055',
    department: 'Internship Cell',
    semester: 3,
    email: '2503031260055@paruluniversity.ac.in',
    contactNumber: '7383768758',
  },
  {
    studentId: 'ST003',
    studentName: 'Alankrati Sharma',
    enrollmentNumber: '2403051240028',
    department: 'Internship Cell',
    semester: 5,
    email: '2403051240028@paruluniversity.ac.in',
    contactNumber: '8010933428',
  },
  {
    studentId: 'ST004',
    studentName: 'Darpan Arora',
    enrollmentNumber: '2406142000320',
    department: 'TEC Cell',
    semester: 4,
    email: '2406142000320@paruluniversity.ac.in',
    contactNumber: '7742682528',
  },
  {
    studentId: 'ST005',
    studentName: 'Ashwin Pandey',
    enrollmentNumber: '2303051240036',
    department: 'TEC Cell',
    semester: 7,
    email: '2303051240036@paruluniversity.ac.in',
    contactNumber: '6267307426',
  },
  {
    studentId: 'ST006',
    studentName: 'Bhumi Mishra',
    enrollmentNumber: '2303051050177',
    department: 'TEC Cell',
    semester: 7,
    email: '2303051050177@paruluniversity.ac.in',
    contactNumber: '9960096413',
  },
  {
    studentId: 'ST007',
    studentName: 'Test Student',
    enrollmentNumber: '2403051570042',
    department: 'Computer Science',
    semester: 5,
    email: '2403051570042@paruluniversity.ac.in',
    contactNumber: '9999999999',
  },
];

const internshipsData = [
  {
    internshipId: 'INT001',
    internshipTitle: 'Operation Executive',
    companyDepartment: 'TEC Cell',
    duration: '6 Months',
    mentorName: 'OMKAMAL VASHI',
  },
  {
    internshipId: 'INT002',
    internshipTitle: 'Operation Executive',
    companyDepartment: 'Internship Cell',
    duration: '6 Months',
    mentorName: 'M.J.Rathod',
  },
];

const now = new Date();
const notificationsData = [
  {
    userId: 'demo',
    title: '🎉 Welcome to the Internship Portal',
    message: 'Welcome to the Parul University Internship Portal. Explore available internships and apply today.',
    date: new Date(now - 1000 * 60 * 60 * 2),
    read: false,
    type: 'info',
    link: '/internships',
  },
  {
    userId: 'demo',
    title: '📋 New Internship Posted',
    message: 'A new "Operation Executive" internship has been posted by TEC Cell. Only limited seats available — apply now!',
    date: new Date(now - 1000 * 60 * 60 * 5),
    read: false,
    type: 'info',
    link: '/internships',
  },
  {
    userId: 'demo',
    title: '📢 Portal Update',
    message: 'The Parul University Internship Portal is now live with real-time data. All applications are now tracked in MongoDB.',
    date: new Date(now - 1000 * 60 * 60 * 24),
    read: true,
    type: 'success',
    link: '/',
  },
  {
    userId: 'demo',
    title: '⏰ Application Deadline Reminder',
    message: 'Make sure to complete your internship application before the deadline. Incomplete applications will not be considered.',
    date: new Date(now - 1000 * 60 * 60 * 48),
    read: true,
    type: 'warning',
    link: '/internships',
  },
  {
    userId: 'demo',
    title: '📞 Contact Your Cell Coordinator',
    message: 'For any internship-related queries, contact your respective Cell Coordinator directly through the portal.',
    date: new Date(now - 1000 * 60 * 60 * 72),
    read: true,
    type: 'info',
    link: '/',
  },
];

// ─── Seed Runner ────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    // Cells
    const cellCount = await Cell.countDocuments();
    if (cellCount === 0) {
      await Cell.insertMany(cellsData);
      console.log(`🌱  Seeded ${cellsData.length} cells`);
    } else {
      console.log(`⏭️   Cells already seeded (${cellCount} found)`);
    }

    // Students
    const studentCount = await Student.countDocuments();
    const hashedPassword = await bcrypt.hash('password123', 10);
    const studentsWithPasswords = studentsData.map(s => ({ ...s, password: hashedPassword }));

    if (studentCount === 0) {
      await Student.insertMany(studentsWithPasswords);
      console.log(`🌱  Seeded ${studentsWithPasswords.length} students with default passwords`);
    } else {
      console.log(`⏭️   Students already seeded (${studentCount} found). Upserting and updating passwords...`);
      for (const student of studentsWithPasswords) {
        await Student.updateOne(
          { enrollmentNumber: student.enrollmentNumber },
          { $set: student },
          { upsert: true }
        );
      }
      console.log(`✅  Updated all students with default passwords`);
    }

    // Internships
    const internshipCount = await Internship.countDocuments();
    if (internshipCount === 0) {
      await Internship.insertMany(internshipsData);
      console.log(`🌱  Seeded ${internshipsData.length} internships`);
    } else {
      console.log(`⏭️   Internships already seeded (${internshipCount} found)`);
    }

    // Notifications
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      try {
        await Notification.collection.dropIndex('id_1');
      } catch (e) {
        // ignore
      }
      await Notification.insertMany(notificationsData);
      console.log(`🌱  Seeded ${notificationsData.length} notifications`);
    } else {
      console.log(`⏭️   Notifications already seeded (${notifCount} found)`);
    }

    console.log('✅  Database seed complete');
  } catch (error) {
    console.error('❌  Seed failed:', error.message);
  }
};

module.exports = seedDatabase;
