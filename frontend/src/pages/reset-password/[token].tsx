import {
  Divider, Text,
} from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useState } from 'react';
import ErrorAlert from '../../components/ErrorAlert';
import Wrapper from '../../components/Wrapper';
import { withApollo } from '../../utils/withApollo';

function ResetPassword(): ReactElement {
  const router = useRouter();
  const { token } = router.query;

  const [alertOpen, setAlertOpen] = useState(false);

  const handleCloseAlert = useCallback(
    () => setAlertOpen(false),
    [setAlertOpen],
  );

  return (
    <Wrapper>
      <Text
        fontSize="4xl"
        color="blue.50"
      >
        Recover Password
      </Text>
      <Divider mb={5} />
      <ErrorAlert
        open={alertOpen}
        onClose={handleCloseAlert}
        errorMessage=""
      />
    </Wrapper>
  );
}

export default withApollo({ ssr: false })(ResetPassword);
