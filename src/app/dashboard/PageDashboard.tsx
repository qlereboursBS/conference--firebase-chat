import React, { useEffect, useState } from 'react';

import { Flex, Heading, Stack } from '@chakra-ui/react';
import { getAuth } from '@firebase/auth';
import {
  DataSnapshot,
  getDatabase,
  onChildAdded,
  onChildChanged,
  push,
  ref,
  set,
} from '@firebase/database';

import { UserType, useAuthContext } from '@/app/auth/AuthContext';
import { Page, PageContent } from '@/app/layout';
import { ChatUsers } from '@/components/Chat/ChatUsers';
import { MessageList, MessageType } from '@/components/Chat/MessageList';
import { WriteMessage } from '@/components/Chat/WriteMessage';

export type ChatMessages = { [key: string]: MessageType };

export const PageDashboard = () => {
  const { user } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<ChatMessages>({});
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    if (user) {
      joinRoom(user);
    }
  }, [user]);

  const joinRoom = async (user: UserType) => {
    try {
      const roomRef = ref(getDatabase(), `/rooms/room-1/users/${user.uid}`);
      await set(roomRef, user);
      console.log('Joined room successfully');
    } catch (e) {
      console.error('An error occurred while joining room');
    }
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    if (!user) {
      console.error('User was empty when sending message');
      return false;
    }

    setIsSubmitting(true);

    try {
      const messagesRef = ref(getDatabase(), `/rooms/room-1/messages`);
      const messageToCreate: MessageType = {
        content: message,
        author: user,
        createdAt: +new Date(),
      };
      await push(messagesRef, messageToCreate);
      console.log('Sent message successfully');
      return true;
    } catch (e) {
      console.error('An error occurred while sending message room');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setUsers([]);
    const unsubscribe = handleNewUsers();
    return () => unsubscribe();
  }, []);

  const handleNewUsers = () => {
    const usersRef = ref(getDatabase(), '/rooms/room-1/users');
    return onChildAdded(usersRef, (snapshot) => {
      const newUser = snapshot.val();
      console.log({ newUser });
      setUsers((prev) => [...prev, newUser]);
    });
  };

  useEffect(() => {
    setMessages({});
    const unsubscribe = handleNewMessages();
    const unsubscribeUpdate = handleMessageUpdated();
    return () => {
      console.log('out of useEffect');
      unsubscribe();
      unsubscribeUpdate();
    };
  }, []);

  const handleNewMessages = () => {
    console.log('Subscribing to new messages!');
    const messagesRef = ref(getDatabase(), '/rooms/room-1/messages');
    return onChildAdded(
      messagesRef,
      (snapshot) => {
        handleMessage(snapshot.val() as MessageType, snapshot.key || '');
      },
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

  const handleMessageUpdated = () => {
    console.log('Subscribing to message updates!');
    const messagesRef = ref(getDatabase(), '/rooms/room-1/messages');
    return onChildChanged(messagesRef, (snapshot) => {
      console.log('Message updated', snapshot.val(), snapshot.key);
      handleMessage(snapshot.val() as MessageType, snapshot.key || '');
    });
  };

  // const messages: MessageType[] = [
  //   {
  //     content: 'Hello world!',
  //     author: {
  //       username: 'Quentin Lerebours',
  //       uid: '0',
  //       email: 'a',
  //     },
  //   },
  //   {
  //     content: 'Hello Quentin!',
  //     author: {
  //       username: 'Zhaniya',
  //       uid: '1',
  //       email: 'a',
  //     },
  //   },
  // ];

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
              isSubmitting={isSubmitting}
              sendMessage={handleSendMessage}
            />
          </Stack>
        </Flex>
      </PageContent>
    </Page>
  );
};
