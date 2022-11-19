import React, { useCallback, useRef } from 'react';

import { Divider, Heading, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { Page, PageContent } from '@/app/layout';
import { Message } from '@/components/Message';

const NB_ELEMENTS_BY_PAGE = 10;

export type MessageType = {
  content: string;
  author: string;
};

export const PageDashboard = () => {
  const { t } = useTranslation();
  const scrollbarRef = useRef<VirtuosoHandle>(null);
  const firstItemIndex = 10;

  const messages = [
    {
      content: 'Hello world!',
      author: 'Quentin Lerebours',
    },
    {
      content: 'Hello Quentin!',
      author: 'Zhaniya',
    },
  ];

  const prependItems = useCallback(async () => {
    // // Si pas de data à charger on ne fetch pas
    // if (!hasNextPage) {
    //   return;
    // }
    //
    // const query = await fetchNextPage();
    // // On récupère le nombre d'éléments présent sur cette nouvelle page (la dernière de la query)
    // const indexDelta = query.data.pages.at(-1).content.length;
    // // On décalle l'index du nombre de nouveaux items
    // setFirstItemIndex(firstItemIndex - indexDelta);
    //
    // return false;
    console.log('prependItems');
  }, []);

  const isFetchingNextPage = false;

  const fetchNextPage = () => {
    console.log('Fetch next page');
  };

  return (
    <Page>
      <PageContent>
        <Heading size="md" mb="4">
          {t('dashboard:title')}
        </Heading>
        <Stack spacing={0} flex={3}>
          {messages && (
            <Virtuoso
              ref={scrollbarRef}
              initialTopMostItemIndex={NB_ELEMENTS_BY_PAGE}
              firstItemIndex={firstItemIndex}
              data={messages.slice().reverse()}
              startReached={prependItems}
              context={{ loadMore: fetchNextPage, loading: isFetchingNextPage }}
              style={{ height: '500px' }}
              itemContent={(i, message) => (
                <>
                  <Message message={message} />
                  <Divider />
                </>
              )}
            />
          )}
        </Stack>
      </PageContent>
    </Page>
  );
};
