import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { DarkMode } from '@chakra-ui/core';
import CSSReset from '@chakra-ui/core/dist/CSSReset';
import theme from '@chakra-ui/core/dist/theme';
import ThemeProvider from '@chakra-ui/core/dist/ThemeProvider';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { ReactElement } from 'react';
import NavBar from '../components/NavBar';

const client = new ApolloClient({
  // TODO: Add uri to env
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <DarkMode>
          <CSSReset />
          <NavBar />
          <Component {...pageProps} />
        </DarkMode>
      </ThemeProvider>
    </ApolloProvider>
  );
}
