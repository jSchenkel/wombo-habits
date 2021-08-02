import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

import { Plans } from './plans.js';

const stripe = require('stripe')(Meteor.settings.private.STRIPE_SECRET_KEY);

Meteor.methods({
  async getSubscriptionForUser() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Can also use Meteor.user() instead, which is more performant?
    const user = Meteor.users.findOne({ _id: this.userId }, { fields: {
      _id: 1,
      planId: 1
    }});

    const planId = user.planId || null;

    if (!planId) {
      return null;
    }

    const plan = Plans.findOne({_id: planId}, {fields: {_id: 1, subscriptionId: 1}});

    if (!plan) {
      throw new Meteor.Error('invalid-plan', 'Invalid plan.');
    }

    const subscriptionId = plan.subscriptionId;
    if (!subscriptionId) {
      throw new Meteor.Error('invalid-subscription', 'Invalid subscription.');
    }

    // get stripe subscription object
    let subscription = null;
    try {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.log('stripe.subscriptions.retrieve error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe error.');
    }

    return subscription;
  },
  async getSubscription(subscriptionId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      subscriptionId: { type: String },
    }).validate({ subscriptionId });

    // get stripe subscription object
    let subscription = null;
    try {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.log('stripe.subscriptions.retrieve error: ', subscriptionId, error);
    }

    return subscription;
  },
  // TODO: need to use planId or current user
  async isSubscriptionValid(subscriptionId) {
    new SimpleSchema({
      subscriptionId: { type: String },
    }).validate({ subscriptionId });

    const subscription = await Meteor.call('getSubscriptionForPlan', subscriptionId);

    if (!subscription) {
      return false;
    }

    // check if the status is valid (trialing or active)
    const status = subscription.status;
    return status === 'trialing' || status === 'active';
  },
  async cancelSubscription(subscriptionId) {
    new SimpleSchema({
      subscriptionId: { type: String },
    }).validate({ subscriptionId });

    let subscription = null;
    try {
      subscription = await stripe.subscriptions.del(subscriptionId);
    } catch(error) {
      console.log('stripe.subscriptions.del error: ', error);
      throw new Meteor.Error('stripe-error', 'Stripe error.');
    }

    return subscription;
  }
});
