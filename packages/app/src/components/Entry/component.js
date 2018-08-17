import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { months } from '../../constants';

import './styles.css';

class EntryForm extends Component {
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
        <div className="entry-top-row">
          <h3>{nameOfUser}</h3>
          <div className="buttons">
            <input type="reset" value="Discard changes" />
            <input type="submit" value="Save" />
          </div>
        </div>
        <div className="notebook">
          <div aria-hidden className="back" />
          <textarea
            title="Diary entry"
            value={this.state.text}
            onChange={this.onChangeText}
          />
        </div>
      </form>
    );
  }
}

EntryForm.propTypes = {
  nameOfUser: PropTypes.string.isRequired,
  saveEntry: PropTypes.func.isRequired,
  entry: PropTypes.string.isRequired,
};

const Entry = ({
  year,
  month,
  date,
  nameOfUser,
  nameOfPartner,
  saveEntry,
  entry,
}) => (
  <section className="entry">
    <nav>
      <a href={`/calendar/${year}/${month}`} title="Back to calendar">
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
      </a>
      <header>
        <h2>{year}</h2>
        <h1>{`${months[month - 1]} ${date}`}</h1>
      </header>
      <a
        href={`/entry/${year}/${month}/${date}/OTHER`}
        title="Read partner's entry"
      >
        Read other
      </a>
    </nav>
    <EntryForm entry={entry} saveEntry={saveEntry} nameOfUser={nameOfUser} />
  </section>
);

Entry.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  nameOfUser: PropTypes.string.isRequired,
  saveEntry: PropTypes.func.isRequired,
  entry: PropTypes.string.isRequired,
};

export default Entry;
