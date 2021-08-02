import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

const stripe = require('stripe')(Meteor.settings.private.STRIPE_SECRET_KEY);

export const Plans = new Mongo.Collection('plans');

// Deny changes to db on client
Plans.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  async setupStripeSubscription(plan, name, email) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      plan: { type: String },
      name: { type: String },
      email: { type: String, regEx: SimpleSchema.RegEx.Email },
    }).validate({ plan, name, email });

    let priceId;
    if (plan === 'monthly') {
      priceId = Meteor.settings.private.STRIPE_MONTHLY_PRICE_ID;
    } else if (plan === 'yearly') {
      priceId = Meteor.settings.private.STRIPE_YEARLY_PRICE_ID;
    } else {
      throw new Meteor.Error('invalid-plan', 'Invalid plan.');
    }

    const existingPlan = Plans.findOne({userId: this.userId, status: 'success'});
    if (existingPlan) {
      throw new Meteor.Error('duplicate-plan', 'Cannot create a new plan when an active plan already exists.');
    }

    // Create a new customer object
    let customer;
    try {
      customer = await stripe.customers.create({
        name,
        email,
      });
    } catch (error) {
      console.log('stripe.customers.create error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe payment error.');
    }
    const customerId = customer.id;

    // Create subscription (default to inactive)
    let subscription;
    try {
      // Create the subscription. Note we're expanding the Subscription's
      // latest invoice and that invoice's payment_intent
      // so we can pass it to the front end to confirm the payment
      subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
    } catch (error) {
      console.log('stripe.subscriptions.create error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe payment error.');
    }
    const subscriptionId = subscription.id;
    // get payment intent and client secret
    const paymentIntentId = subscription.latest_invoice.payment_intent.id;
    const clientSecret = subscription.latest_invoice.payment_intent.client_secret;

    const planId = shortid.generate();
    const timestamp = moment().utc().toDate();

    Plans.insert({
      _id: planId,
      userId: this.userId,
      name,
      email,
      plan,
      // stripe
      customerId,
      priceId,
      subscriptionId,
      paymentIntentId,
      // state of the plan: processing, success, failed
      status: 'processing',
      isDeleted: false,
      created: timestamp,
      updated: timestamp
    });

    return {
      planId,
      subscriptionId,
      clientSecret
    };
  },
  async handleSuccessfulSessionPayment(planId) {
    new SimpleSchema({
      planId: { type: String },
    }).validate({
      planId
    });

    const plan = Plans.findOne({_id: planId});
    if (!plan) {
      throw new Meteor.Error('invalid-plan', 'Invalid plan.');
    }

    const subscriptionId = plan.subscriptionId;
    const paymentIntentId = plan.paymentIntentId;

    // Retrieve the payment intent used to pay the subscription and set the customer payment method on the subscription
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const subscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          default_payment_method: paymentIntent.payment_method,
        },
      );
    } catch (error) {
      console.log('stripe.paymentIntents.retrieve stripe.subscriptions.update error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe payment error.');
    }

    const timestamp = moment().utc().toDate();
    Plans.update({ _id: planId }, {$set: {
      // state of the plan: processing, success, failed
      status: 'success',
      updated: timestamp
    }});

    // DONT need this? stripe automatically sends a receipt
    // Send confirmation email with sign up link
    // const name = plan.name;
    // const email = plan.email;
    // const planString = plan.plan;
    // Meteor.call('sendTrialStartedEmail', name, email, planId, planString)

    return true;
  },
  handleFailedSessionPayment(planId, errorMessage) {
    new SimpleSchema({
      planId: { type: String },
      errorMessage: { type: String },
    }).validate({
      planId,
      errorMessage
    });

    const plan = Plans.findOne({_id: planId});
    if (!plan) {
      throw new Meteor.Error('invalid-plan', 'Invalid plan.');
    }

    const subscriptionId = plan.subscriptionId;

    // cancel the created subscription
    try {
      stripe.subscriptions.del(subscriptionId);
    } catch(error) {
      console.log('stripe.subscriptions.del error: ', error);
    }

    // update the plan: complete: false, processing: false
    const timestamp = moment().utc().toDate();
    Plans.update({_id: planId}, {$set: {
      // state of the plan: processing, success, failed
      status: 'failed',
      errorMessage,
      updated: timestamp
    }});

    return true;
  }
});
