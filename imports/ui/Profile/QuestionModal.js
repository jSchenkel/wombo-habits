import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { withRouter } from 'react-router';

import moment from 'moment';

import LoadingIcon from '../LoadingIcon.js';
import InfoTooltip from '../blocks/InfoTooltip.js';

import { getTotalFee, convertDollarsToCents, convertCentsToDollars, makeDollarFeeDisplayable } from '../../helpers/payments.js';

class BookingDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      description: '',
      phone: '',
      agreesToTerms: false,
      formError: '',
      // payment intent state
      isLoading: false,
      error: '',
      // payment charge state
      isPaymentProcessing: false,
      isPaymentSuccess: false,
      // on success data
      // order #
      questionId: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // console.log('name: ', value);

    this.setState({
      [name]: value,
      formError: ''
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      firstname,
      lastname,
      email,
      description,
      phone,
      agreesToTerms,
      isPaymentProcessing
    } = this.state;

    const { stripe, elements, username, profile } = this.props;

    const creatorId = profile._id;
    const questionRate = profile.questionRate;

    // break out of submit if we are still processing. This catches if the user presses "Enter" on keyboard while order is processing
    if (isPaymentProcessing) {
      return;
    }

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return this.setState({formError: 'Stripe has not loaded yet. Please try again.'});
    }

    if (firstname.length === 0) {
      return this.setState({formError: 'A first name is required.'});
    }
    if (lastname.length === 0) {
      return this.setState({formError: 'A last name is required.'});
    }
    if (email.length === 0) {
      return this.setState({formError: 'An email is required.'});
    }
    if (description.length === 0) {
      return this.setState({formError: 'Please enter what a question.'});
    }
    if (description.length > 300) {
      return this.setState({formError: 'Question can not exceed 300 characters.'});
    }
    if (!agreesToTerms) {
      return this.setState({formError: 'Please confirm that you agree to the Terms of Use.'});
    }

    this.setState({
      isPaymentProcessing: true,
      formError: 'Processing. Please do not reload the page.'
    });

    // TODO: right now if the payment fails and the user tries again, we would create a new payment intent and booking document, but it would fail because we'd think the time is already taken (unless we succesfully called handleFailedQuestionPayment)
    Meteor.call('getStripePaymentIntentForQuestion', this.props.profile._id, firstname, lastname, email, description, phone, agreesToTerms, (err, res) => {
      if (err) {
        console.log('getStripePaymentIntentForQuestion err: ', err);
        return this.setState({
          formError: err.reason,
          isPaymentProcessing: false,
          isPaymentSuccess: false
        });
      } else {
        // console.log('getStripePaymentIntentForQuestion res: ', res);
        // if the question doesnt require payment then we dont need to actually make the payment so skip the payment logic below (we treat it as if payment has already been completed)

        const client_secret = res.client_secret;
        const questionId = res.questionId;
        const isPaidQuestion = res.isPaidQuestion;

        if (isPaidQuestion) {
          stripe.confirmCardPayment(client_secret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${firstname} ${lastname}`,
              },
            }
          }).then((result) => {
            if (result.error) {
              // Show error to your customer (e.g., insufficient funds)
              // TODO: add redundancy to handle failed payment via webhook
              Meteor.call('handleFailedQuestionPayment', questionId, (err, res) => {
                if (err) {
                  console.log('handleFailedQuestionPayment err: ', err);
                } else {
                  // console.log('handleFailedQuestionPayment success');
                }
              });
              this.setState({formError: result.error.message, isPaymentSuccess: false, isPaymentProcessing: false});
            } else {
              // The payment has been processed!
              if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.

                // TODO: handle successful payments using webhooks. more reliable (can have redundancy where the webhook only calls handle success method if the booking has isPaymentProcessing=True)
                Meteor.call('handleSuccessfulQuestionPayment', questionId, result.paymentIntent.id, (err, res) => {
                  if (err) {
                    console.log('handleSuccessfulQuestionPayment err: ', err);
                    this.setState({formError: `There was a problem while completing your order. Please contact support: support@wombo.io. Order #${questionId}`, isPaymentSuccess: false, isPaymentProcessing: false});
                  } else {
                    // console.log('handleSuccessfulQuestionPayment successs', res);
                    this.setState({
                      isPaymentProcessing: false,
                      isPaymentSuccess: true,
                      formError: '',
                      questionId
                    });

                    analytics.track('Question submitted', {
                      username,
                      questionId,
                      isPaid: isPaidQuestion,
                      price: questionRate
                    });
                  }
                });
              } else {
                // This should never happen. but adding handling for the edge case anyway
                Meteor.call('handleFailedQuestionPayment', questionId, (err, res) => {
                  if (err) {
                    console.log('handleFailedQuestionPayment err: ', err);
                  } else {
                    // console.log('handleFailedQuestionPayment success');
                  }
                });
                this.setState({formError: 'There was issue while processing your payment. Please try another payment method.', isPaymentSuccess: false, isPaymentProcessing: false});
              }
            }
          }).catch((result) => {
            // This should never happen. but adding handling for the edge case anyway
            Meteor.call('handleFailedQuestionPayment', questionId, (err, res) => {
              if (err) {
                console.log('handleFailedQuestionPayment err: ', err);
              } else {
                // console.log('handleFailedQuestionPayment success');
              }
            });
            this.setState({formError: 'There was issue while processing your payment. Please try another payment method.', isPaymentSuccess: false, isPaymentProcessing: false});
          });
        } else {
          // not paid question case. we dont try to charge the card. instead go straight to success
          this.setState({
            isPaymentProcessing: false,
            isPaymentSuccess: true,
            formError: '',
            questionId
          });

          analytics.track('Question submitted', {
            username,
            questionId,
            isPaid: isPaidQuestion,
            price: questionRate
          });
        }
      }
    });
  }

  render() {
    const CARD_ELEMENT_OPTIONS = {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    };

    const profile = this.props.profile;
    const questionRate = profile.questionRate ? profile.questionRate : 0;

    // Get rate
    const rateInCents = convertDollarsToCents(questionRate);
    const totalFeeInCents = getTotalFee(rateInCents);
    const totalFeeInDollars = convertCentsToDollars(totalFeeInCents);
    const totalFeeFormatted = makeDollarFeeDisplayable(totalFeeInDollars);

    if (this.state.isPaymentSuccess) {
      return (
        <div className="box">
          <div className="media mb-5">
            <div className="media-left">
              <span className="icon is-large has-text-success">
                <i className="fas fa-check-circle fa-2x"></i>
              </span>
            </div>
            <div className="media-content">
              {/* Your session with {this.props.profile.name} is booked! */}
              <p className="title is-4">Question submitted (#{this.state.questionId})</p>
              <p className="subtitle is-6">You'll receive an email notification when {this.props.profile.name} has submitted an answer to your question.</p>
              {/* NOTE: can delight user with a fun animation or satisfying image here. */}
              <p>Thank you for using Wombo!</p>
            </div>
          </div>
          <button className="button is-light is-justify-content-flex-end" onClick={this.props.handleModalClose}>Close</button>
        </div>
      );
    }

    return (
      <div className="box">
        <div className="columns">
          <div className="column is-one-third">
            <div className="image is-48x48 mb-2">
              <img className="is-rounded image-not-draggable" style={{ border: '1px solid lightgray' }} src={this.props.profile.profilePictureImageUrl ? this.props.profile.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
            </div>
            <p className="has-text-weight-semibold is-size-5">{this.props.profile.name}</p>
            <hr />
            <p className="is-size-7 has-text-grey has-text-weight-semibold">Question & Answer</p>
            <p className="is-size-7 has-text-grey overflow-y-scroll" style={{ maxHeight: '5rem'}}>Ask a question and receive a personalized answer recorded as an audio message.</p>
            <br />
            <p className="is-size-7 has-text-grey has-text-weight-semibold">Price</p>
            <p className="has-text-weight-semibold is-size-6">${totalFeeFormatted}</p>
          </div>
          <div className="column">
            <p className="title is-6 mb-2">Question Details</p>
            <form onSubmit={this.handleSubmit}>
              <div className="columns mb-0 mt-2">
                <div className="column is-half pt-0">
                  <div className="field">
                    <label className="label is-small">First name</label>
                    <div className="control">
                      <input className="input is-small" disabled={this.state.isPaymentProcessing} type="text" name="firstname" value={this.state.firstname} maxLength="30" placeholder="" onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className="column is-half pt-0">
                  <div className="field">
                    <label className="label is-small">Last name</label>
                    <div className="control">
                      <input className="input is-small" disabled={this.state.isPaymentProcessing} type="text" name="lastname" value={this.state.lastname} maxLength="30" placeholder="" onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label is-small">Email address</label>
                <div className="control">
                  <input className="input is-small" disabled={this.state.isPaymentProcessing} type="email" name="email" value={this.state.email} placeholder="" onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="field">
                <label className="label is-small">
                  <span className="mr-1">What's your question?</span>
                  <InfoTooltip text="Hint: A more specific question gets a more specific answer." iconSize="is-small" />
                </label>
                <div className="control">
                  <textarea className="textarea is-small has-fixed-size" disabled={this.state.isPaymentProcessing} name="description" rows="2" value={this.state.description} placeholder="" onChange={this.handleInputChange}></textarea>
                </div>
                {this.state.description && this.state.description.length > 300 ? <label className="help is-danger mb-1">Question can not exceed 300 characters.</label> : null}
              </div>
              {/* <div className="field">
                <label className="label">Phone number to receive notifications (Recommended) <span>Tooltip</span></label>
                <div className="control">
                  <input className="input" type="phone" name="phone" value={this.state.phone} placeholder="" onChange={this.handleInputChange} />
                </div>
              </div> */}
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input type="checkbox" name="agreesToTerms" value={this.state.agreesToTerms} className="mr-2" disabled={this.state.isPaymentProcessing} onChange={this.handleInputChange} />
                    I agree to the <Link to="/legal/terms" target="_blank">Terms of Use</Link>
                  </label>
                </div>
              </div>
              {questionRate ? (
                <div>
                  <label className="label is-small">Payment</label>
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              ) : null}
              {this.state.formError ? <label className="help is-danger mb-1">{this.state.formError}</label> : <br />}
              <div className="level is-mobile">
                <div className="level-left">
                  <div className="level-item">
                    <div className="field">
                      <div className="control">
                        <button className={`button is-link ${this.state.isPaymentProcessing ? 'is-loading' : ''}`} type="submit" disabled={!this.props.stripe || this.state.isPaymentProcessing}>Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="level-right">
                  <button className="button is-light" disabled={this.state.isPaymentProcessing} onClick={this.props.handleModalClose}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BookingDetailsModal);
