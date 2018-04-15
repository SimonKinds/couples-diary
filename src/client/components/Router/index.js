// @flow

import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
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
    (this: any).renderCalendarComponent = this.renderCalendarComponent.bind(
      this,
    );
    (this: any).renderEntryComponent = this.renderEntryComponent.bind(this);
  }

  renderLoginComponent(props: ContextRouter) {
    return (
      <Login key="login" setIsLoggedIn={this.props.setIsLoggedIn} {...props} />
    );
  }

  renderCalendarComponent(props: ContextRouter) {
    if (this.props.isLoggedIn) {
      return <Calendar {...props} />;
    }
    return <Redirect to="/login" />;
  }

  renderEntryComponent(props: ContextRouter) {
    if (this.props.isLoggedIn) {
      return <Entry {...props} />;
    }
    return <Redirect to="/login" />;
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={this.renderCalendarComponent} />
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
