import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeDatabase, getUser, createUser, getJobs, getSavedJobs, getAppliedJobs } from '../services/database';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true);
        await initializeDatabase();
        const allJobs = await getJobs();
        setJobs(allJobs);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Load user data when currentUser changes
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const [saved, applied] = await Promise.all([
            getSavedJobs(currentUser.id),
            getAppliedJobs(currentUser.id)
          ]);
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
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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
      console.error('Registration error:', error);
      throw error;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = JSON.parse(users || '[]');
      
      const userIndex = parsedUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // If changing password
      if (updates.currentPassword && updates.newPassword) {
        if (parsedUsers[userIndex].password !== updates.currentPassword) {
          throw new Error('Current password is incorrect');
        }
        parsedUsers[userIndex].password = updates.newPassword;
      } else {
        // Update other user data
        parsedUsers[userIndex] = {
          ...parsedUsers[userIndex],
          ...updates,
        };
      }

      await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));
      
      if (currentUser?.id === userId) {
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
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = JSON.parse(users || '[]');
      
      const user = parsedUsers.find(u => u.id === userId);
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }

      const updatedUsers = parsedUsers.filter(u => u.id !== userId);
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

      if (currentUser?.id === userId) {
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

  const logout = () => {
    setCurrentUser(null);
    setSavedJobs([]);
    setAppliedJobs([]);
  };

  const saveJob = async (userId, jobId) => {
    try {
      const savedJobs = await AsyncStorage.getItem('saved_jobs');
      const parsedSavedJobs = JSON.parse(savedJobs || '[]');
      
      if (parsedSavedJobs.some(job => job.userId === userId && job.jobId === jobId)) {
        return false;
      }

      parsedSavedJobs.push({ userId, jobId });
      await AsyncStorage.setItem('saved_jobs', JSON.stringify(parsedSavedJobs));
      setSavedJobs(parsedSavedJobs);
      return true;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  };

  const applyForJob = async (userId, jobId) => {
    try {
      const appliedJobs = await AsyncStorage.getItem('applied_jobs');
      const parsedAppliedJobs = JSON.parse(appliedJobs || '[]');
      
      if (parsedAppliedJobs.some(job => job.userId === userId && job.jobId === jobId)) {
        return false;
      }

      parsedAppliedJobs.push({ 
        userId, 
        jobId, 
        status: 'pending',
        appliedAt: new Date().toISOString()
      });
      
      await AsyncStorage.setItem('applied_jobs', JSON.stringify(parsedAppliedJobs));
      setAppliedJobs(parsedAppliedJobs);
      return true;
    } catch (error) {
      console.error('Error applying for job:', error);
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
        updateUser,
        deleteUser,
        logout,
        saveJob,
        applyForJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext; 