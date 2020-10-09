import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Divider,
  Stack,
  Text,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { object, string } from 'yup';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useSignInMutation } from '../generated/graphql';

interface InputTypes {
username: string
password: string
}

const initialValues: InputTypes = {
  username: '',
  password: '',
};

const validationSchema = object().shape({
  username: string().required().min(3).label('Username'),
  password: string().required().min(8).label('Password'),
});

export default function SignIn(): ReactElement {
  const [signIn, { error }] = useSignInMutation({
    errorPolicy: 'all',
    update: (cache, fetchResult) => {
      cache.writeQuery({
        query: gql`
        query Me{
          me{
            id
            username
          }
        }
        `,
        data: {
          id: fetchResult.data?.signIn.id,
          username: fetchResult.data?.signIn.username,
        },
      });
    },
  });

  const [alertOpen, setAlertOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setAlertOpen(!!error);
    return () => {
      setAlertOpen(false);
    };
  }, [error]);

  const closeAlert = useCallback(() => {
    setAlertOpen(false);
  }, [setAlertOpen]);
  return (
    <Wrapper>
      <Text
        fontSize="4xl"
        color="blue.50"
      >
        Sign In
      </Text>
      <Divider mb={5} />
      {alertOpen && (
      <Alert
        status="error"
        mb={5}
      >
        <AlertIcon />
        <AlertTitle mr={2}>
          Oops!
        </AlertTitle>
        <AlertDescription>
          {error?.message}
        </AlertDescription>
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={closeAlert}
        />
      </Alert>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const response = await signIn({
            variables: { options: values },
          });
          if (response.data) router.push('/');
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack
              spacing={5}
              shouldWrapChildren
            >
              <InputField
                name="username"
                placeholder="Username"
                label="Username"
                disabled={isSubmitting}
              />
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
                disabled={isSubmitting}
              />
              <Button
                mt={4}
                variantColor="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Sign In
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
