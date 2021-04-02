import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import stripe from 'stripe';
// import bodyParser from 'body-parser';

const bound = Meteor.bindEnvironment(callback => callback());

WebApp.rawConnectHandlers.use('/stripe/webhook', (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = Meteor.settings.private.STRIPE_WEBHOOK_SECRET_CHECKOUT_SESSION_COMPLETED;
  const stripeObj = stripe(Meteor.settings.private.STRIPE_SECRET_KEY);

  if (req.method === 'POST') {
    let event;
    let body = '';

    req.on('data', data => bound(() => {
      body += data;
    }));

    req.on('end', () => bound(() => {
      try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      } catch (err) {
        console.log('Stripe webhook error: ', err.message);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(400);
        return res.end(JSON.stringify({webhook_error: err.message}));
      }

      // Handle the checkout.session.completed event
      if (event && event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        // Handle success
        // update booking document
        // send emails to customer and creator
        Meteor.call('handleSuccessfulPayment', paymentIntent.metadata.bookingId. paymentIntent.id);

        console.log('Stripe payment_intent.succeeded success!');
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        return res.end(JSON.stringify({received: true}));
      }

      console.log('Stripe webhook error: Skipped event handling');
      return res.end();
    }));
  } else {
    next();
  }
});

// event object:
//   {
//   "created": 1326853478,
//   "livemode": false,
//   "id": "evt_00000000000000",
//   "type": "checkout.session.completed",
//   "object": "event",
//   "req": null,
//   "pending_webhooks": 1,
//   "api_version": "2019-05-16",
//   "data": {
//     "object": {
//       "id": "cs_00000000000000",
//       "object": "checkout.session",
//       "billing_address_collection": null,
//       "cancel_url": "https://example.com/cancel",
//       "client_reference_id": null,
//       "customer": null,
//       "customer_email": null,
//       "display_items": [
//         {
//           "amount": 1500,
//           "currency": "usd",
//           "custom": {
//             "description": "Comfortable cotton t-shirt",
//             "images": null,
//             "name": "T-shirt"
//           },
//           "quantity": 2,
//           "type": "custom"
//         }
//       ],
//       "livemode": false,
//       "locale": null,
//       "payment_intent": "pi_00000000000000",
//       "payment_method_types": [
//         "card"
//       ],
//       "submit_type": null,
//       "subscription": null,
//       "success_url": "https://example.com/success"
//     }
//   }
// }
