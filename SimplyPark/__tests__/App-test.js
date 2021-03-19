/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import homeScreen from '../src/screens/HomeScreen';

test('Home renders correctly', () => {
  const tree = render.create(<homeScreen />).toJSON()
  expect(tree).toMatchSnapshot();
})
