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
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { object, string } from 'yup';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useSignInMutation } from '../generated/graphql';

interface InputTypes {
username: string
password: string
}

const defaultValues: InputTypes = {
  username: '',
  password: '',
};

const validationSchema = object().shape({
  username: string().required().min(3).label('Username'),
  password: string().required().min(8).label('Password'),
});

export default function SignIn(): ReactElement {
  const [signIn, { error }] = useSignInMutation({
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

  const {
    handleSubmit, errors, register, formState: { touched, isSubmitting },
  } = useForm<InputTypes>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'all',
  });

  const onSubmit: SubmitHandler<InputTypes> = async (values) => {
    const response = await signIn({
      variables: { options: values },
    });
    if (response.data) router.push('/');
  };

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
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack
          spacing={5}
          shouldWrapChildren
        >
          <InputField
            name="username"
            label="Username"
            placeholder="Username"
            error={errors.username?.message}
            touched={touched.username}
            isDisabled={isSubmitting}
            ref={register}
          />
          <InputField
            name="password"
            label="Password"
            placeholder="Password"
            error={errors.password?.message}
            touched={touched.password}
            isDisabled={isSubmitting}
            ref={register}
            type="password"
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
      </form>
    </Wrapper>
  );
}
