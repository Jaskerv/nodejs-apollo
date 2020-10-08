import Box from '@chakra-ui/core/dist/Box';
import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode
  variant?: 'small' |'regular'
}

function Wrapper({ children, variant }: Props): ReactElement {
  return (
    <Box
      maxW={variant === 'regular' ? '800px' : '400ox'}
      w="100%"
      mt={8}
      mx="auto"
    >
      {children}
    </Box>
  );
}

Wrapper.defaultProps = {
  variant: 'regular',
};

export default Wrapper;
