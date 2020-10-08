import {
  FormControl, FormLabel, Input, FormErrorMessage,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes, ReactElement } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement>&{
  label: string
  name: string
  placeholder?: string
}

function InputField({
  label, placeholder, size: _, ...otherProps
}: InputFieldProps): ReactElement {
  const [field, { error, touched }] = useField(otherProps);
  return (
    <FormControl isInvalid={error && touched}>
      <FormLabel htmlFor={field.name}>
        {label}
      </FormLabel>
      <Input
        {...field}
        {...otherProps}
        id={field.name}
        placeholder={placeholder}
      />
      {error && touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
InputField.defaultProps = {
  placeholder: '',
};

export default InputField;
