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
        <Login key="login" setToken={this.props.setToken} {...props} />
      </StrictMode>
    );
  };

  renderCalendarComponent = props => {
    if (this.props.isLoggedIn) {
      return (
        <StrictMode>
          <Calendar {...props} />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  };

  renderEntryComponent = props => {
    if (this.props.isLoggedIn) {
      return (
        <StrictMode>
          <Entry
            year={parseInt(props.match.params.year, 10)}
            month={parseInt(props.match.params.month, 10)}
            date={parseInt(props.match.params.date, 10)}
          />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  };

  renderDefault = () => {
    return redirectToFitting(this.props.isLoggedIn);
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
  isLoggedIn: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
};

function redirectToFitting(isLoggedIn) {
  if (isLoggedIn) {
    const { year, month } = today();
    return <Redirect to={`/calendar/${year}/${month}`} />;
  }

  return <Redirect to="/login" />;
}
