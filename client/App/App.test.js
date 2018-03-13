import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from './index';

configure({ adapter: new Adapter() });

describe('App component', () => {
  test('Renders a .container', () => {
    expect(shallow(<App />).find('.container')).toHaveLength(1);
  });
});
