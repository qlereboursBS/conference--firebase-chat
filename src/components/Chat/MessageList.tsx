import React, { useRef } from 'react';

import { Center, Divider, Text } from '@chakra-ui/react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { UserType } from '@/app/auth/AuthContext';
import { Loader } from '@/app/layout';
import { Message } from '@/components/Chat/Message';

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
}) => {
  const scrollbarRef = useRef<VirtuosoHandle>(null);
  const firstItemIndex = 10;
  const NB_ELEMENTS_BY_PAGE = 10;

  if (isLoading) {
    return (
      <Center flex={1} mx={4}>
        <Text color="brand.600">
          <Loader />
          Waiting for new messages...
        </Text>
      </Center>
    );
  }

  return (
    <Virtuoso
      ref={scrollbarRef}
      initialTopMostItemIndex={NB_ELEMENTS_BY_PAGE}
      firstItemIndex={firstItemIndex}
      data={messages}
      alignToBottom
      itemContent={(i, message) => (
        <>
          <Message message={message} bg={i % 2 === 0 ? 'gray.50' : 'white'} />
          <Divider />
        </>
      )}
    />
  );
};

type MessageListProps = {
  messages: MessageType[];
  isLoading: boolean;
};

export type MessageType = {
  content: string;
  author: UserType;
  createdAt: number;
};
