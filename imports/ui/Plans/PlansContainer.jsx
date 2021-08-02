import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer';

class Plans extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: 'yearly'
    };

    this.handlePlanChange = this.handlePlanChange.bind(this);
  }

  handlePlanChange(plan) {
    this.setState({
      plan
    });
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <Navbar />
          <div className="hero-body">
            <div className="container">
              <p className="title is-6 has-text-centered">Design a system of habits to become successful.</p>
              <div className="columns is-centered">
                <div className="column is-two-fifths">
                  <p className="has-text-centered mb-4">
                    <span className={this.state.plan === 'monthly' ? 'tag is-link has-pointer is-medium' : 'tag is-light has-pointer is-medium'} onClick={() => this.handlePlanChange('monthly')}>Monthly</span>
                    <span className={this.state.plan === 'yearly' ? 'tag is-link has-pointer is-medium' : 'tag is-light has-pointer is-medium'} onClick={() => this.handlePlanChange('yearly')}>Yearly</span>
                  </p>
                  <div className="box has-text-centered">
                    {this.state.plan === 'monthly' ? (
                      <p className="has-text-centered is-size-4 mb-1"><b>$10</b>/<span className="is-size-5">month</span></p>
                    ) : (
                      <p className="has-text-centered is-size-4 mb-1"><b>$59</b>/<span className="is-size-5">year</span></p>
                    )}
                    <p className="has-text-centered is-size-7 mb-4">7 days for free. Cancel any time.</p>
                    <p className="has-text-centered is-size-7 mb-2"><b>Design</b> a system of habits to get the results that you want.</p>
                    <p className="has-text-centered is-size-7 mb-2">Get <b>extreme clarity</b> around your habits with a simple daily plan.</p>
                    <p className="has-text-centered is-size-7 mb-2"><b>Stick</b> to your system of habits and get the results that you want.</p>
                    <p className="has-text-centered is-size-7 mb-2">+ <b>15 basic</b> habit templates to prime your body and mind for peak performance.</p>
                    <p className="has-text-centered is-size-7 mb-2">+ <b>3 expert</b> habit templates to be productive and get things done.</p>
                    <Link to='/accounts/signup' className="button is-link" onClick={() => {
                      analytics.track('CTA Button Clicked', {
                        type: 'plan',
                        plan: this.state.plan,
                        layout: 'na'
                      });
                    }}>Start My Free 7-Day Trial</Link>
                    <label className="help has-text-centered">No Credit Card Required</label>
                  </div>
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

export default withRouter(Plans);
