import AsyncStorage from '@react-native-async-storage/async-storage';

// Database keys
const DB_KEYS = {
  USERS: 'users',
  JOBS: 'jobs',
  SAVED_JOBS: 'saved_jobs',
  APPLIED_JOBS: 'applied_jobs',
};

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    // Check if database is already initialized
    const users = await AsyncStorage.getItem(DB_KEYS.USERS);
    if (users) return;

    // Initialize with default data
    const initialUsers = [
      {
        id: '1',
        username: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'UI/UX Designer',
        location: 'New York, USA',
        experience: '3 Years in UI/UX Design',
        profilePicture: null,
      },
      {
        id: '2',
        username: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        location: 'System',
        experience: 'System Administrator',
        profilePicture: null,
      }
    ];

    const initialJobs = [
      {
        id: '1',
        title: 'Senior UI/UX Designer',
        company: 'TechCorp',
        location: 'New York, USA',
        salary: '$90,000 - $120,000',
        type: 'Full-time',
        experience: '5+ years',
        description: 'We are looking for an experienced UI/UX Designer...',
        postedAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: 'WebSolutions',
        location: 'San Francisco, USA',
        salary: '$80,000 - $100,000',
        type: 'Full-time',
        experience: '3+ years',
        description: 'Join our team as a Frontend Developer...',
        postedAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    await Promise.all([
      AsyncStorage.setItem(DB_KEYS.USERS, JSON.stringify(initialUsers)),
      AsyncStorage.setItem(DB_KEYS.JOBS, JSON.stringify(initialJobs)),
      AsyncStorage.setItem(DB_KEYS.SAVED_JOBS, JSON.stringify([])),
      AsyncStorage.setItem(DB_KEYS.APPLIED_JOBS, JSON.stringify([]))
    ]);

    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// User operations
export const getUser = async (email) => {
  try {
    const users = await AsyncStorage.getItem(DB_KEYS.USERS);
    const parsedUsers = JSON.parse(users || '[]');
    return parsedUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const users = await AsyncStorage.getItem(DB_KEYS.USERS);
    const parsedUsers = JSON.parse(users || '[]');
    
    // Check if user already exists
    if (parsedUsers.some(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('User already exists');
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      profilePicture: null,
    };

    parsedUsers.push(newUser);
    await AsyncStorage.setItem(DB_KEYS.USERS, JSON.stringify(parsedUsers));
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Job operations
export const getJobs = async () => {
  try {
    const jobs = await AsyncStorage.getItem(DB_KEYS.JOBS);
    return JSON.parse(jobs || '[]');
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

const getJobById = async (id) => {
  try {
    const jobs = await getJobs();
    return jobs.find(job => job.id === id);
  } catch (error) {
    console.error('Error getting job by id:', error);
    return null;
  }
};

// Saved jobs operations
export const getSavedJobs = async (userId) => {
  try {
    const savedJobs = await AsyncStorage.getItem(DB_KEYS.SAVED_JOBS);
    const parsedSavedJobs = JSON.parse(savedJobs || '[]');
    return parsedSavedJobs.filter(saved => saved.userId === userId);
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    throw error;
  }
};

const saveJob = async (userId, jobId) => {
  try {
    const savedJobs = JSON.parse(await AsyncStorage.getItem(DB_KEYS.SAVED_JOBS) || '[]');
    if (!savedJobs.find(job => job.userId === userId && job.jobId === jobId)) {
      savedJobs.push({ userId, jobId });
      await AsyncStorage.setItem(DB_KEYS.SAVED_JOBS, JSON.stringify(savedJobs));
    }
  } catch (error) {
    console.error('Error saving job:', error);
  }
};

// Applied jobs operations
export const getAppliedJobs = async (userId) => {
  try {
    const appliedJobs = await AsyncStorage.getItem(DB_KEYS.APPLIED_JOBS);
    const parsedAppliedJobs = JSON.parse(appliedJobs || '[]');
    return parsedAppliedJobs.filter(applied => applied.userId === userId);
  } catch (error) {
    console.error('Error getting applied jobs:', error);
    throw error;
  }
};

const applyForJob = async (userId, jobId) => {
  try {
    const appliedJobs = JSON.parse(await AsyncStorage.getItem(DB_KEYS.APPLIED_JOBS) || '[]');
    if (!appliedJobs.find(job => job.userId === userId && job.jobId === jobId)) {
      appliedJobs.push({ userId, jobId, status: 'pending', appliedAt: new Date().toISOString() });
      await AsyncStorage.setItem(DB_KEYS.APPLIED_JOBS, JSON.stringify(appliedJobs));
    }
  } catch (error) {
    console.error('Error applying for job:', error);
  }
};

export {
  initializeDatabase,
  getUser,
  createUser,
  getJobs,
  getJobById,
  getSavedJobs,
  saveJob,
  getAppliedJobs,
  applyForJob,
}; 