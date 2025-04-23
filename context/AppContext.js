import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeDatabase, getUser, createUser, getJobs, getSavedJobs, getAppliedJobs } from '../services/database';

const DB_KEYS = {
  USERS: 'users',
  JOBS: 'jobs',
  SAVED_JOBS: 'saved_jobs',
  APPLIED_JOBS: 'applied_jobs',
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeDatabase();
        const allJobs = await getJobs();
        setJobs(allJobs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const saved = await getSavedJobs(currentUser.id);
          const applied = await getAppliedJobs(currentUser.id);
          setSavedJobs(saved);
          setAppliedJobs(applied);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const login = async (email, password) => {
    try {
      const user = await getUser(email);
      if (user && user.password === password) {
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await createUser(userData);
      if (newUser) {
        setCurrentUser(newUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  };

  const saveJob = async (userId, jobId) => {
    try {
      const savedJobs = await AsyncStorage.getItem(DB_KEYS.SAVED_JOBS);
      const parsedSavedJobs = JSON.parse(savedJobs || '[]');
      
      // Check if job is already saved
      const isAlreadySaved = parsedSavedJobs.some(
        saved => saved.userId === userId && saved.jobId === jobId
      );
      
      if (!isAlreadySaved) {
        parsedSavedJobs.push({ userId, jobId });
        await AsyncStorage.setItem(DB_KEYS.SAVED_JOBS, JSON.stringify(parsedSavedJobs));
        setSavedJobs(parsedSavedJobs);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  };

  const applyForJob = async (userId, jobId) => {
    try {
      const appliedJobs = await AsyncStorage.getItem(DB_KEYS.APPLIED_JOBS);
      const parsedAppliedJobs = JSON.parse(appliedJobs || '[]');
      
      // Check if job is already applied for
      const isAlreadyApplied = parsedAppliedJobs.some(
        applied => applied.userId === userId && applied.jobId === jobId
      );
      
      if (!isAlreadyApplied) {
        parsedAppliedJobs.push({ 
          userId, 
          jobId,
          status: 'pending',
          appliedAt: new Date().toISOString()
        });
        await AsyncStorage.setItem(DB_KEYS.APPLIED_JOBS, JSON.stringify(parsedAppliedJobs));
        setAppliedJobs(parsedAppliedJobs);
      }
      
      return true;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const users = await AsyncStorage.getItem(DB_KEYS.USERS);
      const parsedUsers = JSON.parse(users);
      
      const userIndex = parsedUsers.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // If changing password
      if (userData.currentPassword && userData.newPassword) {
        if (parsedUsers[userIndex].password !== userData.currentPassword) {
          throw new Error('Current password is incorrect');
        }
        if (userData.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long');
        }
        parsedUsers[userIndex].password = userData.newPassword;
      } else {
        // Update other user data
        parsedUsers[userIndex] = {
          ...parsedUsers[userIndex],
          ...userData,
        };
      }

      await AsyncStorage.setItem(DB_KEYS.USERS, JSON.stringify(parsedUsers));
      
      // Update current user in state if it's the logged-in user
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(parsedUsers[userIndex]);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId, password) => {
    try {
      // Get all data
      const [users, savedJobs, appliedJobs] = await Promise.all([
        AsyncStorage.getItem(DB_KEYS.USERS),
        AsyncStorage.getItem(DB_KEYS.SAVED_JOBS),
        AsyncStorage.getItem(DB_KEYS.APPLIED_JOBS),
      ]);

      const parsedUsers = JSON.parse(users);
      const parsedSavedJobs = JSON.parse(savedJobs || '[]');
      const parsedAppliedJobs = JSON.parse(appliedJobs || '[]');

      // Find user and verify password
      const userIndex = parsedUsers.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      if (parsedUsers[userIndex].password !== password) {
        throw new Error('Incorrect password');
      }

      // Remove user
      const updatedUsers = parsedUsers.filter(user => user.id !== userId);
      await AsyncStorage.setItem(DB_KEYS.USERS, JSON.stringify(updatedUsers));

      // Remove user's saved jobs
      const updatedSavedJobs = parsedSavedJobs.filter(saved => saved.userId !== userId);
      await AsyncStorage.setItem(DB_KEYS.SAVED_JOBS, JSON.stringify(updatedSavedJobs));

      // Remove user's applied jobs
      const updatedAppliedJobs = parsedAppliedJobs.filter(applied => applied.userId !== userId);
      await AsyncStorage.setItem(DB_KEYS.APPLIED_JOBS, JSON.stringify(updatedAppliedJobs));

      // Clear current user if it's the deleted user
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(null);
        setSavedJobs([]);
        setAppliedJobs([]);
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      setSavedJobs([]);
      setAppliedJobs([]);
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        jobs,
        savedJobs,
        appliedJobs,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        deleteUser,
        saveJob,
        applyForJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 