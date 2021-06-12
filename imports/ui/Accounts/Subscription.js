import React from 'react';
import { Meteor } from 'meteor/meteor';

import LoadingIcon from '../LoadingIcon.js';

export default class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscription: null,
      subscriptionError: '',
      isSubscriptionLoading: true,
    }

    this.fetchSubscription = this.fetchSubscription.bind(this);

    // data

  }

  componentDidMount() {
    // fetch user with stripe info
    Meteor.call('getCurrentUserProfile', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
        this.setState({
          subscriptionError: err.reason,
          isSubscriptionLoading: false
        });
      } else {
        // fetch subscription
        const planId = res.planId;
        this.fetchSubscription(planId);
      }
    });
  }

  fetchSubscription(planId) {
    this.setState({
      isSubscriptionLoading: true
    });
    Meteor.call('getSubscriptionForPlan', planId, (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
        this.setState({
          subscriptionError: err.reason,
          isSubscriptionLoading: false
        });
      } else {
        // console.log('getCurrentUserAccount res: ', res);
        this.setState({
          subscription: res,
          isSubscriptionValid: ['trialing', 'active'].includes(res.status),
          subscriptionError: '',
          isSubscriptionLoading: false
        });
      }
    });
  }

  render() {
    console.log('subscription: ', this.state.subscription);
    console.log('isSubscriptionValid: ', this.state.isSubscriptionValid);

    if (this.state.isSubscriptionLoading) {
      return (
        <LoadingIcon />
      );
    }

    return (
      <div className="columns is-centered">
        <div className="column is-half">
          <p>subscription</p>
        </div>
      </div>
    );
  }
}
