import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import CSSReset from '@chakra-ui/core/dist/CSSReset';
import theme from '@chakra-ui/core/dist/theme';
import ThemeProvider from '@chakra-ui/core/dist/ThemeProvider';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { ReactElement } from 'react';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
