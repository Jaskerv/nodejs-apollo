import {
  Button,
  Divider,
  Stack,
  Text,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { ReactElement } from 'react';
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
const validate = ({ username, password, confirmPassword }:InputTypes) => {
  let errors = {};
  if (!username) {
    errors = {
      ...errors,
      username: 'Username is required',
    };
  }
  if (!password) {
    errors = {
      ...errors,
      password: 'Password is required',
    };
  }
  if (!confirmPassword) {
    errors = {
      ...errors,
      confirmPassword: 'Password is required',
    };
  }
  if (password && confirmPassword && password !== confirmPassword) {
    errors = {
      ...errors,
      password: 'Password mismatch',
      confirmPassword: 'Password mismatch',
    };
  }

  return errors;
};

export default function FormikExample(): ReactElement {
  return (
    <Wrapper>
      <Text
        fontSize="4xl"
        color="#2f4b5e"
      >
        Register
      </Text>
      <Divider mb={10} />
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
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
