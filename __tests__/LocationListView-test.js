'use strict';

jest.autoMockOff();

import React from 'react';
import { ListView } from 'react-native';
import TestUtils from 'react-addons-test-utils';

jest.dontMock('../src/components/LocationListView');
const LocationListView = require('../src/components/LocationListView').default;

describe('LocationListView component', () => {
  it('should render without loader', () => {
      const rows = [
          {id: 1, name: 'test'},
          {id: 2, name: 'test2'}
      ];
      const renderer = TestUtils.createRenderer();
      renderer.render(<LocationListView
          header="Test"
          rows={rows}
          onPress={() => null}
      />);
      const output = renderer.getRenderOutput();
      expect(output.type).toEqual(ListView);
  });
});
