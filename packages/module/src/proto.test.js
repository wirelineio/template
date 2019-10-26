//
// Copyright 2020 Wireline, Inc.
//

import { TestProto } from './proto';

test('Protobuf', () => {
  expect(TestProto.Test.decode(TestProto.Test.encode({ version: '0.0.1' }))).toEqual({ version: '0.0.1' });
});
