// @flow
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Signup from '../signup.js';

describe('<Signup />', () => {
  it('matches its snapshot', () => {
    const tree = renderer
      .create(<Signup />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('has an email input', () => {
    const wrapper = shallow(<Signup />);
    expect(wrapper.find(`input[name='email']`).length).toBe(1);
  });

  it('has a submit button', () => {
    const wrapper = shallow(<Signup />);
    expect(wrapper.find(`buttom[name='submit']`).length).toBe(1);
  });
});
