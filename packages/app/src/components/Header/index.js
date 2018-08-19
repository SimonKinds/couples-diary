import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const Header = () => (
  <header className="main-header">
    <Link to="/">Couple's Diary</Link>
  </header>
);

export default Header;
