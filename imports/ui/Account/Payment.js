import React from 'react';
import { Meteor } from 'meteor/meteor';

import LoadingIcon from '../LoadingIcon.js';

export default class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountLinkType: '',
      url: '',
      isLoading: true,
      error: ''
    }
  }

  componentDidMount() {
    // fetch user
    // in callback, if
    Meteor.call('getUserStripeAccountLink', (err, res) => {
      if (err) {
        console.log('getUserStripeAccountLink err: ', err);
        this.setState({
          accountLinkType: '',
          url: '',
          isLoading: false,
          error: err.reason
        });
      } else {
        console.log('res: ', res);
        this.setState({
          accountLinkType: res.accountLinkType,
          url: res.url,
          isLoading: false,
          error: ''
        });
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="mt-6 mb-6">
          <LoadingIcon />
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div className="columns is-centered mt-6 mb-6">
          <div className="column is-three-quarters has-text-centered">
            <label className="help is-danger">{this.state.error}</label>
          </div>
        </div>
      );
    }

    let stripeInfo = (
      <div className="column is-three-quarters has-text-centered">
        <p className="title is-4">Something went wrong.</p>
        <p className="subtitle is-6">Contact support@wombo.io if the issue continues.</p>
      </div>
    )
    if (this.state.accountLinkType === 'dashboard') {
      stripeInfo = (
        <div className="column is-three-quarters has-text-centered">
          <p className="title is-4">View earnings and manage banking</p>
          <p className="subtitle is-6">Wombo partners with Stripe to transfer earnings to your bank account.</p>
          <div>
            <a href={this.state.url} className="button is-link">Manage banking</a>
          </div>
          <br />
          <label className="help">You'll be redirected to Stripe to view your dashboard.</label>
        </div>
      );
    } else if (this.state.accountLinkType === 'account_onboarding') {
      stripeInfo = (
        <div className="column is-three-quarters has-text-centered">
          <p className="title is-4">Set up banking to start earning on Wombo</p>
          <p className="subtitle is-6">Wombo partners with Stripe to transfer earnings to your bank account.</p>
          <div>
            <a href={this.state.url} className="button is-link">Set up banking</a>
          </div>
          <br />
          <label className="help">You'll be redirected to Stripe to complete the onboarding process.</label>
        </div>
      );
    }

    return (
      <div className="columns is-centered mt-6 mb-6">
        {stripeInfo}
      </div>
    );
  }
}
