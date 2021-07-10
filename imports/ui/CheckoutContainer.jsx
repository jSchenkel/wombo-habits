import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

import Navbar from './Navbar/Navbar';
import Footer from './Footer';

class _CheckoutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: null,
      // payment form
      name: '',
      email: '',
      // payment state
      isPaymentProcessing: false,
      isPaymentSuccess: false,
      paymentError: '',
      planId: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const plan = this.props.match.params.plan;
    if (plan && ['monthly', 'yearly'].includes(plan)) {
      this.setState({
        plan
      });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      formError: ''
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      plan,
      name,
      email,
      isPaymentProcessing
    } = this.state;

    const { stripe, elements } = this.props;

    // break out of submit if we are still processing. This catches if the user presses "Enter" on keyboard while order is processing
    if (isPaymentProcessing) {
      return;
    }

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return this.setState({paymentError: 'Stripe has not loaded yet. Please try again.'});
    }

    if (name.length === 0) {
      return this.setState({paymentError: 'A name is required.'});
    }
    if (email.length === 0) {
      return this.setState({paymentError: 'An email is required.'});
    }

    this.setState({
      isPaymentProcessing: true,
      paymentError: 'Payment processing. Please do not reload the page.'
    });

    Meteor.call('setupStripeSubscription', plan, name, email, (err, res) => {
      if (err) {
        // console.log('setupStripeSubscription err: ', err);
        return this.setState({
          paymentError: err.reason,
          isPaymentProcessing: false,
          isPaymentSuccess: false
        });
      } else {
        // console.log('setupStripeSubscription res: ', res);
        const clientSecret = res.clientSecret;
        const planId = res.planId;
        const subscriptionId = res.subscriptionId;

        stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${name}`,
            },
          }
        }).then((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            // TODO: add redundancy to handle failed payment via webhook
            Meteor.call('handleFailedSessionPayment', planId, (err, res) => {
              if (err) {
                // console.log('handleFailedSessionPayment err: ', err);
              } else {
                // console.log('handleFailedSessionPayment success');
              }
            });
            this.setState({paymentError: result.error.message, isPaymentSuccess: false, isPaymentProcessing: false});
          } else {
            // The payment has been processed!
            if (result.setupIntent.status === 'succeeded') {
              // Show a success message to your customer
              // There's a risk of the customer closing the window before callback
              // execution. Set up a webhook or plugin to listen for the
              // payment_intent.succeeded event that handles any business critical
              // post-payment actions.

              // TODO: handle successful payments using webhooks. more reliable (can have redundancy where the webhook only calls handle success method if the booking has isPaymentProcessing=True)
              Meteor.call('handleSuccessfulSessionPayment', planId, (err, res) => {
                if (err) {
                  // console.log('handleSuccessfulSessionPayment err: ', err);
                  this.setState({paymentError: `There was a problem while setting up your trial. Please contact support: support@wombo.io. Trial ID: ${planId}`, isPaymentSuccess: false, isPaymentProcessing: false});
                } else {
                  // console.log('handleSuccessfulSessionPayment res: ', res);
                  this.setState({
                    isPaymentProcessing: false,
                    isPaymentSuccess: true,
                    paymentError: '',
                    planId,

                  });

                  analytics.track('Trial Started', {
                    name,
                    email,
                    plan,
                    planId,
                  });
                }
              });
            } else {
              // This should never happen. but adding handling for the edge case anyway
              Meteor.call('handleFailedSessionPayment', planId, (err, res) => {
                if (err) {
                  // console.log('handleFailedSessionPayment err: ', err);
                } else {
                  // console.log('handleFailedSessionPayment success');
                }
              });
              this.setState({paymentError: 'There was a problem while setting up your trial. Please try another payment method.', isPaymentSuccess: false, isPaymentProcessing: false});
            }
          }
        }).catch((result) => {
          // This should never happen. but adding handling for the edge case anyway
          Meteor.call('handleFailedSessionPayment', planId, (err, res) => {
            if (err) {
              // console.log('handleFailedSessionPayment err: ', err);
            } else {
              // console.log('handleFailedSessionPayment success');
            }
          });
          this.setState({paymentError: 'There was a problem while setting up your trial. Please try another payment method.', isPaymentSuccess: false, isPaymentProcessing: false});
        });
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

    const {
      name,
      email,
      plan,
      planId,
      isPaymentSuccess,
      isPaymentProcessing
    } = this.state;
    if (!plan) {
      return (
        <div>
          <section className="hero has-background-white is-fullheight">
            <Navbar />
            <div className="hero-body">
              <div className="container">
                <div className="columns is-centered">
                  <div className="column is-one-third">
                    <div className="box has-text-centered">
                      <p className="is-size-6 mb-3">Invalid plan</p>
                      <Link to="/" className="button is-link">Go back</Link>
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
    if (isPaymentSuccess && !isPaymentProcessing) {
      return (
        <div>
          <section className="hero has-background-white is-fullheight">
            <Navbar />
            <div className="hero-body">
              <div className="container">
                <div className="columns is-centered">
                  <div className="column is-one-third">
                    <div className="box">
                      <div className="media">
                        <div className="media-left">
                          <span className="icon is-large has-text-success">
                            <i className="fas fa-check-circle fa-2x"></i>
                          </span>
                        </div>
                        <div className="media-content">
                          <p className="title is-4">Success</p>
                          <p className="subtitle is-6">You will receive a confirmation email shortly. Trial ID: <b>{planId}</b></p>
                          <Link to={`/accounts/signup?name=${name}&email=${email}&trialId=${planId}`} className="button is-link" onClick={() => {
                            analytics.track('CTA Button Clicked', {
                              type: 'trial-success',
                              name,
                              email,
                              planId,
                              layout: 'na'
                            });
                          }}>Sign Up</Link>
                        </div>
                      </div>
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
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <Navbar />
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-two-fifths">
                  <div className="box">
                    <p className="title is-5">Start Free 14-Day Trial</p>
                    <form onSubmit={this.handleSubmit}>
                      <div className="field">
                        <label className="label is-small">Plan</label>
                        {plan === 'monthly' ? (
                          <p className="is-size-7"><span className="has-text-weight-semibold">Monthly</span>. Billed at $10 for a one-month subscription when 14-day free trial ends. Cancel any time.</p>
                        ) : (
                          <p className="is-size-7"><span className="has-text-weight-semibold">Yearly</span>. Billed at $59 for a one-year subscription when 14-day free trial ends. Cancel any time.</p>
                        )}
                      </div>
                      <div className="field">
                        <label className="label is-small">Name</label>
                        <div className="control">
                          <input className="input is-small" disabled={this.state.isPaymentProcessing} type="text" name="name" value={this.state.name} maxLength="30" placeholder="" onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label is-small">Email</label>
                        <div className="control">
                          <input className="input is-small" disabled={this.state.isPaymentProcessing} type="email" name="email" value={this.state.email} placeholder="" onChange={this.handleInputChange} />
                        </div>
                      </div>
                      <label className="label is-small">Payment</label>
                      <CardElement options={CARD_ELEMENT_OPTIONS} />
                      {this.state.paymentError ? <label className="help is-danger mb-1">{this.state.paymentError}</label> : <br />}
                      <button className={`button is-link is-fullwidth ${this.state.isPaymentProcessing ? 'is-loading' : ''}`} type="submit" disabled={!this.props.stripe || this.state.isPaymentProcessing}>Start Free 14-Day Trial</button>
                      <div className="level is-mobile mt-4">
                        {/* LEFT */}
                        <div className="level-left">
                          <span className="level-item">
                            <img src="/images/ssl_encryption.jpeg" className="image-not-draggable" style={{width: 'auto', height: '50px'}} />
                          </span>
                        </div>
                        {/* RIGHT */}
                        <div className="level-right">
                          <a href="https://www.stripe.com" target="_blank" className="level-item">
                            <img src="/images/powered_by_stripe.png" className="image-not-draggable" style={{width: 'auto', height: '30px'}} />
                          </a>
                        </div>
                      </div>
                    </form>
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

const CheckoutContainer = (props) => {
  // need to wrap the class component _CheckoutContainer in ElementsConsumer and pass the elements and stripe props
  return (
    <ElementsConsumer>
      {({elements, stripe}) => (
        <_CheckoutContainer
          {...props}
          // stripe stuff
          elements={elements}
          stripe={stripe}
        />
      )}
    </ElementsConsumer>
  )
}

export default withRouter(
  CheckoutContainer
);
