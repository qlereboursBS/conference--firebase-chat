import React from 'react';

import {
  Avatar,
  Badge,
  Box,
  Flex,
  FlexProps,
  HStack,
  Spacer,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { useAuthContext } from '@/app/auth/AuthContext';

import { MessageType } from './MessageList';

interface MessageProps extends FlexProps {
  message: MessageType;
}

export const Message: React.FC<React.PropsWithChildren<MessageProps>> = ({
  message,
  ...rest
}) => {
  const { user } = useAuthContext();

  const isReversed = message.author?.uid === user?.uid;
  const messageDate = dayjs(message.createdAt);

  return (
    <Flex
      px={6}
      py={2}
      alignItems="center"
      flexDir={isReversed ? 'row-reverse' : 'row'}
      {...rest}
    >
      <Avatar
        size="xs"
        icon={<></>}
        name={message.author?.username}
        src={message.author?.avatarUrl}
      >
        {!message?.author && <Spinner size="xs" />}
      </Avatar>
      <Stack
        spacing={0}
        px={4}
        flex={1}
        alignItems={isReversed ? 'flex-end' : 'flex-start'}
      >
        <HStack pl={2} fontWeight="medium" fontSize="sm">
          <Badge size="md" variant="subtle" colorScheme="red">
            Admin
          </Badge>
          <Text color="gray.800">{message.author?.username || 'unknown'}</Text>
          <Spacer />
        </HStack>
        <Flex
          role="group"
          rounded="md"
          border="1px dashed transparent"
          px={2}
          py={1}
          alignItems="flex-start"
        >
          <Text
            whiteSpace="pre-line"
            overflow="hidden"
            color="gray.600"
            flex={1}
          >
            {message.content}
          </Text>
        </Flex>
      </Stack>
      <Box>
        <Text fontSize="xs" color="gray.400">
          {messageDate.format('MM/DD HH:mm')}
        </Text>
      </Box>
    </Flex>
  );
};
