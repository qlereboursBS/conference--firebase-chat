import React from 'react';

import { Flex, FlexProps, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';

import { MessageType } from '@/app/dashboard/PageDashboard';
import { Icon } from '@/components/Icons/Icon';

interface MessageProps extends FlexProps {
  message: MessageType;
}

export const Message: React.FC<React.PropsWithChildren<MessageProps>> = ({
  message,
  ...rest
}) => {
  const colors = {
    bg: 'brand.500',
    color: 'gray.100',
  };

  return (
    <Flex pl={6} py={2} alignItems="baseline" {...rest}>
      <Icon
        icon={FiMessageCircle}
        bg={colors.bg}
        color={colors.color}
        rounded="full"
        px={3.5}
        py={1}
        fontSize="sm"
      />
      <Stack spacing={0} px={4} flex={1}>
        <HStack pl={2} fontWeight="medium" fontSize="sm">
          <Text variant="xdim">Test</Text>
          <Text color={colors.color}>{message.author}</Text>
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
            {message?.content}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  );
};
