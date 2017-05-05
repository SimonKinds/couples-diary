import React, { Component } from 'react';

export default class Countdown extends Component {
  constructor(props) {
    super(props);

    this.timeLeft = this.timeLeft.bind(this);
    this.commaDivider = this.commaDivider.bind(this);

    const date = new Date();

    date.setUTCFullYear(2017);
    date.setUTCMonth(5);
    date.setUTCDate(17);
    // 15 minute window for her to get out
    date.setUTCHours(9 + 2, 55, 0, 0);

    this.finalDate = date;
    this.state = {timeLeft: this.commaDivider(this.timeLeft())}
  }

  componentWillMount() {
    this.intervalId = setInterval(() => this.setState({timeLeft: this.commaDivider(this.timeLeft())}), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  timeLeft() {
    return Math.ceil((this.finalDate.getTime() - new Date().getTime()) / 1000);
  }

  commaDivider(number) {
    let commaDividedNumber = '';
    while (number > 0) {
      let thousands = '' + (number % 1000);
      while (thousands.length != 3) {
        thousands = '0' + thousands;
      }

      commaDividedNumber = thousands + commaDividedNumber;
      commaDividedNumber = ',' + commaDividedNumber;
      number = Math.floor(number / 1000);
    }

    // remove comma
    commaDividedNumber = commaDividedNumber.substring(1);
    // remove unneccessary 0s from the start
    while (commaDividedNumber[0] == '0') {
      commaDividedNumber = commaDividedNumber.substring(1);
    }
    return commaDividedNumber;
  }

  render() {
    return (
      <div>
        <p style={{color: 'white'}}>{this.state.timeLeft} seconds until I'll see my Hot Patootie</p>
      </div>
    )
  }
};
