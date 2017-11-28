// @flow
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Signup from '../signup.js';

describe('<Signup />', () => {
  it('matches its snapshot', () => {
    const tree = renderer
      .create(<Signup onSubmit={() => {return}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('callback is called with email of input', done => {
    const email = 'expected@gmail.com';
    const callback = (inputEmail: string) => {
      expect(inputEmail).toBe(email);
      done();
    }
    const wrapper = shallow(<Signup onSubmit={callback}/>);

    wrapper.find(`input[name='email']`)
           .simulate('change', {target: {value: email}});
    wrapper.find(`button[name='submit']`).simulate('click');
  });
});
