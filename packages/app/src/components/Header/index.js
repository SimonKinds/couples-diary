import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const containerClassname = location =>
  `container ${location === 'center' ? 'center-content' : ''}`;

const Header = ({ location }) => (
  <header className="main-header">
    <div className={containerClassname(location)}>
      <Link to="/">Couple's Diary</Link>
    </div>
  </header>
);

export default Header;
