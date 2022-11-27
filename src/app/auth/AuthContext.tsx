import React, { FC, useCallback, useContext, useEffect, useState } from 'react';

import { isBrowser } from '@/utils/ssr';

export type UserType = {
  email: string;
  uid: string;
  username: string;
  avatarUrl?: string;
  isAdmin?: boolean;
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
  // onAuthStateChanged(getAuth(), (user) => {
  //   if (user) {
  //     console.log('userId', user.uid);
  //   } else {
  //     console.info('No user logged in');
  //   }
  // });

  // TODO uncomment me to get a token
  // useEffect(() => {
  //   getAuth()?.currentUser?.getIdToken(true).then(function(idToken) {
  //     console.log('token:', idToken)
  //   }).catch(function(error) {
  //     console.error('Error while getting token', error);
  //   });
  // }, []);

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
        isAuthenticated: !!Object.keys(user || {}).length,
        updateUser: handleUpdateUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
