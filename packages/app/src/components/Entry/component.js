import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import Header from '../Header';
import { months } from '../../constants';

import './styles.css';

const EntryBodyWrapper = ({ top, body }) => (
  <Fragment>
    <div className="entry-top-row">{top}</div>
    <div className="notebook">
      <div aria-hidden className="back" />
      {body}
    </div>
  </Fragment>
);

export class EntryForm extends Component {
  state = {
    text: this.props.entry,
  };

  onChangeText = ({ currentTarget: { value } }) =>
    this.setState({ text: value });

  onSubmit = e => {
    e.preventDefault();
    this.props.saveEntry(this.state.text);
  };

  onReset = e => {
    e.preventDefault();
    this.setState({ text: this.props.entry });
  };

  render() {
    const { nameOfUser } = this.props;

    return (
      <form onSubmit={this.onSubmit} onReset={this.onReset}>
        <EntryBodyWrapper
          top={
            <Fragment>
              <h3>{nameOfUser}</h3>
              <div className="buttons">
                {this.props.entry === this.state.text ? (
                  <p>Saved</p>
                ) : (
                  <Fragment>
                    <input type="reset" value="Discard changes" />
                    <input type="submit" value="Save" />
                  </Fragment>
                )}
              </div>
            </Fragment>
          }
          body={
            <textarea
              title="Diary entry"
              value={this.state.text}
              onChange={this.onChangeText}
            />
          }
        />
      </form>
    );
  }
}

EntryForm.propTypes = {
  nameOfUser: PropTypes.string.isRequired,
  saveEntry: PropTypes.func.isRequired,
  entry: PropTypes.string.isRequired,
};

export const EntryBody = ({ nameOfUser, entry }) => (
  <EntryBodyWrapper top={<h3>{nameOfUser}</h3>} body={<p>{entry}</p>} />
);

EntryBody.propTypes = {
  nameOfUser: PropTypes.string.isRequired,
  entry: PropTypes.string.isRequired,
};

const Entry = ({ year, month, date, body, nameOfPartner }) => (
  <Fragment>
    <Header />
    <section className="entry">
      <nav>
        <Link to={`/calendar/${year}/${month}`} title="Back to calendar">
          <svg
            aria-hidden
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="25"
            height="25"
          >
            <path
              fill="currentColor"
              d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
            />
          </svg>
        </Link>
        <header>
          <h2>{year}</h2>
          <h1>{`${months[month - 1]} ${date}`}</h1>
        </header>
        <Link
          to={`/entry/${year}/${month}/${date}/${nameOfPartner}`}
          title="Read partner's entry"
        >
          Read other
        </Link>
      </nav>
      <main>{body}</main>
    </section>
  </Fragment>
);

Entry.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  body: PropTypes.node.isRequired,
  nameOfPartner: PropTypes.string.isRequired,
};

export default Entry;