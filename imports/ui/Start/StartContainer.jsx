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
          <p className="title is-4">Good habits are the key to all success.</p>
          <p className="subtitle is-6">
            Good habits make you better and get you closer to the <b>results</b> that you want.
          </p>
          <figure className="image mb-2" style={{height: '256px', width: '256px', margin: '0 auto'}}>
            <img src="/images/tiny-gains-graph.jpg" />
          </figure>
          <p className="subtitle is-6">Get 1% better every day and you will be <b>37x</b> better in a year. Habits are the compound interest of self-improvement.
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
          <p className="title is-4">How to build good habits.</p>
          <p className="subtitle is-6">
            Many people think that they lack motivation when what they really lack is <b>clarity</b>.
          </p>
          <p className="subtitle is-6">
            They rely on motivation, thinking, "I wonder if I will <b>feel</b> motivated to do X today?"
          </p>
          <p className="subtitle is-6">
            A simple <b>plan</b> takes the decision making out of it and is the most effective way to build good habits that stick.
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
          <p className="title is-4">With Wombo you will...</p>
          <p className="subtitle is-6">
            <b>Design</b> a system of habits to get the results that you want.
            <br/><br/>Get <b>extreme clarity</b> around your habits with a simple daily plan.
            <br/><br/><b>Stick</b> to your system of habits and get the results that you want.
            <br/><br/>+ <b>15 basic</b> habit templates to prime your body and mind for peak performance.
            <br/><br/>+ <b>3 expert</b> habit templates to be productive and get things done.
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
