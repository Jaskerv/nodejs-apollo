import {
  FormControl, FormLabel, Input, FormErrorMessage, InputProps,
} from '@chakra-ui/core';
import React, { ReactElement } from 'react';

type InputFieldProps = InputProps & {
  label: string
  placeholder?: string
  error?: string
  touched?: boolean
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({
    label, placeholder, size: _, error, touched, name, ...otherProps
  }: InputFieldProps, ref): ReactElement => (
    <FormControl isInvalid={!!error && !!touched}>
      <FormLabel htmlFor={name}>
        {label}
      </FormLabel>
      <Input
        {...otherProps}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={ref}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  ),
);

InputField.defaultProps = {
  placeholder: '',
  error: '',
  touched: false,
};

export default InputField;
