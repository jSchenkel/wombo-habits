import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer.js';

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
              <p className="title is-6 has-text-centered">Get better every day and become successful.</p>
              <div className="columns is-centered">
                <div className="column is-one-third">
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
                    <p className="has-text-centered is-size-7 mb-4">14 days for free. Cancel anytime.</p>
                    <p className="has-text-centered is-size-7 has-text-weight-semibold mb-2">Design a system of habits to become successful</p>
                    <p className="has-text-centered is-size-7 has-text-weight-semibold mb-2">Template habits to prime your body and mind for peak performance</p>
                    <p className="has-text-centered is-size-7 has-text-weight-semibold mb-2">Template habits to maximize productivity</p>
                    <p className="has-text-centered is-size-7 has-text-weight-semibold mb-2">Create custom habits</p>
                    <p className="has-text-centered is-size-7 has-text-weight-semibold mb-2">Daily todo's with progress tracker</p>
                    <p className="has-text-centered is-size-7 has-text-weight-semibold mb-4">Daily motivation and streaks </p>
                    <Link to={`/trial/${this.state.plan}`} className="button is-link" onClick={() => {
                      analytics.track('CTA Button Clicked', {
                        type: 'plan',
                        plan: this.state.plan,
                        layout: 'na'
                      });
                    }}>Start My Free 14-Day Trial</Link>
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
