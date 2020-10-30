import { Button, Divider, Text } from '@chakra-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

interface InputForm{
  email: string
}

const defaultValues: InputForm = {
  email: '',
};

const validationSchema = object().shape({
  email: string().required().email().label('Email'),
});

export default function ForgotPassword(): ReactElement {
  const {
    register, errors, formState: { touched, isSubmitting, submitCount }, handleSubmit,
  } = useForm<InputForm>({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues,
  });

  const onSubmit: SubmitHandler<InputForm> = async (values) => {

  };

  return (
    <Wrapper>
      <Text
        fontSize="4xl"
        color="blue.50"
      >
        Recover Password
      </Text>
      <Divider mb={5} />
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
    </Wrapper>
  );
}
