/**
 * Run this script once to create the admin user:
 *   node seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Job = require('./models/Job');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create admin
  const existingAdmin = await User.findOne({ email: 'admin@careerbridge.com' });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin',
      email: 'admin@careerbridge.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created: admin@careerbridge.com / admin123');
  } else {
    console.log('Admin already exists');
  }

  // Seed sample jobs
  const jobCount = await Job.countDocuments();
  if (jobCount === 0) {
    await Job.insertMany([
      {
        title: 'Frontend Developer',
        companyName: 'TechNova Inc.',
        description: 'Build responsive web applications using React and modern CSS. Collaborate with the design team to deliver polished UIs.',
        location: 'Bangalore, India',
        type: 'Job',
        salary: '₹6 - 10 LPA',
        requirements: ['React.js', 'CSS3', 'JavaScript', 'REST APIs']
      },
      {
        title: 'Backend Developer Intern',
        companyName: 'CloudSoft Solutions',
        description: 'Work with our Node.js backend team. Learn Express, MongoDB and real-world API development.',
        location: 'Remote',
        type: 'Internship',
        salary: '₹15,000/month',
        requirements: ['Node.js', 'Express', 'MongoDB', 'REST APIs']
      },
      {
        title: 'Full Stack Developer',
        companyName: 'StartupHub',
        description: 'Join our growing startup as a full-stack developer. Work on exciting products from scratch.',
        location: 'Mumbai, India',
        type: 'Job',
        salary: '₹8 - 14 LPA',
        requirements: ['React', 'Node.js', 'MongoDB', 'Docker']
      },
      {
        title: 'UI/UX Design Intern',
        companyName: 'DesignFlow Studios',
        description: 'Create wireframes, prototypes and design systems for web and mobile applications.',
        location: 'Hyderabad, India',
        type: 'Internship',
        salary: '₹12,000/month',
        requirements: ['Figma', 'Adobe XD', 'Prototyping', 'CSS']
      },
      {
        title: 'Data Analyst',
        companyName: 'DataVision Analytics',
        description: 'Analyze large datasets and provide actionable business insights using Python and visualization tools.',
        location: 'Pune, India',
        type: 'Job',
        salary: '₹5 - 8 LPA',
        requirements: ['Python', 'SQL', 'Power BI', 'Excel']
      },
      {
        title: 'DevOps Engineer Intern',
        companyName: 'InfraStack Technologies',
        description: 'Assist in CI/CD pipelines, Docker and Kubernetes deployments as part of the DevOps team.',
        location: 'Remote',
        type: 'Internship',
        salary: '₹18,000/month',
        requirements: ['Docker', 'Linux', 'GitHub Actions', 'AWS Basics']
      }
    ]);
    console.log('Sample jobs created');
  } else {
    console.log('Jobs already exist, skipping seed');
  }

  mongoose.disconnect();
  console.log('Seeding complete!');
};

seedData().catch(console.error);
