import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import ReactDOM from 'react-dom';
// polyfills
import adapter from 'webrtc-adapter';
// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { routes, onAuthChange } from './../imports/routes/routes.js';
import '../imports/startup/simple-schema-configuration.js';

// when users auth status changes - redirect them to the correct route
// Tracker.autorun(() => {
//   const isAuthenticated = !!Meteor.userId();
//   onAuthChange(isAuthenticated);
// });
const stripePromise = loadStripe(Meteor.settings.public.STRIPE_PUBLIC_KEY);
function App() {
  return (
    <Elements stripe={stripePromise}>
      {routes}
    </Elements>
  );
}

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById('app'));
});
