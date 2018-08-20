import React, { PureComponent, Fragment } from 'react';
import Header from '../Header';

import './styles.css';

export default class FourOhFour extends PureComponent {
  render() {
    return (
      <Fragment>
        <Header />
        <main>
          <div className="fourohfour">404: No love found</div>
        </main>
      </Fragment>
    );
  }
}
