import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import ical from 'ical-generator';

const stripe = require('stripe')(Meteor.settings.private.STRIPE_SECRET_KEY);

import { getTotalFee, convertDollarsToCents, convertCentsToDollars, calculatePlatformFee } from '../../imports/helpers/payments.js';

import { Products } from './products.js';
import { sendQuestionCreatorEmail, sendQuestionCustomerEmail, sendBookingCreatorEmail, sendBookingCustomerEmail } from './emails.js';
import { roomsCreateRoom } from './rooms.js';
import { Bookings } from '../../imports/api/bookings.js';
import { Questions } from '../../imports/api/questions.js';


Meteor.methods({
  async getStripePaymentIntentForQuestion(creatorId, firstname, lastname, email, description, phone, agreesToTerms) {
    new SimpleSchema({
      creatorId: { type: String },
      firstname: { type: String },
      lastname: { type: String },
      email: { type: String, regEx: SimpleSchema.RegEx.Email },
      description: { type: String },
      phone: { type: String },
      agreesToTerms: { type: Boolean },
    }).validate({
      creatorId, firstname, lastname, email, description, phone, agreesToTerms
    });

    const creator = Meteor.users.findOne({ _id: creatorId });
    if (!creator || !creator.stripeAccountId) {
      throw new Meteor.Error('invalid-creator', 'Invalid creator.');
    }


    const rateInDollars = creator.questionRate;
    // This is the amount paid to the creator (the user input rate)
    const baseRateInCents = convertDollarsToCents(rateInDollars);
    const platformFeeInCents = calculatePlatformFee(baseRateInCents);
    // this is the total fee of the question (base + platform)
    const totalFeeInCents = getTotalFee(baseRateInCents);

    const questionId = shortid.generate();
    const timestamp = moment().utc().toDate();

    const isPaidQuestion = rateInDollars > 0;

    let paymentIntent;

    // if its a paid question then create a stripe payment intent object, which we'll use to actually perform the charge later
    if (isPaidQuestion) {
      // flow of charges: https://stripe.com/docs/connect/destination-charges#flow-of-funds-amount
      try {
        paymentIntent = await stripe.paymentIntents.create({
          payment_method_types: ['card'],
          amount: totalFeeInCents,
          currency: 'usd',
          transfer_data: {
            amount: baseRateInCents,
            destination: creator.stripeAccountId
          },
          metadata: {
            creatorId: creator._id,
            questionId
          }
        });
      } catch (err) {
        console.log('stripe.paymentIntents err: ', err);
        throw new Meteor.Error('stripe-error', 'Stripe payment error.');
      }
    }

    Questions.insert({
      _id: questionId,
      customerId: this.userId ? this.userId : null,
      firstname,
      lastname,
      email,
      description,
      // displayable description for profile picture (may be edited by creator or Wombo team)
      displayableDescription: description,
      phone,
      agreesToTerms,
      // creator
      creatorId: creator._id,
      // fee information in cents
      feeInformation: {
        baseFee: baseRateInCents,
        platformFee: platformFeeInCents,
        totalFee: totalFeeInCents
      },
      // we will set the payment intent data and isPaymentComplete bool in success webhook
      stripePaymentIntentId: '',
      isPaymentComplete: false,
      isPaymentProcessing: true,
      isDeleted: false,
      created: timestamp,
      updated: timestamp,
      // Fields used by creator
      isHiddenFromProfile: false,
      isPendingAnswer: true,
      answerAudioUrl: '',
      answerText: '',
      submitted: timestamp
    });

    // if its not a paid question then call handleSuccessfulQuestionPayment as if the payment has already been completed
    if (!isPaidQuestion) {
      Meteor.call('handleSuccessfulQuestionPayment', questionId, '');
    }

    return {
      questionId,
      client_secret: isPaidQuestion ? paymentIntent.client_secret : '',
      isPaidQuestion
    };
  },
  handleSuccessfulQuestionPayment(questionId, stripePaymentIntentId) {
    new SimpleSchema({
      questionId: { type: String },
      stripePaymentIntentId: { type: String }
    }).validate({
      questionId, stripePaymentIntentId
    });

    const question = Questions.findOne({ _id: questionId });
    if (!question) {
      throw new Meteor.Error('invalid-question', 'Invalid question.');
    }

    const creator = Meteor.users.findOne({_id: question.creatorId});
    if (!creator) {
      throw new Meteor.Error('invalid-creator', 'Invalid creator.');
    }

    const timestamp = moment().utc().toDate();
    Questions.update({_id: questionId}, {$set: {
      stripePaymentIntentId,
      isPaymentComplete: true,
      isPaymentProcessing: false,
      updated: timestamp
    }});

    // customer info
    const customerEmail = question.email;
    const customerName = `${question.firstname} ${question.lastname}`;
    const customerDescription = question.description;
    const customerFee = convertCentsToDollars(question.feeInformation.totalFee);

    // product info
    const productName = 'Question and Answer';

    // creator info
    const creatorEmail = creator.emails[0].address;
    const creatorName = creator.name;
    const creatorRate = convertCentsToDollars(question.feeInformation.baseFee); // dollars paid to creator

    // SEND CREATOR EMAIL
    sendQuestionCreatorEmail(
      questionId,
      creatorEmail,
      creatorRate,
      customerName,
      customerDescription
    );

    // SEND CUSTOMER EMAIL
    sendQuestionCustomerEmail(
      questionId,
      customerEmail,
      creatorName,
      customerFee,
      customerDescription
    );

    return {
      questionId
    }
  },
  handleFailedQuestionPayment(questionId) {
    new SimpleSchema({
      questionId: { type: String }
    }).validate({
      questionId
    });

    const question = Questions.findOne({ _id: questionId }, {fields: { _id: 1 }});
    if (!question) {
      throw new Meteor.Error('invalid-question', `Invalid question: ${questionId}`);
    }

    const timestamp = moment().utc().toDate();
    Questions.update({_id: questionId}, {$set: {
      isPaymentComplete: false,
      isPaymentProcessing: false,
      updated: timestamp
    }});
  },
  async getStripePaymentIntentForProduct(productId, firstname, lastname, email, description, phone, agreesToTerms, selectedTime, customerTimezone) {
    new SimpleSchema({
      productId: { type: String },
      firstname: { type: String },
      lastname: { type: String },
      email: { type: String, regEx: SimpleSchema.RegEx.Email },
      description: { type: String },
      phone: { type: String },
      agreesToTerms: { type: Boolean },
      selectedTime: { type: Date },
      customerTimezone: { type: String }
    }).validate({
      productId, firstname, lastname, email, description, phone, agreesToTerms, selectedTime, customerTimezone
    });

    if (Meteor.isServer) {
      const product = Products.findOne({ _id: productId });
      if (!product) {
        throw new Meteor.Error('invalid-product', 'Invalid product.');
      }

      const creator = Meteor.users.findOne({ _id: product.userId });
      if (!creator || !creator.stripeAccountId) {
        throw new Meteor.Error('invalid-creator', 'Invalid creator.');
      }

      // make sure that we reset seconds and milliseconds to be consistent in system
      const preppedSelectedTime = moment(selectedTime).seconds(0).milliseconds(0);

      // check if there is a booking already created for the selected time. if yes then throw an error
      const selectedTimeCustomerLocal = momentTimezone(preppedSelectedTime).tz(customerTimezone).format();
      const selectedTimeUtc = moment.utc(preppedSelectedTime).format();
      const selectedTimeCreatorLocal = momentTimezone(selectedTimeUtc).tz(creator.timezone).format();
      const selectedTimeCreatorLocalDate = momentTimezone(selectedTimeUtc).tz(creator.timezone).toDate();
      // throw error if there is another booking for the creator with the same time (could have been booked during checkout)
      const booking = Bookings.findOne({ creatorId: creator._id, selectedTimeUtc: selectedTimeUtc, isDeleted: false });
      if (booking && booking.isPaymentComplete) {
        throw new Meteor.Error('time-no-longer-available', 'Time no longer available. Please select a different time.');
      } else if (booking && booking.isPaymentProcessing) {
        throw new Meteor.Error('time-no-longer-available', 'Time no longer available. Please select a different time.');
      }

      const rateInDollars = product.rate;
      // This is the amount paid to the creator (the user input rate)
      // NOTE: In the future, we can handle unhappy customers/refunds by incrementing a refund balance on the creator user document which we subtract from their rate
      const baseRateInCents = convertDollarsToCents(rateInDollars);
      const platformFeeInCents = calculatePlatformFee(baseRateInCents);
      // this is the total fee of the product (base + platform)
      const totalFeeInCents = getTotalFee(baseRateInCents);

      const bookingId = shortid.generate();
      const timestamp = moment().utc().toDate();

      // flow of charges: https://stripe.com/docs/connect/destination-charges#flow-of-funds-amount
      let paymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          payment_method_types: ['card'],
          amount: totalFeeInCents,
          currency: 'usd',
          transfer_data: {
            amount: baseRateInCents,
            destination: creator.stripeAccountId
          },
          metadata: {
            creatorId: creator._id,
            productId: product._id,
            bookingId
          }
        });
      } catch (err) {
        console.log('stripe.paymentIntents err: ', err);
        throw new Meteor.Error('stripe-error', 'Stripe payment error.');
      }

      Bookings.insert({
        _id: bookingId,
        firstname,
        lastname,
        email,
        description,
        phone,
        agreesToTerms,
        // start time
        selectedTimeCustomerLocal,
        customerTimezone,
        selectedTimeCreatorLocal,
        selectedTimeCreatorLocalDate,
        selectedTimeUtc,
        // copy of the product data (snapshot in time) (duration, rate, title, etc.)
        product,
        // creator
        creatorId: creator._id,
        // room:
        roomId: '',
        // fee information in cents
        feeInformation: {
          baseFee: baseRateInCents,
          platformFee: platformFeeInCents,
          totalFee: totalFeeInCents
        },
        // we will set the payment intent data and isPaymentComplete bool in success webhook
        stripePaymentIntentId: '',
        isPaymentComplete: false,
        isPaymentProcessing: true,
        isDeleted: false,
        created: timestamp,
        updated: timestamp
      });

      return {
        bookingId,
        client_secret: paymentIntent.client_secret
      };
    }
  },
  handleSuccessfulSessionPayment(bookingId, stripePaymentIntentId) {
    new SimpleSchema({
      bookingId: { type: String },
      stripePaymentIntentId: { type: String }
    }).validate({
      bookingId, stripePaymentIntentId
    });

    const booking = Bookings.findOne({ _id: bookingId });
    if (!booking) {
      throw new Meteor.Error('invalid-booking', 'Invalid booking.');
    }

    const creator = Meteor.users.findOne({_id: booking.creatorId});
    if (!creator) {
      throw new Meteor.Error('invalid-creator', 'Invalid creator.');
    }

    // create the room
    const room = roomsCreateRoom(booking.creatorId, booking.selectedTimeUtc, booking.product.duration, booking._id);
    const roomId = room._id;

    const creatorSessionAccessCode = room.creatorSessionAccessCode;

    // access code should be on the booking level. if there are group calls, each individual member should have their own access code
    const customerSessionAccessCode = shortid.generate();

    const timestamp = moment().utc().toDate();
    Bookings.update({_id: bookingId}, {$set: {
      roomId,
      stripePaymentIntentId,
      // string id that customer enters to access the session (shared via confirmation email. can add as url param in email join link to make joining room seamless)
      customerSessionAccessCode,
      // code used by the creator to join the session
      creatorSessionAccessCode: room.creatorSessionAccessCode,
      isPaymentComplete: true,
      isPaymentProcessing: false,
      updated: timestamp
    }});

    // booking info
    const selectedTimeCustomerLocal = booking.selectedTimeCustomerLocal;
    const selectedTimeUtc = booking.selectedTimeUtc;
    const customerTimezone = booking.customerTimezone;

    // customer info
    const customerEmail = booking.email;
    const customerName = `${booking.firstname} ${booking.lastname}`;
    const customerDescription = booking.description;
    const customerFee = convertCentsToDollars(booking.feeInformation.totalFee);
    const selectedTimeCustomerTimezoneFormatted = momentTimezone(selectedTimeUtc).tz(customerTimezone).format('dddd, MMMM D, YYYY [at] h:mm a');
    // customerSessionAccessCode,

    // product info
    const productName = booking.product.title;
    const productDuration = booking.product.duration;

    // event info
    const eventStart = selectedTimeUtc;
    const eventEnd = moment.utc(eventStart).add(productDuration, 'minutes').format()

    // creator info
    const creatorEmail = creator.emails[0].address;
    const creatorName = creator.name;
    const creatorRate = convertCentsToDollars(booking.feeInformation.baseFee); // dollars paid to creator
    const selectedTimeCreatorTimezoneFormatted = momentTimezone(eventStart).tz(creator.timezone).format('dddd, MMMM D, YYYY [at] h:mm a');
    // creatorSessionAccessCode

    // generate ical event string using ical npm
    // pass UTC date string (no need to specify timezone if using UTC per ical docs)
    // CUSTOMER CAL EVENT
    const customerJoinUrl = `${Meteor.settings.public.BASE_URL}/s/${roomId}?password=${customerSessionAccessCode}`;
    const customerCalendar = ical({
      name: `Session with ${creatorName}`
    });
    customerCalendar.createEvent({
      start: eventStart,
      end: eventEnd,
      summary: `Session with ${creatorName}`,
      description: `Session topic: "${customerDescription}". Join here: ${customerJoinUrl}. Session access code: ${customerSessionAccessCode}`,
      url: customerJoinUrl,
      location: customerJoinUrl,
    });
    const customerCalendarString = customerCalendar.toString();

    // CREATOR CAL EVENT
    const creatorJoinUrl = `${Meteor.settings.public.BASE_URL}/s/${roomId}?password=${creatorSessionAccessCode}`;
    const creatorCalendar = ical({
      name: `Wombo session: ${productName}`
    });
    creatorCalendar.createEvent({
      start: eventStart,
      end: eventEnd,
      summary: `Wombo session: ${productName}`,
      description: `Customer: ${customerName}. Session topic: "${customerDescription}". Join here: ${creatorJoinUrl}. Session access code: ${creatorSessionAccessCode}`,
      url: creatorJoinUrl,
      location: creatorJoinUrl,
    });
    const creatorCalendarString = creatorCalendar.toString();

    // SEND CREATOR EMAIL
    sendBookingCreatorEmail(
      creatorEmail,
      creatorCalendarString,
      roomId,
      productName,
      productDuration,
      creatorRate,
      customerName,
      customerDescription,
      selectedTimeCreatorTimezoneFormatted,
      creatorSessionAccessCode
    );

    // SEND CUSTOMER EMAIL
    sendBookingCustomerEmail(
      customerEmail,
      customerCalendarString,
      roomId,
      productName,
      productDuration,
      creatorName,
      customerFee,
      customerDescription,
      selectedTimeCustomerTimezoneFormatted,
      customerSessionAccessCode
    );

    return {
      roomId,
      customerSessionAccessCode
    }
  },
  handleFailedSessionPayment(bookingId) {
    new SimpleSchema({
      bookingId: { type: String }
    }).validate({
      bookingId
    });

    const booking = Bookings.findOne({ _id: bookingId }, {fields: { _id: 1 }});
    if (!booking) {
      throw new Meteor.Error('invalid-booking', `Invalid booking: ${bookingId}`);
    }

    const timestamp = moment().utc().toDate();
    Bookings.update({_id: bookingId}, {$set: {
      isPaymentComplete: false,
      isPaymentProcessing: false,
      updated: timestamp
    }});
  }
});
