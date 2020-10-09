import { gql, useMutation } from '@apollo/client';
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
import { object, string, ref } from 'yup';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

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
  confirmPassword: string().required().oneOf([ref('password'), null], 'Password does not match').min(8)
    .label('Confirm Password'),
});

const REGISTER_USER = gql`
mutation Register($username: String!, $password: String!, $confirmPassword: String!){
  register(options: {
    username: $username,
    password: $password,
    confirmPassword: $confirmPassword
  }){
    id
    username
    createdAt
  }
}
`;

export default function Register(): ReactElement {
  const [register, { data, error }] = useMutation(REGISTER_USER, { errorPolicy: 'all' });

  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    setAlertOpen(!!error || !!data);
    return () => {
      setAlertOpen(false);
    };
  });

  const closeAlert = useCallback(() => {
    setAlertOpen(false);
  }, [setAlertOpen]);
  return (
    <Wrapper>
      <Text
        fontSize="4xl"
        color="#2f4b5e"
      >
        Register
      </Text>
      <Divider mb={5} />
      {alertOpen && (
      <Alert
        status={data ? 'success' : 'error'}
        mb={5}
      >
        <AlertIcon />
        <AlertTitle mr={2}>
          {`${data ? 'Success' : 'Oops'}!`}
        </AlertTitle>
        <AlertDescription>
          {data ? `${data.register.username} created` : null}
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
          await register({ variables: values });
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
                Submit
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
