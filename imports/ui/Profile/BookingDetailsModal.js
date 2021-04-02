import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { withRouter } from 'react-router';

import AddToCalendar from 'react-add-to-calendar';
import moment from 'moment';

import 'react-add-to-calendar/dist/react-add-to-calendar.css';

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
      bookingId: '',
      roomId: '',
      customerSessionAccessCode: ''
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

    const { stripe, elements, selectedTime, customerTimezone, username } = this.props;

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
      return this.setState({formError: 'Please enter what you would like the call to be about.'});
    }
    if (!agreesToTerms) {
      return this.setState({formError: 'Please confirm that you agree to the Terms of Use.'});
    }

    this.setState({
      isPaymentProcessing: true,
      formError: 'Payment processing. Please do not reload the page.'
    });

    // TODO: right now if the payment fails and the user tries again, we would create a new payment intent and booking document, but it would fail because we'd think the time is already taken (unless we succesfully called handleFailedSessionPayment)
    Meteor.call('getStripePaymentIntentForProduct', this.props.selectedProduct._id, firstname, lastname, email, description, phone, agreesToTerms, selectedTime, customerTimezone, (err, res) => {
      if (err) {
        console.log('getStripePaymentIntentForProduct err: ', err);
        return this.setState({
          formError: err.reason,
          isPaymentProcessing: false,
          isPaymentSuccess: false
        });
      } else {
        // console.log('getStripePaymentIntentForProduct res: ', res);
        const client_secret = res.client_secret;
        const bookingId = res.bookingId;
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
            Meteor.call('handleFailedSessionPayment', bookingId, (err, res) => {
              if (err) {
                console.log('handleFailedSessionPayment err: ', err);
              } else {
                // console.log('handleFailedSessionPayment success');
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
              Meteor.call('handleSuccessfulSessionPayment', bookingId, result.paymentIntent.id, (err, res) => {
                if (err) {
                  console.log('handleSuccessfulSessionPayment err: ', err);
                  this.setState({formError: `There was a problem while completing your order. Please contact support: support@wombo.io. Order #${bookingId}`, isPaymentSuccess: false, isPaymentProcessing: false});
                } else {
                  // console.log('handleSuccessfulSessionPayment successs', res);
                  this.setState({
                    isPaymentProcessing: false,
                    isPaymentSuccess: true,
                    formError: '',
                    bookingId,
                    roomId: res.roomId,
                    customerSessionAccessCode: res.customerSessionAccessCode
                  });

                  analytics.track('Profile Session Booked', {
                    username,
                    productId: this.props.selectedProduct._id,
                    productTitle: this.props.selectedProduct.title
                  });
                }
              });
            } else {
              // This should never happen. but adding handling for the edge case anyway
              Meteor.call('handleFailedSessionPayment', bookingId, (err, res) => {
                if (err) {
                  console.log('handleFailedSessionPayment err: ', err);
                } else {
                  // console.log('handleFailedSessionPayment success');
                }
              });
              this.setState({formError: 'There was issue while processing your payment. Please try another payment method.', isPaymentSuccess: false, isPaymentProcessing: false});
            }
          }
        }).catch((result) => {
          // This should never happen. but adding handling for the edge case anyway
          Meteor.call('handleFailedSessionPayment', bookingId, (err, res) => {
            if (err) {
              console.log('handleFailedSessionPayment err: ', err);
            } else {
              // console.log('handleFailedSessionPayment success');
            }
          });
          this.setState({formError: 'There was issue while processing your payment. Please try another payment method.', isPaymentSuccess: false, isPaymentProcessing: false});
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

    const selectedProduct = this.props.selectedProduct;
    // console.log('selectedProduct: ', selectedProduct);

    // Get rate
    const rateInCents = convertDollarsToCents(selectedProduct.rate);
    const totalFeeInCents = getTotalFee(rateInCents);
    const totalFeeInDollars = convertCentsToDollars(totalFeeInCents);
    const totalFeeFormatted = makeDollarFeeDisplayable(totalFeeInDollars);

    if (this.props.isSelectedProductAvailabilityLoading) {
      return (
        <div className="box">
          <div className="columns">
            <div className="column is-one-third">
              <div className="image is-48x48 mb-2">
                <img className="is-rounded image-not-draggable" style={{ border: '1px solid lightgray' }} src={this.props.profile.profilePictureImageUrl ? this.props.profile.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
              </div>
              <p className="has-text-weight-semibold is-size-5">{this.props.profile.name}</p>
              <hr />
              <p className="is-size-7 has-text-grey has-text-weight-semibold">Service</p>
              <p className="has-text-weight-semibold is-size-6">{selectedProduct.title} <span className="has-text-grey">({selectedProduct.duration}mins)</span></p>
              <p className="is-size-7 has-text-grey overflow-y-scroll" style={{ maxHeight: '5rem'}}>{selectedProduct.description}</p>
              <br />
              <p className="is-size-7 has-text-grey has-text-weight-semibold">Price</p>
              <p className="has-text-weight-semibold is-size-6">${totalFeeFormatted}</p>
            </div>
            <div className="column">
              <LoadingIcon />
            </div>
          </div>
        </div>
      );
    } else if (this.props.isSelectedProductAvailabilityError) {
      return (
        <div className="box">
          <p className="title is-size-5 has-text-weight-semibold">{selectedProduct.title}</p>
          <p className="has-text-weight-semibold has-text-danger mb-3">Something went wrong: {this.props.selectedProductAvailabilityError}</p>
          <button className="button is-link" onClick={this.props.handleModalClose}>Back</button>
        </div>
      );
    } else if (this.state.isLoading) {
      return (
        <div className="box">
          <div className="columns">
            <div className="column is-one-third">
              <div className="image is-48x48 mb-2">
                <img className="is-rounded image-not-draggable" style={{ border: '1px solid lightgray' }} src={this.props.profile.profilePictureImageUrl ? this.props.profile.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
              </div>
              <p className="has-text-weight-semibold is-size-5">{this.props.profile.name}</p>
              <hr />
              <p className="is-size-7 has-text-grey has-text-weight-semibold">Service</p>
              <p className="has-text-weight-semibold is-size-6">{selectedProduct.title} <span className="has-text-grey">({selectedProduct.duration}mins)</span></p>
              <p className="is-size-7 has-text-grey overflow-y-scroll" style={{ maxHeight: '5rem'}}>{selectedProduct.description}</p>
              <br />
              <p className="is-size-7 has-text-grey has-text-weight-semibold">Price</p>
              <p className="has-text-weight-semibold is-size-6">${totalFeeInDollars}</p>
            </div>
            <div className="column">
              <LoadingIcon />
            </div>
          </div>
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className="box">
          <p className="title is-size-5 has-text-weight-semibold">{selectedProduct.title}</p>
          <p className="has-text-weight-semibold has-text-danger mb-3">Something went wrong: {this.state.error}</p>
          <button className="button is-link" onClick={this.props.handleModalClose}>Back</button>
        </div>
      );
    } else if (this.state.isPaymentSuccess) {
      // TODO: in the future, we should redirect to a dedicated success page that looks professional and provides useful information
      // ask for feedback etc.
      // copy shopify, amazon, open table.
      // can redirect by return jsx redirect component or can do it functionally. not sure which is better here
      // TODO: show bookingId as order number. show time. show add to calendar button. copy open table.
      const startTime = moment(this.props.selectedTime).format();
      const endTime = moment(this.props.selectedTime).add(selectedProduct.duration, 'minutes').format();
      const startTimeReadable = moment(this.props.selectedTime).format('dddd, MMMM D, YYYY [at] h:mm a');

      const timezone = this.props.customerTimezone;
      const timezoneReadable = timezone ? timezone.replace('_', ' ') : '';
      const customerJoinUrl = `${Meteor.settings.public.BASE_URL}/s/${this.state.roomId}?password=${this.state.customerSessionAccessCode}`;

      const addToCalendarEvent = {
        title: `Session with ${this.props.profile.name}`,
        description: `Session topic: "${this.state.description}". Join here: ${customerJoinUrl}. Session access code: ${this.state.customerSessionAccessCode}`,
        location: customerJoinUrl,
        startTime,
        endTime
      };

      const items = [
        { google: 'Google' },
        { apple: 'Apple Calendar' },
        { outlook: 'Outlook' },
        { outlookcom: 'Outlook.com' }
      ];

      return (
        <div className="box">
          <div className="media">
            <div className="media-left">
              <span className="icon is-large has-text-success">
                <i className="fas fa-check-circle fa-2x"></i>
              </span>
            </div>
            <div className="media-content">
              {/* Your session with {this.props.profile.name} is booked! */}
              <p className="title is-4">Session booked with {this.props.profile.name}</p>
              <p className="subtitle is-6">You will receive a confirmation email shortly. Order id: <b>{this.state.bookingId}</b></p>
              <div className="columns">
                <div className="column is-two-thirds">
                  <span className="is-size-7 has-text-weight-semibold">Service: </span>
                  <p className="is-size-7 mb-1">{selectedProduct.title} ({selectedProduct.duration}mins)</p>
                  <span className="is-size-7 has-text-weight-semibold">Date and time: </span>
                  <p className="is-size-7">{startTimeReadable}</p>
                  {timezoneReadable ? <p className="is-size-7 mb-1">({timezoneReadable})</p> : <p className="is-size-7 mb-1">Unknown timezone</p>}
                  <span className="is-size-7 has-text-weight-semibold">Session link: </span>
                  <p className="is-size-7 mb-1"><a href={customerJoinUrl} target="_blank">{customerJoinUrl}</a></p>
                  <span className="is-size-7 has-text-weight-semibold">Session Access Code: </span>
                  <p className="is-size-7 mb-1">{this.state.customerSessionAccessCode}</p>
                </div>
                <div className="column is-one-third">
                  <span className="is-size-7 has-text-weight-semibold mb-4">Add to calendar:</span>
                  <div style={{marginBottom: '9rem'}}>
                    <AddToCalendar
                      event={addToCalendarEvent}
                      listItems={items}
                      buttonTemplate={{ 'calendar-plus-o': 'left' }}
                      buttonLabel="Add to calendar"
                    />
                  </div>
                </div>
              </div>
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
            <p className="is-size-7 has-text-grey has-text-weight-semibold">Service</p>
            <p className="has-text-weight-semibold is-size-6">{selectedProduct.title} <span className="has-text-grey">({selectedProduct.duration}mins)</span></p>
            <p className="is-size-7 has-text-grey overflow-y-scroll" style={{ maxHeight: '5rem'}}>{selectedProduct.description}</p>
            <br />
            <p className="is-size-7 has-text-grey has-text-weight-semibold">Price</p>
            <p className="has-text-weight-semibold is-size-6">${totalFeeInDollars}</p>
          </div>
          <div className="column">
            <p className="title is-5">Provide Booking Details</p>
            <form onSubmit={this.handleSubmit}>
              <label className="label is-small">Date & time</label>
              <p className="is-size-7">{moment(this.props.selectedTime).format('dddd, MMMM D, YYYY [at] h:mm a')}</p>
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
                  <span className="mr-1">What would you like the call to be about?</span>
                  <InfoTooltip text="To get the most out of your session prepare a clear plan of what you want to cover and create a list of questions that you want to ask." iconSize="is-small" />
                </label>
                <div className="control">
                  <textarea className="textarea is-small has-fixed-size" disabled={this.state.isPaymentProcessing} name="description" rows="2" value={this.state.description} placeholder="" onChange={this.handleInputChange}></textarea>
                </div>
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
              <label className="label is-small">Payment</label>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
              {this.state.formError ? <label className="help is-danger mb-1">{this.state.formError}</label> : <br />}
              <div className="level is-mobile">
                <div className="level-left">
                  <div className="level-item">
                    <div className="field">
                      <div className="control">
                        <button className={`button is-link ${this.state.isPaymentProcessing ? 'is-loading' : ''}`} type="submit" disabled={!this.props.stripe || this.state.isPaymentProcessing}>Finish and pay</button>
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
