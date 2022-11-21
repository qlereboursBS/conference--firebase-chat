import React, { useState } from 'react';

import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import { UserType } from '@/app/auth/AuthContext';

export const WriteMessage: React.FC<WriteMessageProps> = ({
  sendMessage,
  isSubmitting,
  user,
}) => {
  const [message, setMessage] = useState('');

  const handleKeyPress = async (event: any) => {
    if (event.code === 'Enter' && !event.shiftKey) {
      // On empêche le saut de ligne dans le cas d'un
      // appui sur la touche entrée sans shift
      event.preventDefault();

      const isSuccessful = await sendMessage(message);
      if (isSuccessful) {
        setMessage('');
      }
    }
  };

  const color = 'gray.800';

  return (
    <Flex pl={2} py={2} alignItems="baseline">
      <Stack spacing={0} px={4} flex={1}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 0, md: 2 }}
          fontWeight="medium"
          fontSize="sm"
        >
          <Box>
            <Avatar
              size="xs"
              icon={<></>}
              name={user?.username}
              src={user?.avatarUrl}
            >
              {!user && <Spinner size="xs" />}
            </Avatar>
          </Box>
          <Text color={color}>{user?.username}</Text>
          <Spacer />
          <IconButton
            color="gray.400"
            aria-label="Delete message"
            variant="@ghost"
            icon={<FiTrash2 />}
            onClick={() => setMessage('')}
          />
        </Stack>

        <Stack alignItems="flex-end" spacing={0} pr={3}>
          <Flex position="relative" w="full">
            <Textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              placeholder="Enter a message"
              resize="none"
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <Tooltip
              p={2}
              variant="@primary"
              placement="top-end"
              rounded="md"
              label={
                <Stack alignItems="center">
                  <Text>Send message</Text>
                  <Text color="gray.400">
                    Or Press{' '}
                    <Text
                      as="span"
                      color="white"
                      bg="brand.800"
                      rounded="md"
                      px={2}
                      py={1}
                    >
                      Enter
                    </Text>
                  </Text>
                </Stack>
              }
            >
              <IconButton
                isLoading={isSubmitting}
                size="xs"
                variant="@primary"
                aria-label="Ajouter"
                icon={<FiPlus />}
                onClick={handleKeyPress}
                position="absolute"
                right={2}
                top={12}
                zIndex={2}
              />
            </Tooltip>
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  );
};

type WriteMessageProps = {
  sendMessage: (message: string) => Promise<boolean>;
  isSubmitting: boolean;
  user?: UserType | null;
};
