import React from 'react';
import { Link } from 'react-router-dom';

import NavbarBrandImage from './NavbarBrandImage';

const Navbar = () => {
  return (
    <div className="hero-head">
      <div className="container">
        <div className="level is-mobile my-1">
          {/* LEFT */}
          <div className="level-left">
            <Link to="/" className="level-item is-hidden-mobile">
              <NavbarBrandImage />
            </Link>
            <Link to="/" className="level-item is-hidden-tablet">
              <NavbarBrandImage />
            </Link>
          </div>
          {/* RIGHT */}
          <div className="level-right">
            <Link to="/accounts/login" className="level-item">
              <p className="button is-text">Log In</p>
            </Link>
            <Link to="/accounts/signup" className="level-item">
              <p className="button is-link">Sign Up</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
