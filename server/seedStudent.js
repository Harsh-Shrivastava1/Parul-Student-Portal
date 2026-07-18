require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

async function seedStudent() {
  await connectDB();

  const passwordHash = await bcrypt.hash('Harsh@5491', 10);

  const studentData = {
    studentId: '2403051570042',
    studentName: 'Harsh Shrivastava',
    enrollmentNumber: '2403051570042',
    email: '2403051570042@paruluniversity.ac.in',
    contactNumber: '9876543210',
    department: 'Computer Science & Engineering',
    semester: 5,
    cgpa: 8.72,
    spi: 8.72,
    gender: 'Male',
    dateOfBirth: '23 March 2007',
    category: 'General',
    fatherName: 'ABCD',
    motherName: 'EFGH',
    presentAddress: 'Raipur, Chhattisgarh',
    permanentAddress: 'Raipur, Chhattisgarh',
    institute: 'Parul University',
    skills: ['Java', 'Python', 'React', 'Node.js', 'MongoDB', 'SAP'],
    languages: ['English', 'Hindi'],
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    // Use the raw MongoDB collection to bypass Mongoose schema email validation
    const collection = mongoose.connection.collection('students');

    // Delete any existing records for this student (old or new enrollment/email)
    const deleteResult = await collection.deleteMany({
      $or: [
        { enrollmentNumber: '2403051570042' },
        { enrollmentNumber: '2403031570042' },
        { studentId: '2403051570042' },
        { studentId: '2403031570042' },
        { email: 'hshrivastava23032007@gmail.com' },
        { email: '2403051570042@paruluniversity.ac.in' },
      ]
    });
    console.log('Deleted old records:', deleteResult.deletedCount);

    // Insert fresh record directly
    const insertResult = await collection.insertOne(studentData);
    console.log('Student inserted, _id:', insertResult.insertedId);

    // Verify
    const verify = await collection.findOne({ enrollmentNumber: '2403051570042' });
    console.log('Verified in DB:', !!verify, '|', verify?.studentName, '|', verify?.enrollmentNumber);
  } catch (error) {
    console.error('Error seeding student:', error.message);
  } finally {
    process.exit(0);
  }
}

seedStudent();
