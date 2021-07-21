import React from 'react';
import { Meteor } from 'meteor/meteor';

import SimpleNavbar from '../Navbar/SimpleNavbar';
import Footer from '../Footer';

import { Link } from 'react-router-dom';

export default class StartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    }
  }

  incrementStep = (increment) => {
    this.setState({
      step: this.state.step + increment
    });
  }

  renderStep() {
    const { step } = this.state;

    if (step === 1) {
      return (
        <div className="has-text-centered">
          <p className="title is-4">Habits Are The Compound Interest of <br />Self-Improvement.</p>
          <p className="subtitle is-6">
            Every day we make decisions that seem <b>small and insignificant</b> in the moment: go to bed late, watch Youtube instead of working on your business, or scroll social media instead of reading a book. 
            <br/><br/>When repeated, these decisions become <b>habits</b> and compound over time.
            <br/><br/>If you want to become successful you need to build <b>good habits</b>, which compound in your favor.
            <br/><br/>Get 1% better <b>every</b> day and you will become successful. 
          </p>
          <a className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-1',
              layout: 'na'
            });
            this.incrementStep(1);
          }}>
            <span>Continue</span>
            <span className="icon">
              <i className="fas fa-chevron-right"></i>
            </span>
          </a>
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="has-text-centered">
          <p className="title is-4">Systems Not Goals</p>
          <p className="subtitle is-6">
            A goal is a <b>result</b> you want to achieve. (i.e. Build a $1 million dollar business)
            <br/><br/>A system is a <b>process</b> for becoming the type of person that gets those results. (i.e. talk to customers, build products, and do marketing/sales)
            <br/><br/>A system of habits allows you to become your <b>dream self</b> through focus and consistent improvement.
            <br/><br/>Ultimately, you <b>are</b> what you repeatedly do.
          </p>
          <a className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-2',
              layout: 'na'
            });
            this.incrementStep(1);
          }}>
            <span>Continue</span>
            <span className="icon">
              <i className="fas fa-chevron-right"></i>
            </span>
          </a>
        </div>
      );
    } else if (step === 3) {
      return (
        <div className="has-text-centered">
          <p className="title is-4">Wombo Helps You...</p>
          <p className="subtitle is-6">
            <b>Design</b> a system of habits to become successful.
            <br/><br/><b>Stick</b> to your system of habits with a proven methodology: Identity - Habit Feedback Loop.
            <br/><br/>Stay <b>motivated</b> with powerful motivation techniques: Identity and Outcome Motivation.
            <br/><br/>+ 15 <b>essential</b> habits to prime your body and mind for peak performance.
            <br/><br/>+ 3 <b>expert</b> habits to be productive and get things done.
          </p>
          <Link to="/accounts/signup" className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-3',
              layout: 'na'
            });
          }}>
            <span>I Need This</span>
            <span className="icon">
              <i className="fas fa-chevron-right"></i>
            </span>
          </Link>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <SimpleNavbar />
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-two-fifths">
                  {this.renderStep()}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
