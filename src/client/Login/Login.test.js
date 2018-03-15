// @flow

import React from 'react';
import { shallow } from 'enzyme';
import type { ShallowWrapper } from 'enzyme';

import Login from './component';

describe('Login component', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<Login />);
  });

  test('Renders a login class', () => {
    expect(wrapper.find('.login')).toHaveLength(1);
  });

  test('Renders a form', () => {
    expect(wrapper.find('form')).toHaveLength(1);
  });

  describe('The form', () => {
    let form: ShallowWrapper;
    beforeEach(() => {
      form = wrapper.find('form');
    });

    test('has username field', () => {
      expect(form.find("label[htmlFor='username']")).toHaveLength(1);
      expect(form.find('#username')).toHaveLength(1);
    });

    describe('the username', () => {
      let username: ShallowWrapper;

      beforeEach(() => {
        username = form.find('#username');
      });

      test('starts out empty', () => {
        expect(username.props().value).toEqual('');
      });
      test('has the value of the state', () => {
        wrapper.setState({ username: 'yup' });
        username = wrapper.find('#username');
        expect(username.props().value).toEqual('yup');
      });
      test('updates state onChange', () => {
        username.simulate('change', { currentTarget: { value: 'hmm' } });
        username = wrapper.find('#username');
        expect(username.props().value).toEqual('hmm');
      });
    });

    test('has a password field', () => {
      expect(form.find("label[htmlFor='password']")).toHaveLength(1);
      expect(form.find('#password')).toHaveLength(1);
    });

    describe('the password', () => {
      let password: ShallowWrapper;

      beforeEach(() => {
        password = form.find('#password');
      });

      test('starts out empty', () => {
        expect(password.props().value).toEqual('');
      });
      test('has the value of the state', () => {
        wrapper.setState({ password: 'yup' });
        password = wrapper.find('#password');
        expect(password.props().value).toEqual('yup');
      });
      test('updates state onChange', () => {
        password.simulate('change', { currentTarget: { value: 'hmm' } });
        password = wrapper.find('#password');
        expect(password.props().value).toEqual('hmm');
      });
    });

    test('has a submit button', () => {
      expect(form.find("input[type='submit']")).toHaveLength(1);
    });

    test('has no other fields', () => {
      expect(form.find('input')).toHaveLength(3);
    });
  });
});
