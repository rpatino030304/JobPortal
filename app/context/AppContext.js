import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeDatabase, getUser, createUser, getJobs, getSavedJobs, getAppliedJobs } from '../services/database';

const AppContext = createContext();

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

  const logout = () => {
    setCurrentUser(null);
    setSavedJobs([]);
    setAppliedJobs([]);
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