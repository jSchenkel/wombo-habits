import React from 'react';
import { Meteor } from 'meteor/meteor';

import SimpleNavbar from '../Navbar/SimpleNavbar.js';
import Footer from '../Footer.js';

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
          <h2 className="is-size-4 mb-5">Everyone is playing a game and you want to <b>win</b> the game.</h2>
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
          <h4 className="is-size-4 mb-3">To win the game you need to treat yourself like an <b>athlete</b> competing in the Olympics.</h4>
          <h4 className="is-size-4 mb-5">To win the game you need to play at <b>peak performance</b>.</h4>
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
          <h4 className="is-size-4 mb-3">Novice athletes make <b>repeated</b> mistakes.</h4>
          <h4 className="is-size-4 mb-5">Wombo gives you a system of habits to avoid mistakes, play at peak performance, and become <b>successful</b>.</h4>
          <Link to="/accounts/signup" className="button is-link" onClick={() => {
            analytics.track('CTA Button Clicked', {
              type: 'start-3',
              layout: 'na'
            });
          }}>
            <span>I'm Ready</span>
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
