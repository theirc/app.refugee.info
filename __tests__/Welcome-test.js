'use strict';

jest.autoMockOff();

import React from 'react';
import { View } from 'react-native';
import TestUtils from 'react-addons-test-utils';

jest.dontMock('../src/scenes/Welcome');
const Welcome = require('../src/scenes/Welcome').default;

describe('Welcome scene', () => {
  it('should render', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(<Welcome />);
      const output = renderer.getRenderOutput();
      expect(output.type).toEqual(View);
      expect(output.props.children.length, 3);
  });
});
