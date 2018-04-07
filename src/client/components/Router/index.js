// @flow

import React, { PureComponent } from 'react';
import { subscribeToLocation, getPath } from '../../location';

import Calendar from '../Calendar';
import Login from '../Login';
import FourOhFour from '../FourOhFour';

type Props = {
  isLoggedIn: boolean,
  setIsLoggedIn: (status: boolean) => void,
};
type State = {
  path: string,
};

export default class Router extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      path: getPath(),
    };

    (this: any).onUpdatedPath = this.onUpdatedPath.bind(this);
  }

  componentDidMount() {
    subscribeToLocation(this.onUpdatedPath);
  }

  onUpdatedPath(path: string) {
    this.setState({ path });
  }

  renderLogin() {
    return <Login key="login" {...this.props} />;
  }

  render() {
    const { path } = this.state;
    if (!matchesAnyRoute(path)) {
      return <FourOhFour />;
    }

    if (!this.props.isLoggedIn) {
      return this.renderLogin();
    }

    if (matchesCalendarPath(path)) {
      return <Calendar key="calendar" />;
    } else if (path === '/login') {
      return this.renderLogin();
    }

    return '404';
  }
}

function matchesAnyRoute(path: string): boolean {
  return path === '/login' || matchesCalendarPath(path);
}

function matchesCalendarPath(path: string): boolean {
  const rgx = new RegExp('^(/|/calendar(/\\d+/\\d+)?)$');
  const matches = path.match(rgx);
  return matches != null && matches.length > 0;
}
