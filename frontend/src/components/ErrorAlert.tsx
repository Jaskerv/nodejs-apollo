import {
  Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton,
} from '@chakra-ui/core';
import React, { ReactElement } from 'react';

interface Props {
  errorMessage?: string
  open: boolean
  onClose: () => void
}

function ErrorAlert({ errorMessage, open, onClose }: Props): ReactElement {
  return (
    <>
      {open && (
      <Alert
        status="error"
        mb={5}
      >
        <AlertIcon />
        <AlertTitle mr={2}>
          Oops!
        </AlertTitle>
        <AlertDescription>
          {errorMessage}
        </AlertDescription>
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={onClose}
        />
      </Alert>
      )}
    </>
  );
}

ErrorAlert.defaultProps = {
  errorMessage: '',
};

export default ErrorAlert;
