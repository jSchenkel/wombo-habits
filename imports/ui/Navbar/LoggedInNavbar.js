import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useHistory } from 'react-router-dom';

import NavbarBrandImage from './NavbarBrandImage.js';

const LoggedInNavbar = () => {
  const history = useHistory();
  const onLogout = () => {
    Meteor.logout(() => {
      history.replace('/');
    });
  }

  return (
    <div className="hero-head">
      <div className="container">
        <div className="level is-mobile my-1">
          {/* LEFT */}
          <div className="level-left">
            <Link to="/accounts/home" className="level-item is-hidden-mobile">
              <NavbarBrandImage />
            </Link>
            <Link to="/accounts/home" className="level-item is-hidden-tablet">
              <NavbarBrandImage />
            </Link>
          </div>
          {/* RIGHT */}
          <div className="level-right">
            {/* {upgrade} */}
            {/* <Link to="/accounts/home" className="level-item" title="Home">
              <p className="button is-white">
                <span className="icon is-medium has-text-dark">
                  <i className="fas fa-home fa-lg" aria-hidden="true"></i>
                </span>
              </p>
            </Link> */}
            {/* <Link to="/system" className="level-item" title="My System">
              <p className="button is-white">
                <span className="icon is-medium has-text-dark">
                  <i className="fas fa-th fa-lg" aria-hidden="true"></i>
                </span>
              </p>
            </Link> */}
            <Link to="/home" className="level-item" title="Home">
              <span className="button is-light is-small">
                Home
              </span>
            </Link>
            <Link to="/system" className="level-item" title="System">
              <span className="button is-light is-small">
                System
              </span>
            </Link>
            <div className="level-item">
              <div className="dropdown is-hoverable is-right">
                <div className="dropdown-trigger">
                  <button className="button is-white" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span className="icon is-medium has-text-dark">
                      <i className="fas fa-user-circle fa-lg" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <Link to="/contact" className="dropdown-item">
                      <p className="">Feedback</p>
                    </Link>
                    <Link to="/accounts/edit" className="dropdown-item">
                      <p className="">Settings</p>
                    </Link>
                    <hr className="dropdown-divider" />
                    <a className="dropdown-item" onClick={onLogout}>
                      <p className="">Log Out</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedInNavbar;
