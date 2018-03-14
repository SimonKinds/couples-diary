import React from 'react';
import { shallow } from 'enzyme';

import App from './index';

describe('App component', () => {
  test('Renders a .container', () => {
    expect(shallow(<App />).find('.container')).toHaveLength(1);
  });
});
