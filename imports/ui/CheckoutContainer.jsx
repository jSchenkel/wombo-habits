import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

import LoggedInNavbar from './Navbar/LoggedInNavbar';
import Footer from './Footer';

class _CheckoutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: 'yearly',
      // payment form
      name: '',
      email: '',
      // payment state
      isPaymentProcessing: false,
      isPaymentSuccess: false,
      paymentError: '',
      planId: '',
      // user profile state
      isUserProfileLoading: true,
      userProfileError: ''
    }

    this.handlePlanChange = this.handlePlanChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // get current user profile
    Meteor.call('getCurrentUserProfile', (err, res) => {
      if (err) {
        this.setState({
          isUserProfileLoading: false,
          userProfileError: err.reason
        });
      } else {
        this.setState({
          name: res.name,
          email: res.email,
          isUserProfileLoading: false,
          userProfileError: ''
        });
      }
    });
  }

  handlePlanChange(plan) {
    this.setState({
      plan
    });
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

        stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name,
              email
            },
          }
        }).then((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            // TODO: add redundancy to handle failed payment via webhook
            Meteor.call('handleFailedSessionPayment', planId, result.error.message, (err, res) => {
              if (err) {
                // console.log('handleFailedSessionPayment err: ', err);
              } else {
                // console.log('handleFailedSessionPayment success');
              }
            });
            this.setState({paymentError: result.error.message, isPaymentSuccess: false, isPaymentProcessing: false});
          } else {
            // Successful subscription payment
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.

            // TODO: handle successful payments using webhooks. more reliable (can have redundancy where the webhook only calls handle success method if the booking has isPaymentProcessing=True)
            Meteor.call('handleSuccessfulSessionPayment', planId, (err, res) => {
              if (err) {
                // console.log('handleSuccessfulSessionPayment err: ', err);
                this.setState({paymentError: `There was a problem while setting up your subscription. Please contact support: support@wombo.io. Subscription ID: ${planId}`, isPaymentSuccess: false, isPaymentProcessing: false});
              } else {
                // console.log('handleSuccessfulSessionPayment res: ', res);
                this.setState({
                  isPaymentProcessing: false,
                  isPaymentSuccess: true,
                  paymentError: '',
                  planId,
                });

                analytics.track('Subscription Started', {
                  name,
                  email,
                  plan,
                  planId,
                });
              }
            });
          }
        }).catch((result) => {
          const errorMessage = 'There was a problem while setting up your subscription. Please try another payment method.';
          
          // This should never happen. but adding handling for the edge case anyway
          Meteor.call('handleFailedSessionPayment', planId, errorMessage, (err, res) => {
            if (err) {
              // console.log('handleFailedSessionPayment err: ', err);
            } else {
              // console.log('handleFailedSessionPayment success');
            }
          });
          this.setState({paymentError: errorMessage, isPaymentSuccess: false, isPaymentProcessing: false});
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
            <LoggedInNavbar />
            <div className="hero-body">
              <div className="container">
                <div className="columns is-centered">
                  <div className="column is-one-third">
                    <div className="box has-text-centered">
                      <p className="is-size-6 mb-3">Invalid plan</p>
                      <Link to="/home" className="button is-link">Go back</Link>
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
            <LoggedInNavbar />
            <div className="hero-body">
              <div className="container">
                <div className="columns is-centered">
                  <div className="column is-half">
                    <div className="box">
                      <div className="media">
                        <div className="media-left">
                          <span className="icon is-large has-text-success">
                            <i className="fas fa-check-circle fa-2x"></i>
                          </span>
                        </div>
                        <div className="media-content">
                          <p className="title is-4">Success!</p>
                          <p className="subtitle is-6">Thank you for subscribing. You will receive a confirmation email shortly. We are here to help you build good habits and get the results that you want. Send us an email at any time: contact@wombo.io</p>
                          <Link to='/home' className="button is-link">Home</Link>
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
          <LoggedInNavbar />
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-two-fifths">
                  <p className="has-text-centered mb-4">
                    <span className={this.state.plan === 'monthly' ? 'tag is-link has-pointer is-medium' : 'tag is-light has-pointer is-medium'} onClick={() => this.handlePlanChange('monthly')}>Monthly</span>
                    <span className={this.state.plan === 'yearly' ? 'tag is-link has-pointer is-medium' : 'tag is-light has-pointer is-medium'} onClick={() => this.handlePlanChange('yearly')}>Yearly</span>
                  </p>
                  <div className="box">
                    <form onSubmit={this.handleSubmit}>
                      <div className="field">
                        <label className="label is-small">Plan</label>
                        {plan === 'monthly' ? (
                          <p className="is-size-7"><span className="has-text-weight-semibold">Monthly</span>. Billed at $10 for a one-month subscription. Cancel any time.</p>
                        ) : (
                          <p className="is-size-7"><span className="has-text-weight-semibold">Yearly</span>. Billed at $59 for a one-year subscription. Cancel any time.</p>
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
                      <button className={`button is-link is-fullwidth ${this.state.isPaymentProcessing ? 'is-loading' : ''}`} type="submit" disabled={!this.props.stripe || this.state.isPaymentProcessing}>Subscribe</button>
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
