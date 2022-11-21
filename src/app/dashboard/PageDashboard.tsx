import React, { useEffect, useState } from 'react';

import { Flex, Heading, Stack } from '@chakra-ui/react';
import {
  DataSnapshot,
  getDatabase,
  onChildAdded,
  push,
  ref,
  set,
} from '@firebase/database';
import { useTranslation } from 'react-i18next';

import { UserType, useAuthContext } from '@/app/auth/AuthContext';
import { Page, PageContent } from '@/app/layout';
import { MessageList, MessageType } from '@/components/Chat/MessageList';
import { WriteMessage } from '@/components/Chat/WriteMessage';

export const PageDashboard = () => {
  const { t } = useTranslation();

  const { user } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
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

  // useEffect(() => {
  //   handleNewUsers();
  // }, []);

  //
  // const handleNewUsers = () => {
  //   const usersRef = ref(getDatabase(), '/rooms/room-1/users');
  //   onChildAdded(usersRef, (snapshot) => {
  //     const newUser = snapshot.val();
  //     console.log({ newUser })
  //     setUsers((prev) => [...prev, newUser]);
  //   });
  // }

  useEffect(() => {
    setMessages([]);
    const unsubscribe = handleNewMessages();
    return () => {
      console.log('out of useEffect');
      unsubscribe();
    };
  }, []);

  const handleNewMessages = () => {
    console.log('Subscribing!');
    const messagesRef = ref(getDatabase(), '/rooms/room-1/messages');
    return onChildAdded(messagesRef, (snapshot) => {
      const newMessage = snapshot.val() as MessageType;
      console.log({ newMessage });
      setMessages((prev) => [...prev, newMessage]);
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
          {t('dashboard:title')}
        </Heading>
        <Flex shadow="md" rounded="md" flex={1} bg="white">
          <Stack spacing={0} flex={1}>
            <MessageList
              messages={messages}
              isLoading={messages?.length === 0}
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
