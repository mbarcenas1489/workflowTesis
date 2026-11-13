'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { StorageService, USER_ROLES } from '@/services/storageService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    StorageService.init();
    const user = StorageService.getCurrentUser();
    const allUsers = StorageService.getUsers();
    setCurrentUser(user);
    setAvailableUsers(allUsers);
    setIsLoaded(true);
  }, []);

  const switchRole = (newRole) => {
    const targetUser = availableUsers.find((u) => u.role === newRole);
    if (targetUser) {
      StorageService.setCurrentUser(targetUser);
      setCurrentUser(targetUser);
      triggerRefresh();
    }
  };

  const resetDemoData = () => {
    StorageService.resetDatabase();
    const user = StorageService.getCurrentUser();
    const allUsers = StorageService.getUsers();
    setCurrentUser(user);
    setAvailableUsers(allUsers);
    triggerRefresh();
  };

  const triggerRefresh = () => {
    setDataVersion((prev) => prev + 1);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || USER_ROLES.ESTUDIANTE,
        availableUsers,
        switchRole,
        resetDemoData,
        triggerRefresh,
        dataVersion,
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

