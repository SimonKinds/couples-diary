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
    if (this.props.isAuthenticated) {
      return (
        <StrictMode>
          <Calendar {...props} />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  };

  renderEntryComponent = props => {
    if (this.props.isAuthenticated) {
      const params = props.match.params;

      const year = parseInt(params.year, 10);
      const month = parseInt(params.month, 10);
      const date = parseInt(params.date, 10);

      return (
        <StrictMode>
          <Entry
            nameOfUser="Margot"
            nameOfPartner="Simon"
            year={year}
            month={month}
            date={date}
          />
        </StrictMode>
      );
    }
    return <Redirect to="/login" />;
  };

  renderDefault = () => {
    return redirectToFitting(this.props.isAuthenticated);
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
  isAuthenticated: PropTypes.bool.isRequired,
};

function redirectToFitting(isAuthenticated) {
  if (isAuthenticated) {
    const { year, month } = today();
    return <Redirect to={`/calendar/${year}/${month}`} />;
  }

  return <Redirect to="/login" />;
}
