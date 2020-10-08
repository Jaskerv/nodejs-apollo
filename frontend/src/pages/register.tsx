import Button from '@chakra-ui/core/dist/Button';
import FormControl from '@chakra-ui/core/dist/FormControl';
import FormErrorMessage from '@chakra-ui/core/dist/FormErrorMessage';
import FormLabel from '@chakra-ui/core/dist/FormLabel';
import Input from '@chakra-ui/core/dist/Input';
import { Form, Formik } from 'formik';
import React, { ReactElement } from 'react';
import Wrapper from '../components/Wrapper';

export default function FormikExample(): ReactElement {
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '' }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {({ values, isSubmitting, handleChange }) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
              />
            </FormControl>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
