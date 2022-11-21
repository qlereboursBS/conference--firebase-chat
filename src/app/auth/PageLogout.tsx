import React, { useEffect } from 'react';

import { Center, Spinner } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '@/app/auth/AuthContext';

export const PageLogout = () => {
  const { updateUser } = useAuthContext();
  const navigate = useNavigate();
  const queryCache = useQueryClient();

  useEffect(() => {
    updateUser(null);
    queryCache.clear();
    navigate('/');
  }, [updateUser, queryCache, navigate]);

  return (
    <Center flex="1">
      <Spinner />
    </Center>
  );
};
