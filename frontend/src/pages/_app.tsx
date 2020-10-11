import { DarkMode } from '@chakra-ui/core';
import CSSReset from '@chakra-ui/core/dist/CSSReset';
import theme from '@chakra-ui/core/dist/theme';
import ThemeProvider from '@chakra-ui/core/dist/ThemeProvider';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { ReactElement } from 'react';
import NavBar from '../components/NavBar';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <DarkMode>
        <CSSReset />
        <NavBar />
        <Component {...pageProps} />
      </DarkMode>
    </ThemeProvider>
  );
}
