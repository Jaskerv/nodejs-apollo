import React, { ReactElement } from 'react';
import { withApollo } from '../utils/withApollo';

function Index(): ReactElement {
  return (
    <div>
      Hello World
    </div>
  );
}

export default withApollo({ ssr: true })(Index);
