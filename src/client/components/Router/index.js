// @flow

import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';

import Calendar from '../Calendar';
import Entry from '../Entry';
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

    (this: any).renderLoginComponent = this.renderLoginComponent.bind(this);
  }

  renderLoginComponent(props: ContextRouter) {
    return (
      <Login key="login" setIsLoggedIn={this.props.setIsLoggedIn} {...props} />
    );
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <BrowserRouter>
        <Switch>
          {isLoggedIn ? (
            [
              <Route exact path="/" key="calendarPath" component={Calendar} />,
              <Route
                exact
                path="/calendar/:year/:month"
                key="calendarPath"
                component={Calendar}
              />,
              <Route
                exact
                path="/entry/:year/:month/:day"
                key="entryPath"
                component={Entry}
              />,
              <Route
                exact
                path="/login"
                key="loginPath"
                render={this.renderLoginComponent}
              />,
            ]
          ) : (
            <Route exact path="/(|login)" render={this.renderLoginComponent} />
          )}
          <Route component={FourOhFour} />
        </Switch>
      </BrowserRouter>
    );
  }
}
