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
  Link as ChakraLink,
} from '@chakra-ui/core';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { object, string } from 'yup';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { MeDocument, MeQuery, useSignInMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

interface InputTypes {
email: string
password: string
}

const defaultValues: InputTypes = {
  email: '',
  password: '',
};

const validationSchema = object().shape({
  email: string().required().email().label('Email'),
  password: string().required().min(8).label('Password'),
});

function SignIn(): ReactElement {
  const [signIn, { error }] = useSignInMutation({
    update: (cache, { data }) => {
      cache.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          __typename: 'Query',
          me: data?.signIn,
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
    handleSubmit, errors, register, formState: { touched, isSubmitting, submitCount },
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
          <Link href="/forgot-password">
            <ChakraLink>
              Forgot Password
            </ChakraLink>
          </Link>
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

export default withApollo({ ssr: false })(SignIn);
