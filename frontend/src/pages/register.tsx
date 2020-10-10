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
  useToast,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { object, string, ref } from 'yup';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';

interface InputTypes {
username: string
password: string
confirmPassword: string
}

const initialValues: InputTypes = {
  username: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = object().shape({
  username: string().required().min(3).label('Username'),
  password: string().required().min(8).label('Password'),
  confirmPassword: string().required().oneOf([ref('password'), ''], 'Password does not match').min(8)
    .label('Confirm Password'),
});

export default function Register(): ReactElement {
  const [register, { error }] = useRegisterMutation({
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
          id: fetchResult.data?.register.id,
          username: fetchResult.data?.register.username,
        },
      });
    },
  });

  const [alertOpen, setAlertOpen] = useState(false);

  const router = useRouter();
  const toast = useToast();
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
        Register
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
          const response = await register({ variables: { options: values } });
          if (response.data) {
            toast({
              title: 'Account created.',
              description: "We've created your account for you. You are now signed in.",
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            router.push('/');
          }
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
              <InputField
                name="confirmPassword"
                placeholder="Confirm Password"
                label="Confirm Password"
                type="password"
                disabled={isSubmitting}
              />
              <Button
                mt={4}
                variantColor="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Register
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
