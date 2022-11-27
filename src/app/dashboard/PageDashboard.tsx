import React, { useEffect, useState } from 'react';

import { Flex, Heading, Stack } from '@chakra-ui/react';

import { UserType, useAuthContext } from '@/app/auth/AuthContext';
import { Page, PageContent } from '@/app/layout';
import { ChatUsers } from '@/components/Chat/ChatUsers';
import { MessageList, MessageType } from '@/components/Chat/MessageList';
import { WriteMessage } from '@/components/Chat/WriteMessage';

export type ChatMessages = { [key: string]: MessageType };

export const PageDashboard = () => {
  const { user } = useAuthContext();

  const messages: MessageType[] = [
    {
      content: 'Hello world!',
      author: {
        username: 'Quentin Lerebours',
        uid: '0',
        email: 'a',
      },
      createdAt: 1,
    },
    {
      content: 'Hello Quentin!',
      author: {
        username: 'Zhaniya',
        uid: '1',
        email: 'a',
      },
      createdAt: 2,
    },
  ];

  return (
    <Page>
      <PageContent>
        <Heading size="lg" mb="4">
          #room-1
        </Heading>
        <Flex shadow="md" rounded="md" flex={1} bg="white">
          <Stack spacing={0} flex={1}>
            {/* <ChatUsers users={users} /> */}
            {/* TODO */}

            <MessageList
              messages={Object.values(messages)}
              isLoading={Object.keys(messages)?.length === 0}
            />

            <WriteMessage
              user={user}
              isSubmitting={false} // TODO
              sendMessage={async () => true} // TODO
            />
          </Stack>
        </Flex>
      </PageContent>
    </Page>
  );
};
