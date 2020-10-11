import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { createWithApollo } from './createWithApollo';

const createClient = (ctx: NextPageContext) => new ApolloClient({
  // TODO: Add uri to env
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  defaultOptions: {
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  headers: {
    cookie:
        (typeof window === 'undefined'
          ? ctx?.req?.headers.cookie
          : undefined) || '',
  },
  cache: new InMemoryCache(),
});

export const withApollo = createWithApollo(createClient);
