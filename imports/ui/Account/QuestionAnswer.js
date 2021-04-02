import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';

import LoadingIcon from '../LoadingIcon.js';
import InfoTooltip from '../blocks/InfoTooltip.js';

import { calculatePlatformFee, convertDollarsToCents, convertCentsToDollars, makeDollarFeeDisplayable } from '../../helpers/payments.js';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getError: '',
      aboutError: '',
      questionRate: 0,
      isStripeSetup: false,
      accountLoaded: false,
      isSavingAbout: false,
      isAboutSaved : false
    }

    this.fetchUserQuestionSettings = this.fetchUserQuestionSettings.bind(this);
    this.handleAboutSubmit = this.handleAboutSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.fetchUserQuestionSettings()
  }

  fetchUserQuestionSettings() {
    this.setState({
      accountLoaded: false
    });
    Meteor.call('getCurrentUserQuestionSettings', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
        this.setState({
          getError: err.reason
        });
      } else {
        // console.log('getCurrentUserAccount res: ', res);
        if (res) {
          this.setState({
            questionRate: res.questionRate,
            isStripeSetup: res.isStripeSetup,
            accountLoaded: true
          });
        }
      }
    });
  }

  handleAboutSubmit(event) {
    event.preventDefault();
    const questionRate = this.state.questionRate ? parseInt(this.state.questionRate) : 0;

    if (this.state.isAboutSaved) {
      return;
    }

    if (questionRate && questionRate < 2) {
      return this.setState({
        aboutError: 'The minimum amount you can charge for a question is $2.'
      });
    }

    if (questionRate && questionRate > 1000) {
      return this.setState({
        aboutError: 'The maximum amount you can charge for a question is $1,000.'
      });
    }

    this.setState({
      isSavingAbout: true
    });

    Meteor.call('updateCurrentUserQuestionSettings', questionRate, (err, res) => {
      if (err) {
        // console.log('updateCurrentUserProfile err: ', err);
        this.setState({aboutError: err.reason, isSavingAbout: false, isAboutSaved: false});
      } else {
        this.setState({
          aboutError: '',
          isSavingAbout: false,
          isAboutSaved: true
        });
      }
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      isAboutSaved: false
    });
  }

  render() {
    if (this.state.accountLoaded) {
      const questionRate = this.state.questionRate;
      let totalRateHelpText = null;
      if (questionRate && questionRate > 0) {
        const feeInDollars = questionRate;
        const feeInCents = convertDollarsToCents(feeInDollars);
        const platformFee = calculatePlatformFee(feeInCents);
        const totalFee = feeInCents + platformFee;
        const totalFeeInDollars = convertCentsToDollars(totalFee);
        const finalFee = makeDollarFeeDisplayable(totalFeeInDollars);

        const tooltipText = (
          <span>
            Price Breakdown:<br />
            Rate (${feeInDollars})<br />
            Platform fee (${makeDollarFeeDisplayable(convertCentsToDollars(platformFee))})
          </span>
        );

        totalRateHelpText = (
          <label className="help mb-1">The total amount charged for a question: ${finalFee} <InfoTooltip text={tooltipText} iconSize="is-small" /></label>
        );
      }

      const saveButton = this.state.isSavingAbout ? (
       <div className="field">
         <div className="control">
           <button className="button is-link is-loading">Save</button>
         </div>
       </div>
      ) : (
        <div className="field">
          <div className="control">
            <button className="button is-link" type="submit" disabled={!this.state.isStripeSetup}>Save</button>
          </div>
        </div>
      );

      return (
        <div className="columns is-centered">
          <div className="column is-three-quarters">
            {!this.state.isStripeSetup ? (
              <div className="notification is-warning">
                Set up banking to start earning on Wombo
              </div>
            ) : null}
            {this.state.getError ? <label className="help is-danger">{this.state.getError}</label> : null}
            <form onSubmit={this.handleAboutSubmit}>
              <p className="is-size-7 has-text-grey has-text-weight-semibold">Question & Answer</p>
              <p className="is-size-7 has-text-grey mb-2">Receive questions from your audience and respond with personalized audio messages.</p>
              <div className="level is-mobile mb-2">
                <div className="level-left">
                  <div className="level-item">
                    <label className="label">Rate</label>
                  </div>
                </div>
                <div className="level-right">
                </div>
              </div>
              {totalRateHelpText}
              <div className="field has-addons mb-0">
                <div className="control">
                  <div className="select">
                    <select value="$" readOnly disabled={!this.state.isStripeSetup}>
                      <option value="$">$</option>
                    </select>
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="number" min="0" step="1" name="questionRate" value={this.state.questionRate} placeholder="" onChange={this.handleInputChange} disabled={!this.state.isStripeSetup} />
                </div>
              </div>
              <p className="is-size-7 has-text-grey mb-2">If you don't want to charge for questions you can set the rate to $0.</p>

              {this.state.isAboutSaved ? <label className="help is-success">Saved!</label> : null}
              {this.state.aboutError ? <label className="help is-danger">{this.state.aboutError}</label> : null}
              {saveButton}
            </form>
          </div>
        </div>
      );
    }

    return (
      <LoadingIcon />
    );
  }
}
