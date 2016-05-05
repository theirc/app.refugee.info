'use strict';

jest.autoMockOff();

import React from 'react';
import { View } from 'react-native';
import TestUtils from 'react-addons-test-utils';

jest.dontMock('../src/components/RegionDrillDown');
const RegionDrillDown = require('../src/components/RegionDrillDown').default;

describe('RegionDrillDown component', () => {
  it('should render without loader', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(<RegionDrillDown
          countries={[]}
          cities={[]}
          loading={false}
          onCityChange={(cityId) => cityId}
          onCountryChange={(countryId) => countryId}
          selectedCity={null}
          selectedCountry={null}
          onPress={() => null}
      />);
      const output = renderer.getRenderOutput();
      expect(output.type).toEqual(View);
      expect(output.props.children[3]).toEqual(undefined);
  });
});
