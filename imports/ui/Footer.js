import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Footer = () => {
  const now = moment();
  const year = now.year();

  return (
    <div className="hero-foot">
      <nav className="tabs">
        <div className="container">
          <ul>
            <li><Link to="/contact" className="is-size-7">Contact Us</Link></li>
            <li><Link to="/legal/privacy" className="is-size-7">Privacy Policy</Link></li>
            <li><Link to="/legal/terms" className="is-size-7">Terms of Use</Link></li>
            <li>
              <a className="is-size-7">
                <span>{year} © Wombo, Inc.</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Footer;
