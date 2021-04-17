import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import SimpleNavbar from './Navbar/SimpleNavbar.js';
import Footer from './Footer.js';

const LandingPage = () => {
  // const TITLE = (<span>Get Better Every Day and Become the <span className="has-text-link">Best</span></span>);
  const TITLE = (<span>Get Better <span className="has-text-link">Every</span> Day and Become Successful</span>);
  const SUBTITLE = `Success is the product of daily habits not once in a lifetime transformations. Design a system of habits to become successful.`;
  // const SUBTITLE = `Success is the product of daily habits not once in a lifetime transformations. Design a system of habits to become successful and import it into your calendar.`;
  const BUTTON_TEXT = 'Get Started';
  const CTA_LINK = '/start'

  return (
    <div>
      <section className="hero has-background-white is-fullheight">
        <SimpleNavbar />
        <div className="hero-body">
          <div className="container">
            {/* HERO */}
            <div className="columns is-vcentered is-centered mb-6">
              <div className="column is-two-thirds">
                <div className="is-hidden-mobile has-text-centered">
                  <p className="title is-1 has-text-black-ter" style={{fontWeight: '800', fontSize: '3.6rem'}}>{TITLE}</p>
                  <p className="subtitle is-4 has-text-black-ter mb-6">{SUBTITLE}</p>
                  <Link to={CTA_LINK} className="button is-link" onClick={() => {
                    analytics.track('CTA Button Clicked', {
                      layout: 'desktop'
                    });
                  }}>
                    <span>{BUTTON_TEXT}</span>
                    <span className="icon">
                      <i className="fas fa-chevron-right"></i>
                    </span>
                  </Link>
                </div>
                <div className="is-hidden-tablet has-text-centered">
                  <p className="title is-3 has-text-black-ter" style={{fontWeight: '800', fontSize: '3.2rem'}}>{TITLE}</p>
                  <p className="subtitle is-4 has-text-black-ter mb-6">{SUBTITLE}</p>
                  <Link to={CTA_LINK} className="button is-link" onClick={() => {
                    analytics.track('CTA Button Clicked', {
                      layout: 'mobile'
                    });
                  }}>
                    <span>{BUTTON_TEXT}</span>
                    <span className="icon">
                      <i className="fas fa-chevron-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
        <Footer />
      </section>
    </div>
  );
}

export default LandingPage;
