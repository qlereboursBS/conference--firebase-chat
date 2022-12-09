import React, { useEffect, useState } from 'react';

import { Flex, Heading, Stack } from '@chakra-ui/react';
import {
  getDatabase,
  onChildAdded,
  onChildChanged,
  push,
  ref,
  set,
} from 'firebase/database';

import { UserType, useAuthContext } from '@/app/auth/AuthContext';
import { Page, PageContent } from '@/app/layout';
import { ChatUsers } from '@/components/Chat/ChatUsers';
import { MessageList, MessageType } from '@/components/Chat/MessageList';
import { WriteMessage } from '@/components/Chat/WriteMessage';

export type ChatMessages = { [key: string]: MessageType };

export const PageDashboard = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<ChatMessages>({});
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    console.log('joining room');
    joinRoom();
  }, [user]);

  const joinRoom = () => {
    if (!user) {
      return;
    }
    const userRoomRef = ref(getDatabase(), `/rooms/room-1/users/${user.uid}`);
    set(userRoomRef, user);
  };

  const handleSendMessage = async (message: string) => {
    try {
      const messagesRef = ref(getDatabase(), `/rooms/room-1/messages`);
      const messageObject = {
        content: message,
        author: user,
        createdAt: +new Date(),
      };
      await push(messagesRef, messageObject);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  useEffect(() => {
    console.log('Will handle new messages s');
    setMessages({});
    const unsubscribe = handleNewMessages();
    return () => {
      unsubscribe();
    };
  }, []);

  const handleNewMessages = () => {
    const messagesRef = ref(getDatabase(), `/rooms/room-1/messages`);
    return onChildAdded(
      messagesRef,
      (messageSnap) =>
        handleMessage(messageSnap.val() as MessageType, messageSnap.key || ''),
      (error) => {
        console.error(error);
      }
    );
  };

  const handleMessage = (message: MessageType, messageKey: string) => {
    console.log({ message });
    setMessages((prev) => ({
      ...prev,
      [messageKey]: message,
    }));
  };

  useEffect(() => {
    setUsers([]);
    const unsubscribe = handleNewUsers();
    return () => {
      // this code will be called when the component unmounts
      unsubscribe();
    };
  }, []);

  const handleNewUsers = () => {
    console.log('handling new user');
    const usersRef = ref(getDatabase(), `/rooms/room-1/users`);
    return onChildAdded(
      usersRef,
      (userSnap) => setUsers((prev) => [...prev, userSnap.val()]),
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <Page>
      <PageContent>
        <Heading size="lg" mb="4">
          #room-1
        </Heading>
        <Flex shadow="md" rounded="md" flex={1} bg="white">
          <Stack spacing={0} flex={1}>
            <ChatUsers users={users} />

            <MessageList
              messages={Object.values(messages)}
              isLoading={Object.keys(messages)?.length === 0}
            />

            <WriteMessage
              user={user}
              isSubmitting={false} // TODO
              sendMessage={handleSendMessage} // TODO
            />
          </Stack>
        </Flex>
      </PageContent>
    </Page>
  );
};
