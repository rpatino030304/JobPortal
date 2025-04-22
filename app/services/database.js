import AsyncStorage from '@react-native-async-storage/async-storage';

// Database keys
const DB_KEYS = {
  USERS: 'users',
  JOBS: 'jobs',
  SAVED_JOBS: 'saved_jobs',
  APPLIED_JOBS: 'applied_jobs',
};

// Initialize database with sample data
const initializeDatabase = async () => {
  try {
    const users = await AsyncStorage.getItem(DB_KEYS.USERS);
    if (!users) {
      await AsyncStorage.setItem(DB_KEYS.USERS, JSON.stringify([
        {
          id: '1',
          username: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'UI/UX Designer',
          location: 'New York, USA',
          experience: '3 Years in UI/UX Design',
        }
      ]));
    }

    const jobs = await AsyncStorage.getItem(DB_KEYS.JOBS);
    if (!jobs) {
      await AsyncStorage.setItem(DB_KEYS.JOBS, JSON.stringify([
        {
          id: '1',
          title: 'UX Designer',
          company: 'Google',
          location: 'New York',
          experience: '3 years exp.',
          type: 'Fulltime',
          description: 'UX Designers are the synthesis of design and development. They take Google\'s most innovative product concepts...',
          salary: '$50K/mo',
          status: 'active',
        },
        {
          id: '2',
          title: 'Project Manager',
          company: 'Airbnb',
          location: 'Sydney',
          experience: '1-5 years exp.',
          type: 'Part-time',
          description: 'Airbnb was born in 2007 when two Hosts welcomed three guests to their San Francisco home...',
          salary: '$25K/mo',
          status: 'active',
        },
        {
          id: '3',
          title: 'Graphic Designer',
          company: 'Spotify',
          location: 'Remote',
          experience: 'Freshers',
          type: 'Fulltime',
          description: 'UX Designers are the synthesis of design and development. They take Google\'s most innovative product concepts...',
          salary: '$500K/mo',
          status: 'active',
        }
      ]));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// User operations
const getUser = async (email) => {
  try {
    const users = JSON.parse(await AsyncStorage.getItem(DB_KEYS.USERS) || '[]');
    return users.find(user => user.email === email);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

const createUser = async (userData) => {
  try {
    const users = JSON.parse(await AsyncStorage.getItem(DB_KEYS.USERS) || '[]');
    const newUser = { ...userData, id: Date.now().toString() };
    users.push(newUser);
    await AsyncStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Job operations
const getJobs = async () => {
  try {
    return JSON.parse(await AsyncStorage.getItem(DB_KEYS.JOBS) || '[]');
  } catch (error) {
    console.error('Error getting jobs:', error);
    return [];
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
const getSavedJobs = async (userId) => {
  try {
    const savedJobs = JSON.parse(await AsyncStorage.getItem(DB_KEYS.SAVED_JOBS) || '[]');
    return savedJobs.filter(job => job.userId === userId);
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    return [];
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
const getAppliedJobs = async (userId) => {
  try {
    const appliedJobs = JSON.parse(await AsyncStorage.getItem(DB_KEYS.APPLIED_JOBS) || '[]');
    return appliedJobs.filter(job => job.userId === userId);
  } catch (error) {
    console.error('Error getting applied jobs:', error);
    return [];
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