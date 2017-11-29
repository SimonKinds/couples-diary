// @flow
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Signup from '../signup.js';

describe('<Signup />', () => {
  it('matches its snapshot without error', () => {
    const tree = renderer
      .create(<Signup onSubmit={() => { return }} error={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches its snapshot with error', () => {
    const tree = renderer
      .create(<Signup onSubmit={() => { return }} error={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('callback is called with email of input', done => {
    const email = 'expected@gmail.com';
    const callback = (inputEmail: string) => {
      expect(inputEmail).toBe(email);
      done();
    }
    const wrapper = shallow(<Signup onSubmit={callback} error={false} />);

    wrapper.find('FormInput')
      .simulate('change', { target: { value: email } });
    wrapper.find('Button').simulate('click');
  });
});
