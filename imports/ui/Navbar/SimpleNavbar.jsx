import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

import NavbarBrandImage from './NavbarBrandImage';

import { isAuthenticated } from './../../helpers/auth.js';

const SimpleNavbar = () => {
  const logoLink = isAuthenticated() ? '/home' : '/';
  return (
    <div className="hero-head">
      <div className="container">
        <div className="level is-mobile my-1">
          <div className="level-left">
            <Link to={logoLink} className="level-item is-hidden-mobile">
              <NavbarBrandImage />
            </Link>
            <Link to={logoLink} className="level-item is-hidden-tablet">
              <NavbarBrandImage />
            </Link>
          </div>
          <div className="level-right">
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleNavbar;
