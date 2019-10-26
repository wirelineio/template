//
// Copyright 2020 Wireline, Inc.
//

import React from 'react';
import { storiesOf } from '@storybook/react';

import TestContainer from './test';

export default storiesOf('Components', module)

  // https://www.npmjs.com/package/@storybook/addon-options
  .addParameters({ options: { addonPanelInRight: true } })

  .add('Test', () => (
    <TestContainer />
  ));
