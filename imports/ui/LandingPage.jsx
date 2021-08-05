import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Navbar from './Navbar/Navbar';
import Footer from './Footer';

const LandingPage = () => {
  const TITLE = (<span>Get Better <span className="has-text-link">Every</span> Day And Become Successful</span>);
  const SUBTITLE = `Success is the product of daily habits not once in a lifetime transformations. Design a system of habits to become successful.`;
  const BUTTON_TEXT = 'Get Started';
  const CTA_LINK = '/accounts/signup'
  
  return (
    <div>
      <section className="hero has-background-white is-fullheight">
        <Navbar />
        <div className="hero-body">
          <div className="container">
            {/* HERO */}
            <div className="columns is-vcentered is-centered mb-6">
              <div className="column is-two-thirds">
                <div className="is-hidden-mobile has-text-centered">
                  <p className="title is-1" style={{fontWeight: '800', fontSize: '3.6rem'}}>{TITLE}</p>
                  <p className="subtitle is-4 mb-6">{SUBTITLE}</p>
                  <Link to={CTA_LINK} className="button is-link is-medium" onClick={() => {
                    analytics.track('CTA Button Clicked', {
                      type: 'landing-page',
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
                  <p className="title is-3" style={{fontWeight: '800', fontSize: '3.2rem'}}>{TITLE}</p>
                  <p className="subtitle is-4 mb-6">{SUBTITLE}</p>
                  <Link to={CTA_LINK} className="button is-link is-medium" onClick={() => {
                    analytics.track('CTA Button Clicked', {
                      type: 'landing-page',
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
      </section>
      <section className="hero has-background-link">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-half">
                <div className="notification">
                  <article className="media">
                    <figure className="media-left">
                      <p className="image is-48x48">
                        <img className="is-rounded" src="/images/profile.jpg" />
                      </p>
                    </figure>
                    <div className="media-content">
                      <div className="content">
                        <p>
                          <span className="is-size-7"><b>Jules Schenkel, creator of Wombo</b></span>
                          <br />"I built Wombo to help me build good habits and perform at my best. 
                          I use Wombo every single day to stay focused and consistently make progress towards my goals.
                          And now I'm sharing my secret power with you!"
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero has-background-white is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered is-centered">
              <div className="column is-half">
                <div className="">
                  <p className="title is-3">Good Habits Are The Key To All Success</p>
                  <p className="subtitle is-6">
                    Good habits make you better and get you closer to the <b>results</b> that you want.
                    <br/><br/>Get 1% better every day and you will be <b>37x</b> better in a year. Habits are the compound interest of self-improvement.
                  </p>
                </div>
              </div>
              <div className="column is-half">
                <div className="mx-6 my-6">
                  <img className="" src="/images/tiny-gains-graph.jpg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero has-background-white-bis is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column is-half is-hidden-mobile">
                <div className="mx-6 my-6">
                  <img className="" src="/images/calendar.png" />
                </div>
              </div>
              <div className="column is-half">
                <div className="">
                  <p className="title is-3">How To Build Good Habits</p>
                  <p className="subtitle is-6">
                    Many people think that they lack motivation when what they really lack is <b>clarity</b>.
                    <br/><br/>They rely on motivation, thinking, "I wonder if I will <b>feel</b> motivated to do X today?"
                    <br/><br/>A simple <b>plan</b> takes the decision making out of it and is the most effective way to build good habits that stick.
                  </p>
                </div>
              </div>
              <div className="column is-half is-hidden-tablet">
                <div className="mx-6 my-6">
                  <img className="" src="/images/calendar.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero has-background-white is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered is-centered">
              <div className="column is-half">
                <div className="">
                  <p className="title is-3">With Wombo You Will...</p>
                  <p className="subtitle is-6">
                    <b>Define</b> who you wish to become and the results that you want.
                    <br/><br/><b>Design</b> a system of habits to get the results that you want.
                    <br/><br/>Get <b>extreme clarity</b> around your habits with a simple daily plan.
                    <br/><br/><b>Stick</b> to your system of habits and get the results that you want.
                    <br/><br/>+ <b>15 basic</b> habit templates to prime your body and mind for peak performance.
                    <br/><br/>+ <b>3 expert</b> habit templates to be productive and get things done.
                  </p>
                </div>
              </div>
              <div className="column is-half">
                <div className="columns is-vcentered is-centered mx-4 my-4">
                  <div className="column is-half">
                    <p className="is-size-6 has-text-weight-semibold mb-1">System of Habits <span className="is-size-7 has-text-grey-light">Example</span></p>
                    <img className="has-shadow" src="/images/system.png" />
                  </div>
                  <div className="column is-half">
                    <p className="is-size-6 has-text-weight-semibold mb-1">Simple Daily Plan <span className="is-size-7 has-text-grey-light">Example</span></p>
                    <img className="has-shadow" src="/images/daily_plan.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero has-background-white-bis is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title is-2">What are you waiting for?</p>
            <p className="subtitle is-4">
              Design a system of habits to get the results that you want and get extreme clarity with a daily plan.
            </p>
            <Link to={CTA_LINK} className="button is-link is-medium" onClick={() => {
              analytics.track('CTA Button Clicked', {
                type: 'landing-page',
                layout: 'desktop'
              });
            }}>
              <span>{BUTTON_TEXT}</span>
              <span className="icon">
                <i className="fas fa-chevron-right"></i>
              </span>
            </Link>
          </div>
        </div>
        {/* <Footer /> */}
        <Footer />
      </section>
    </div>
  );
}

export default LandingPage;
