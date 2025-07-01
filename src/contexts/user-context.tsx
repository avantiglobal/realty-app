"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { User } from '@/lib/types';
import { users } from '@/lib/data';

type UserContextType = {
  user: User;
  switchRole: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(users[0]); // Default to Admin

  const switchRole = () => {
    setCurrentUser(prevUser => (prevUser.role === 'Admin' ? users[1] : users[0]));
  };

  const value = useMemo(() => ({ user: currentUser, switchRole }), [currentUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
