import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Divider, Flex, Icon, IconButton, Text,
} from '@chakra-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRecoverPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

interface InputForm{
  email: string
}

const defaultValues: InputForm = {
  email: '',
};

const validationSchema = object().shape({
  email: string().required().email().label('Email'),
});

function RecoveryPassword(): ReactElement {
  const [recoverPassword, { error }] = useRecoverPasswordMutation();
  const {
    register, errors, formState: { touched, isSubmitting, submitCount }, handleSubmit, getValues, reset,
  } = useForm<InputForm>({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues,
  });

  const [emailSent, setEmailSent] = useState(false);

  const onSubmit: SubmitHandler<InputForm> = async ({ email }) => {
    const response = await recoverPassword({ variables: { email } });
    if (response.data) {
      setEmailSent(true);
    }
  };
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    setAlertOpen(!!error);
    return () => {
      setAlertOpen(false);
    };
  }, [error]);

  const closeAlert = useCallback(() => {
    reset();
    setEmailSent(false);
  }, [setEmailSent, reset]);

  const handleBackClick = useCallback(
    () => setAlertOpen(false),
    [setAlertOpen],
  );

  let content = (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        name="email"
        label="Email"
        error={errors.email?.message}
        touched={touched.email || submitCount > 0}
        isDisabled={isSubmitting}
        ref={register}
      />
      <Button
        mt={4}
        variantColor="teal"
        isLoading={isSubmitting}
        type="submit"
      >
        Recover Password
      </Button>
    </form>
  );

  if (emailSent) {
    content = (
      <Flex>
        <IconButton
          aria-label="Back to recover password"
          icon="chevron-left"
          size="sm"
          fontSize="28px"
          onClick={handleBackClick}
        />
        <Box pl="30px">
          <Text fontSize="2xl" mb="6">Email Sent!</Text>
          <Text fontSize="xl">
            Check your email
            {' '}
            {getValues().email}
            {' '}
            for password recovery
            {' '}
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Wrapper>
      <Text
        fontSize="4xl"
        color="blue.50"
      >
        Recover Password
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
      {content}
    </Wrapper>
  );
}

export default withApollo({ ssr: false })(RecoveryPassword);
