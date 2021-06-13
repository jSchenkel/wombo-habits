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

    // get setup intent client id
    let setupIntent;
    try {
      setupIntent =  await stripe.setupIntents.create({
        customer: customerId,
      });
    } catch (error) {
      console.log('stripe.setupIntents.create error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe payment error.');
    }
    const setupIntentId = setupIntent.id;

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
        trial_period_days: 14,
      });
    } catch (error) {
      console.log('stripe.subscriptions.create error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe payment error.');
    }
    const subscriptionId = subscription.id;

    const planId = shortid.generate();
    const timestamp = moment().utc().toDate();

    Plans.insert({
      _id: planId,
      name,
      email,
      plan,
      // stripe
      customerId,
      priceId,
      subscriptionId,
      // we will set the isPaymentComplete bool in success webhook (or on Success)
      setupIntentId: setupIntentId,
      isPaymentComplete: false,
      isPaymentProcessing: true,
      isDeleted: false,
      created: timestamp,
      updated: timestamp
    });

    return {
      planId,
      subscriptionId,
      clientSecret: setupIntent.client_secret
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
    const setupIntentId = plan.setupIntentId;

    // Retrieve the setup intent used to pay the subscription and set the customer pament method on the subscription
    try {
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
      const subscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          default_payment_method: setupIntent.payment_method,
        },
      );
    } catch (error) {
      console.log('stripe.setupIntents.retrieve stripe.subscriptions.update error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe payment error.');
    }

    const timestamp = moment().utc().toDate();
    Plans.update({ _id: planId }, {$set: {
      isPaymentComplete: true,
      isPaymentProcessing: false,
      updated: timestamp
    }});

    // Send confirmation email with sign up link
    const name = plan.name;
    const email = plan.email;
    const planString = plan.plan;
    Meteor.call('sendTrialStartedEmail', name, email, planId, planString)

    return true;
  },
  handleFailedSessionPayment(planId) {
    new SimpleSchema({
      planId: { type: String }
    }).validate({
      planId
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
      isPaymentComplete: false,
      isPaymentProcessing: false,
      updated: timestamp
    }});

    return true;
  }
});
