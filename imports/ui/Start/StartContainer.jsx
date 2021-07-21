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

    // this.changeStep = this.changeStep.bind(this);
  }

  changeStep = (increment) => {
    this.setState({
      step: this.state.step + increment
    });
  }

  renderStep() {
    const { step } = this.state;

    if (step === 1) {
      return (
        <div className="has-text-centered">
          <h2 className="is-size-4 mb-5">Habits are the <b>compound interest</b> of <br />self-improvement.</h2>
          <a className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-1',
              layout: 'na'
            });
            this.changeStep(1);
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
          <h4 className="is-size-4 mb-3">It's nearly impossible to become successful overnight.</h4>
          <h4 className="is-size-4 mb-5">The goal is to get 1% better <b>every</b> day. This you can do.</h4>
          <a className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-2',
              layout: 'na'
            });
            this.changeStep(1);
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
          <h4 className="is-size-4 mb-3">With <b>consistent</b> improvement. Your health, wealth, and knowledge will compound to great heights.</h4>
          <h4 className="is-size-4 mb-5">You will become <b>successful</b>.</h4>
          <a className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-3',
              layout: 'na'
            });
            this.changeStep(1);
          }}>
            <span>Continue</span>
            <span className="icon">
              <i className="fas fa-chevron-right"></i>
            </span>
          </a>
        </div>
      );
    } else if (step === 4) {
      return (
        <div className="has-text-centered">
          <h4 className="is-size-4 mb-5">Wombo gives you <b>two</b> things. A system of habits to become successful (what to do) and a methodology for sticking to it (doing it consistently).</h4>
          <Link to="/plans" className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-4',
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
                <div className="column is-half">
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
