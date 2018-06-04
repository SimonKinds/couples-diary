// @flow

// $FlowFixMe: StrictMode not yet introduced
import React, { PureComponent, StrictMode } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import { today } from 'couples-diary-core';

import Calendar from '../Calendar';
import Entry from '../Entry';
import Login from '../Login';
import FourOhFour from '../FourOhFour';

type Props = {
  user: ?User,
  setUser: (user: ?User) => void,
};
type State = {
  path: string,
};

export default class Router extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).renderLoginComponent = this.renderLoginComponent.bind(this);
    (this: any).renderCalendarComponent = this.renderCalendarComponent.bind(
      this
    );
    (this: any).renderEntryComponent = this.renderEntryComponent.bind(this);
    (this: any).renderDefault = this.renderDefault.bind(this);
  }

  renderLoginComponent(props: ContextRouter) {
    return (
      <StrictMode>
        <Login key="login" setUser={this.props.setUser} {...props} />
      </StrictMode>
    );
  }

  renderCalendarComponent(props: ContextRouter) {
    if (this.props.user) {
      return (
        <StrictMode>
          <Calendar {...props} />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  }

  renderEntryComponent(props: ContextRouter) {
    if (this.props.user) {
      return (
        <StrictMode>
          <Entry {...props} />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  }

  renderDefault() {
    return redirectToFitting(this.props.user);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={this.renderDefault} />
          <Route
            exact
            path="/calendar/:year/:month"
            render={this.renderCalendarComponent}
          />
          <Route
            exact
            path="/entry/:year/:month/:day"
            render={this.renderEntryComponent}
          />
          <Route exact path="/login" render={this.renderLoginComponent} />
          <Route component={FourOhFour} />
        </Switch>
      </BrowserRouter>
    );
  }
}

function redirectToFitting(user: ?User) {
  if (user) {
    const { year, month } = today();
    return <Redirect to={`/calendar/${year}/${month}`} />;
  }

  return <Redirect to="/login" />;
}
