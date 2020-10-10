import {
  Avatar, Box, Menu, MenuButton, MenuItem, MenuList, Text,
} from '@chakra-ui/core';
import React, { ReactElement } from 'react';
import NextLink from 'next/link';
import { gql, useApolloClient } from '@apollo/client';
import { useMeQuery, useSignOutMutation } from '../generated/graphql';

const NotSignedIn = () => (
  <>
    <NextLink href="/register">
      <MenuItem>Register</MenuItem>
    </NextLink>
    <NextLink href="/sign-in">
      <MenuItem>Sign In</MenuItem>
    </NextLink>
  </>
);

const SignedIn = () => {
  const [signOut] = useSignOutMutation({
    update: (cache) => {
      cache.writeQuery({
        query: gql`
      query Me{
        me{
          id
          username
        }
      }
      `,
        data: null,
      });
    },
  });
  const apolloClient = useApolloClient();
  return (
    <MenuItem onClick={async () => {
      await signOut();
      await apolloClient.resetStore();
    }}
    >
      Sign Out
    </MenuItem>
  );
};

export default function NavBar(): ReactElement {
  const { data } = useMeQuery({ errorPolicy: 'all' });

  let dropDownContent = <NotSignedIn />;

  if (data?.me) {
    dropDownContent = <SignedIn />;
  }

  return (
    <Box
      w="100%"
      bg="gray.900"
      pt="3px"
      pb="3px"
      pl="30px"
      pr="30px"
      h="44px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <NextLink
        href="/"
      >
        <Text
          fontWeight="500"
          textDecoration="none"
          as="button"
          cursor="pointer"
          color="red.400"
        >
          Reddit Clone
        </Text>
      </NextLink>
      <Menu>
        <Avatar as={MenuButton} size="sm" name={data?.me.username} />
        <MenuList>
          {dropDownContent}
        </MenuList>
      </Menu>
    </Box>
  );
}
