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
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

interface InputTypes {
username: string
email: string
password: string
confirmPassword: string
}

const defaultValues: InputTypes = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = object().shape({
  username: string().required().min(3).label('Username'),
  password: string().required().min(8).label('Password'),
  confirmPassword: string().required().oneOf([ref('password'), ''], 'Password does not match').min(8)
    .label('Confirm Password'),
  email: string().required().email().label('Email'),
});

function Register(): ReactElement {
  const [registerUser, { error }] = useRegisterMutation({
    update: (cache, { data }) => {
      cache.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          __typename: 'Query',
          me: data?.register,
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
    handleSubmit, errors, register, formState: { touched, isSubmitting, submitCount },
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
            error={errors.username?.message}
            touched={touched.username || submitCount > 0}
            isDisabled={isSubmitting}
            ref={register}
          />
          <InputField
            name="email"
            label="Email"
            error={errors.email?.message}
            touched={touched.email || submitCount > 0}
            isDisabled={isSubmitting}
            ref={register}
          />
          <InputField
            name="password"
            label="Password"
            error={errors.password?.message}
            touched={touched.password || submitCount > 0}
            isDisabled={isSubmitting}
            ref={register}
            type="password"
          />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            touched={touched.confirmPassword || submitCount > 0}
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

export default withApollo({ ssr: false })(Register);
