import React from 'react';
import { Meteor } from 'meteor/meteor';

import SimpleNavbar from '../Navbar/SimpleNavbar';
import Footer from '../Footer';

import { Link } from 'react-router-dom';

import { arrayToCommaSeparatedString } from '../../helpers/utils.js';

export default class AccountStatusModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountStatus: '',
      accountStatusLoading: true,
      accountStatusError: ''
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
          // TODO: can add hooks to this component so that parents can know what happened (i.e. onLoad(accountStatus))
        }
      }
    });
  }


  render() {
    const {accountStatusLoading, accountStatus} = this.state;

    if (accountStatusLoading) {
      return null;
    } else if (accountStatus === 'trial_active' || accountStatus === 'plan_active') {
      return null;
    } else if (accountStatus === 'trial_expired') {
      return (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box" style={{minHeight: '20rem'}}>
              <p className="title is-3">Your Free Trial Has Ended</p>
              <p className="subtitle is-6">
                We hope that you enjoyed the free trial. With Wombo you:
              </p>
              <div className="content">
                <ol>
                  <li>Designed a system of habits to get the results that you want.</li>
                  <li>Completed your habits with a simple daily plan.</li>
                  {this.props.identity && this.props.outcomes ? (
                      <li>Started to become a {this.props.identity} and achieve {arrayToCommaSeparatedString(this.props.outcomes)}.</li>
                    ) : (
                      <li>Stuck to your good habits and made progress towards getting the results that you want.</li>
                    )
                  }
                </ol>
              </div>
              <p className="subtitle is-6">
                The real value of good habits comes when done consistently and repeatedly. If you would like to keep your system of habits and continue using Wombo then click below.
              </p>
              <Link to='/subscribe' className="button is-link" onClick={() => {
                analytics.track('Subscribe Clicked', {
                  accountStatus
                });
              }}>
                <span>Continue</span>
                <span className="icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      );
    } 
    // TODO: implement this flow later. update payment method or cancel and create a new subscription?
    // else if (accountStatus === 'plan_inactive') {
    //   return (
    //     <div className="modal is-active">
    //       <div className="modal-background"></div>
    //       <div className="modal-content">
    //         <div className="box" style={{minHeight: '20rem'}}>
    //           <p className="title is-3">Plan Inactive</p>
    //           <p className="subtitle is-6">
    //             Your most recent payment failed. Please update your payment method.
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    return null;
  }
}
