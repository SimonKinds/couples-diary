import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const Header = () => (
  <header className="main-header">
    <div className="container">
      <Link to="/">Couple's Diary</Link>
    </div>
  </header>
);

export default Header;
