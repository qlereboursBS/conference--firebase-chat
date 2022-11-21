import React, { FC, useCallback, useContext, useState } from 'react';

import { isBrowser } from '@/utils/ssr';

export type UserType = {
  email: string;
  uid: string;
  username: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  updateUser(user?: UserType | null): void;
  user: UserType | null;
};

export const AUTH_USER_KEY = 'currentUser';

const AuthContext = React.createContext<AuthContextValue>(null as TODO);

const updateToken = (user?: UserType | null) => {
  if (!isBrowser) {
    return () => undefined;
  }

  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
  } else {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const getUser = (): UserType | null => {
    if (isBrowser) {
      return JSON.parse(
        localStorage.getItem(AUTH_USER_KEY) || '{}'
      ) as UserType;
    }
    return null;
  };

  const [user, setUser] = useState<UserType | null>(getUser());

  const handleUpdateUser = useCallback(
    (newUser: UserType) => {
      setUser(newUser);
      updateToken(newUser);
    },
    [setUser]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        updateUser: handleUpdateUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
