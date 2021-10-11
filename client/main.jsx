import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import ReactDOM from 'react-dom';

// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { routes } from './../imports/routes/routes';
import '../imports/startup/simple-schema-configuration.js';

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
