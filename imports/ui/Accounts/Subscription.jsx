import React from 'react';
import { Meteor } from 'meteor/meteor';

import LoadingIcon from '../LoadingIcon';

export default class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // account status
      accountStatus: '',
      accountStatusLoading: true, 
      accountStatusError: '',
    }
  }

  componentDidMount() {
    // get user account status
    Meteor.call('getCurrentUserAccountStatus', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccountStatus err: ', err);
        this.setState({
            accountStatus: '',
            accountStatusLoading: false,
            accountStatusError: err.reason
          });
      } else {
        if (res) {
          // console.log('getCurrentUserAccountStatus res: ', res);
          // determine status:
          // trial_active -> valid (no modal)
          // trial_expired -> invalid, create new subscription (yes modal)
          // plan_active -> valid (no modal)
          // plan_inactive -> invalid, create new subscription (yes modal)
          this.setState({
            accountStatus: res,
            accountStatusLoading: false,
            accountStatusError: ''
          });
        }
      }
    });
  }

  render() {
    // console.log('subscription: ', this.state.subscription);
    // console.log('isSubscriptionValid: ', this.state.isSubscriptionValid);

    if (this.state.accountStatusLoading) {
      return (
        <LoadingIcon />
      );
    }

    return (
      <div className="columns is-centered">
        <div className="column is-half">
          {this.state.accountStatusError ? <p className="help is-danger">{this.state.accountStatusError}</p> : null}
          {this.state.accountStatus ? <p className="has-text-centered">Account status: <span className="has-text-weight-semibold">{this.state.accountStatus.replace('_', ' ')}</span></p> : null}
        </div>
      </div>
    );
  }
}
