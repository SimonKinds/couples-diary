import React, { PureComponent, StrictMode } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { today } from 'couples-diary-core';

import Calendar from '../Calendar';
import Entry from '../Entry';
import Login from '../Login';
import FourOhFour from '../FourOhFour';

export default class Router extends PureComponent {
  renderLoginComponent = props => {
    return (
      <StrictMode>
        <Login key="login" setUser={this.props.setUser} {...props} />
      </StrictMode>
    );
  };

  renderCalendarComponent = props => {
    if (this.props.user) {
      return (
        <StrictMode>
          <Calendar {...props} />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  };

  renderEntryComponent = props => {
    if (this.props.user) {
      return (
        <StrictMode>
          <Entry
            year={props.match.params.year}
            month={props.match.params.month}
            date={props.match.params.date}
          />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  };

  renderDefault = () => {
    return redirectToFitting(this.props.user);
  };

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
            path="/entry/:year/:month/:date"
            render={this.renderEntryComponent}
          />
          <Route exact path="/login" render={this.renderLoginComponent} />
          <Route component={FourOhFour} />
        </Switch>
      </BrowserRouter>
    );
  }
}

Router.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
};

function redirectToFitting(user) {
  if (user) {
    const { year, month } = today();
    return <Redirect to={`/calendar/${year}/${month}`} />;
  }

  return <Redirect to="/login" />;
}
