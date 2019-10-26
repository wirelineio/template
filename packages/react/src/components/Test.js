//
// Copyright 2020 Wireline, Inc.
//

import React, { Component } from 'react';
import compose from 'lodash.flowright';

import { withStyles } from '@material-ui/core/styles';

import { TestProto } from '@wirelineio/template-module';

const styles = () => ({
  root: {
    display: 'flex',
    fontFamily: 'monospace'
  }
});

class TestComponent extends Component {

  render() {
    const { classes } = this.props;

    const { version } = TestProto.Test.decode(TestProto.Test.encode({ version: '0.0.1' }));

    return (
      <div className={classes.root}>
        <h1>Test: {version}</h1>
      </div>
    );
  }
}

export default compose(
  withStyles(styles)
)(TestComponent);
