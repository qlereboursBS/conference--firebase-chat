import React from 'react';

import { Avatar, HStack, Spinner, Text } from '@chakra-ui/react';

import { UserType } from '@/app/auth/AuthContext';

export const ChatUsers: React.FC<ChatUsersProps> = ({ users }) => {
  return (
    <HStack bg="gray.50" alignItems="center" py={2} px={3}>
      <Text fontWeight="bold">Participants:</Text>
      {users.map((user) => (
        <Avatar
          size="xs"
          icon={<></>}
          name={user.username}
          src={user.avatarUrl}
          title={user.username}
        >
          {!user && <Spinner size="xs" />}
        </Avatar>
      ))}
    </HStack>
  );
};

type ChatUsersProps = {
  users: UserType[];
};
