import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useHistory } from 'react-router-dom';

import NavbarBrandImage from './NavbarBrandImage.js';

const LoggedInNavbar = (props) => {
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
            <Link to="/accounts/home" className="level-item" title="Home">
              <p className="button is-white">
                <span className="icon is-medium has-text-dark">
                  <i className="fas fa-home fa-lg" aria-hidden="true"></i>
                </span>
              </p>
            </Link>
            {/* <Link to="/sessions" className="level-item" title="Sessions">
              <p className="button is-white">
                <span className="icon is-medium has-text-dark">
                  <i className="fas fa-calendar fa-lg" aria-hidden="true"></i>
                </span>
              </p>
            </Link> */}
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
                    {props.currentUser && props.currentUser.username ? (
                      <Link to={`/${props.currentUser.username}`} className="dropdown-item">
                        <p className="">Profile</p>
                      </Link>
                    ): null}
                    <Link to="/accounts/edit" className="dropdown-item">
                      <p className="">Settings</p>
                    </Link>
                    <Link to="/contact/feedback" className="dropdown-item">
                      <p className="">Contact Us</p>
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
