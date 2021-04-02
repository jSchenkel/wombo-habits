import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

import NavbarBrandImage from './NavbarBrandImage.js';

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
          <div className="level-right is-hidden-mobile">
            {/* <Link to="/use-cases" className="level-item">
              <p className="button is-text">Use Cases</p>
            </Link> */}
            {/* <Link to="/#how-it-works" className="level-item">
              <p className="button is-text">How it Works</p>
            </Link>
            <Link to="/#why-yoga" className="level-item">
              <p className="button is-text">Why Yoga?</p>
            </Link>
            <Link to="/#why-wombo" className="level-item">
              <p className="button is-text">Why Wombo?</p>
            </Link> */}
            {/* <Link to="/blog/all" className="level-item">
              <p className="button is-text">Blog</p>
            </Link> */}
            <Link to="/accounts/login" className="level-item">
              <p className="button is-text">Log In</p>
            </Link>
            <Link to="/accounts/request-invite" className="level-item">
              <p className="button is-link">
                <span>Request Invite</span>
                <span className="icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </p>
            </Link>
          </div>
          <div className="level-right is-hidden-tablet">
            <div className="level-item">
              <div className="dropdown is-hoverable is-right">
                <div className="dropdown-trigger">
                  <button className="button is-white" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span className="icon is-medium has-text-dark">
                      <i className="fas fa-bars fa-lg" aria-hidden="true"></i>
                    </span>
                  </button>

                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    {/* <Link to="/use-cases" className="dropdown-item">
                      <p className="button is-text">Use Cases</p>
                    </Link> */}
                    {/* <Link to="/#how-it-works" className="dropdown-item">
                      <p className="button is-text">How it Works</p>
                    </Link>
                    <Link to="/#why-yoga" className="dropdown-item">
                      <p className="button is-text">Why Yoga?</p>
                    </Link>
                    <Link to="/#why-wombo" className="dropdown-item">
                      <p className="button is-text">Why Wombo?</p>
                    </Link> */}
                    {/* <Link to="/join" className="dropdown-item">
                      <p className="button is-text">Join a Session</p>
                    </Link> */}
                    <Link to="/accounts/login" className="dropdown-item">
                      <p className="button is-text">Log In</p>
                    </Link>
                    {/* <hr className="dropdown-divider" />
                    <Link to="/accounts/signup" className="dropdown-item">
                      <p className="button is-success is-fullwidth">Sign Up, It's Free</p>
                    </Link> */}
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

export default Navbar;
