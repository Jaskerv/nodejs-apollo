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
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { object, string, ref } from 'yup';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';

interface InputTypes {
username: string
password: string
confirmPassword: string
}

const defaultValues: InputTypes = {
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
  const [registerUser, { error }] = useRegisterMutation({
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

  const {
    handleSubmit, errors, register, formState: { touched, isSubmitting },
  } = useForm<InputTypes>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'all',
  });

  const onSubmit: SubmitHandler<InputTypes> = async (values) => {
    const response = await registerUser({ variables: { options: values } });
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
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            error={errors.confirmPassword?.message}
            touched={touched.confirmPassword}
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
            Register
          </Button>
        </Stack>
      </form>
    </Wrapper>
  );
}
