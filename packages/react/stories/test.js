//
// Copyright 2020 Wireline, Inc.
//

import React, { Component } from 'react';
import compose from 'lodash.flowright';

import { withStyles } from '@material-ui/core/styles';

import { TestComponent } from '../src';

const styles = () => ({
  root: {
    display: 'flex'
  }
});

class TestContainer extends Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TestComponent />
      </div>
    );
  }
}

export default compose(
  withStyles(styles)
)(TestContainer);
