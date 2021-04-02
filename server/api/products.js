import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { AVAILABILITY_DAY_KEYS, DAY_STRING_TO_DAY_OF_WEEK_CODE_INT } from '../../imports/constants/products.js';
import { utcDateStringToMinutes } from '../../imports/helpers/date.js';
import { Bookings } from '../../imports/api/bookings.js';

export const Products = new Mongo.Collection('products');

// Deny changes to db on client
Products.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

/*
  Products schema:
  userId: user id of creator,
  title: string,
  description: string,
  duration: int (minutes),
  rate: int (dollars, will convert to cents when we need to charge stripe),
  numberOfParticipants: int (fixed at 1 to start),
  availability: some data structure to store when the creator is available for this product (when they want to be booked)
  isDeleted: false,
  isDisabled: false
  created: timestamp,
  updated: timestamp
*/

Meteor.methods({
  productsInsertProduct(title, description, duration, rate, numberOfParticipants, availability) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    new SimpleSchema({
      title: {
        type: String
      },
      description: {
        type: String
      },
      duration: {
        type: Number
      },
      rate: {
        type: Number
      },
      numberOfParticipants: {
        type: Number
      },
      availability: {
        type: Object
      },
      'availability.sunday': { type: Object },
      'availability.sunday.start': { type: String },
      'availability.sunday.end': { type: String },
      'availability.monday': { type: Object },
      'availability.monday.start': { type: String },
      'availability.monday.end': { type: String },
      'availability.tuesday': { type: Object },
      'availability.tuesday.start': { type: String },
      'availability.tuesday.end': { type: String },
      'availability.wednesday': { type: Object },
      'availability.wednesday.start': { type: String },
      'availability.wednesday.end': { type: String },
      'availability.thursday': { type: Object },
      'availability.thursday.start': { type: String },
      'availability.thursday.end': { type: String },
      'availability.friday': { type: Object },
      'availability.friday.start': { type: String },
      'availability.friday.end': { type: String },
      'availability.saturday': { type: Object },
      'availability.saturday.start': { type: String },
      'availability.saturday.end': { type: String }
    }).validate({
      title, description, duration, rate, numberOfParticipants, availability
    });

    if (Meteor.isServer) {
      // make sure that we are getting good values in availability
      for (let key in availability) {
        const start = availability[key]['start'];
        const end = availability[key]['end'];
        // if we actually have values, make sure that they are valid
        if (start || end) {
          const startMinutes = utcDateStringToMinutes(start);
          const endMinutes = utcDateStringToMinutes(end);

          if (startMinutes < 0 || endMinutes < 0) {
            throw new Meteor.Error('invalid-input', 'Invalid input.');
          }
        }
      }

      // check if there is availability conflict
      const result = Meteor.call('productsValidateNewAvailability', this.userId, null, availability);
      if (!result.isValid) {
        throw new Meteor.Error('availability-conflict', result.failedReason);
      }

      const timestamp = moment().utc().toDate();
      Products.insert({
        userId: this.userId,
        // user input
        title,
        description,
        duration,
        rate,
        numberOfParticipants,
        availability,
        isDisabled: false,
        // defaults
        isDeleted: false,
        created: timestamp,
        updated: timestamp
      });
    }
  },
  productsUpdateProduct(currentProductId, title, description, duration, rate, numberOfParticipants, availability) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    new SimpleSchema({
      currentProductId: {
        type: String
      },
      title: {
        type: String
      },
      description: {
        type: String
      },
      duration: {
        type: Number
      },
      rate: {
        type: Number
      },
      numberOfParticipants: {
        type: Number
      },
      availability: {
        type: Object
      },
      'availability.sunday': { type: Object },
      'availability.sunday.start': { type: String },
      'availability.sunday.end': { type: String },
      'availability.monday': { type: Object },
      'availability.monday.start': { type: String },
      'availability.monday.end': { type: String },
      'availability.tuesday': { type: Object },
      'availability.tuesday.start': { type: String },
      'availability.tuesday.end': { type: String },
      'availability.wednesday': { type: Object },
      'availability.wednesday.start': { type: String },
      'availability.wednesday.end': { type: String },
      'availability.thursday': { type: Object },
      'availability.thursday.start': { type: String },
      'availability.thursday.end': { type: String },
      'availability.friday': { type: Object },
      'availability.friday.start': { type: String },
      'availability.friday.end': { type: String },
      'availability.saturday': { type: Object },
      'availability.saturday.start': { type: String },
      'availability.saturday.end': { type: String }
    }).validate({
      currentProductId, title, description, duration, rate, numberOfParticipants, availability
    });

    // make sure that we are getting good values in availability
    for (let key in availability) {
      const start = availability[key]['start'];
      const end = availability[key]['end'];
      // if we actually have values, make sure that they are valid
      if (start || end) {
        const startMinutes = utcDateStringToMinutes(start);
        const endMinutes = utcDateStringToMinutes(end);

        if (startMinutes < 0 || endMinutes < 0) {
          throw new Meteor.Error('invalid-input', 'Invalid input.');
        }
      }
    }

    // check if there is availability conflict
    const result = Meteor.call('productsValidateNewAvailability', this.userId, currentProductId, availability);
    if (!result.isValid) {
      throw new Meteor.Error('availability-conflict', result.failedReason);
    }

    if (Meteor.isServer) {
      const timestamp = moment().utc().toDate();
      Products.update({
        _id: currentProductId,
        userId: this.userId
      }, {
        $set: {
          title,
          description,
          duration,
          rate,
          numberOfParticipants,
          availability,
          updated: timestamp
        }
      });
    }
  },
  // check if the new availability that we are saving conflicts with the saved availability of the users other products
  productsValidateNewAvailability(userId, productId, newAvailability) {
    let result = {
      isValid: true,
      failedReason: ''
    };

    const query = {
      userId,
      isDeleted: false
    }

    // there wont alwasy be a product id (create case) but if there is that exclude the given product from the check
    if (productId) {
      query['_id'] = { $ne: productId };
    }

    const products = Products.find(query, {fields: { title: 1, availability: 1 }}).fetch();

    if (products) {
      for (let product of products) {
        if (!result.isValid) {
          break;
        }

        const availability = product.availability;
        for (let day of AVAILABILITY_DAY_KEYS) {
          const newDay = newAvailability[day];
          const oldDay = availability[day];
          const newDayStartString = newDay['start'];
          const newDayEndString = newDay['end'];
          const oldDayStartString = oldDay['start'];
          const oldDayEndString = oldDay['end'];

          // if either product doesnt have a start or end for the day then theres no conflict so continue
          if (!oldDayStartString || !oldDayEndString || !newDayStartString || !newDayEndString) {
            continue;
          }

          const newDayStartMinutes = utcDateStringToMinutes(newDayStartString);
          const newDayEndMinutes = utcDateStringToMinutes(newDayEndString);
          const oldDayStartMinutes = utcDateStringToMinutes(oldDayStartString);
          const oldDayEndMinutes = utcDateStringToMinutes(oldDayEndString);


          const oldDayStartDateFormatted = moment(oldDayStartString).format('h:mm a');
          const oldDayEndSDateFormatted = moment(oldDayEndString).format('h:mm a');

          // check two fail cases:
          // 1. if product 1 start is less than product 2 end (there's conflict so fail) theres overlap
          // 2. if product 2 end is greater than product 2 start (there's conflict so fail) theres overlap
          // 3. newDayStartMinutes <= oldDayStartMinutes && newDayEndMinutes >= oldDayEndMinutes (there's conflict so fail) theres overlap
          if (newDayStartMinutes < oldDayEndMinutes && newDayStartMinutes > oldDayStartMinutes) {
            result.isValid = false;
            result.failedReason = `There is an availability conflict with "${product.title}": ${oldDayStartDateFormatted} to ${oldDayEndSDateFormatted} on ${day}`;
            break;
          } else if (newDayEndMinutes > oldDayStartMinutes && newDayEndMinutes < oldDayEndMinutes) {
            result.isValid = false;
            result.failedReason = `There is an availability conflict with "${product.title}": ${oldDayStartDateFormatted} to ${oldDayEndSDateFormatted} on ${day}`;
            break;
          } else if (newDayStartMinutes <= oldDayStartMinutes && newDayEndMinutes >= oldDayEndMinutes) {
            result.isValid = false;
            result.failedReason = `There is an availability conflict with "${product.title}": ${oldDayStartDateFormatted} to ${oldDayEndSDateFormatted} on ${day}`;
            break;
          }
        }
      }
    }

    return result;
  },
  productsDeleteProduct(productId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    new SimpleSchema({
      productId: {
        type: String
      },
    }).validate({
      productId
    });

    if (Meteor.isServer) {
      Products.remove({
        _id: productId,
        userId: this.userId
      });
    }
  },
  productsGetProducts() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    const products = Products.find({userId: this.userId, isDeleted: false}).fetch();
    return products;
  },
  productsGetPublicProducts(username) {
    new SimpleSchema({
      username: {
        type: String
      }
    }).validate({username});

    const user = Accounts.findUserByUsername(username, { fields: { _id: 1 }});

    if (!user) {
      return null;
    }

    const products = Products.find({userId: user._id, isDisabled: false}, { fields: { title: 1, description: 1, duration: 1, rate: 1, numberOfParticipants: 1, availability: 1 }}).fetch();

    // dont send products to the frontend that don't have any availability blocks set up by the creator
    // i think we enforce this when creating/saving products on the frontend already
    const finalProducts = products.filter((product) => {
      const availability = product.availability;
      for (let key in availability) {
        if (availability[key].start && availability[key].end) {
          return true;
        }
      }
      // if we get here then no day of the week has an availability block so dont include it in the results
      return false;
    });

    return finalProducts;
  },
  productsGetProductAvailability(productId) {
    new SimpleSchema({
      productId: {
        type: String
      }
    }).validate({productId});

    const product = Products.findOne({_id: productId}, { fields: { availability: 1, userId: 1, duration: 1 }});

    if (!product) {
      throw new Meteor.Error('invalid-input', 'Invalid input.')
    }

    const creatorId = product.userId;
    const availability = product.availability;
    const duration = product.duration;

    // build a list of utc date strings for all possible start times from now to two weeks from now
    // we will query for existing bookings with these start times to exclude them from the datepicker
    const productStartTimes = [];

    for (const day in availability) {
      // get the utc timestamps that we stored from user
      const start = availability[day]['start'];
      const end = availability[day]['end'];

      // skip this day in availability if there isnt a start/end time
      if (!start || !end) {
        continue;
      }

      // this is the day of week code for the start utc timestamp. we need to use this because day of utc timestamp is truth (versus availability[day] =>  day code - might be different from utc timestamp)
      const startDayOfWeekCodeInt = moment(start).utc().day();

      // get the start times for this week, next week (+7 days), and next next week (+14 days)
      for (const dayOffset of [0, 7, 14]) {
        // create our starting date using the dayOffset
        const utcNow = moment().utc().add(dayOffset, 'days');

        // set to day of week we care about for this iteration of availability
        utcNow.day(startDayOfWeekCodeInt);

        // get the year month day that we care about
        const utcYear = utcNow.year();
        const utcMonth = utcNow.month();
        const utcDate = utcNow.date();

        // create the start utc date object from the utc timestamp and set to year month day that we care about (this week, next week, next next week)
        const startUtc = moment(start).utc();
        startUtc.year(utcYear).month(utcMonth).date(utcDate).seconds(0).milliseconds(0);

        // create the end utc date object from the utc timestamp and set to year month day that we care about (this week, next week, next next week)
        const endUtc = moment(end).utc();
        endUtc.year(utcYear).month(utcMonth).date(utcDate).seconds(0).milliseconds(0);

        // push the start time date strings for each start time between start and end (increment by duration)
        while (startUtc.isBefore(endUtc, 'minute')) {
          productStartTimes.push(startUtc.format());
          startUtc.add(duration, 'minutes');
        }
      }
    }

    // check for bookings with start times for the selected product.
    // NOTE: we are doing a string comparison of date strings (selectedTimeUtc). need to make sure we store/format date strings consistently (ex. 0 seconds, 0 milliseconds)
    const bookings = Bookings.find({ creatorId, selectedTimeUtc: {$in: productStartTimes}, isDeleted: false }, {fields: {isPaymentComplete: 1, isPaymentProcessing: 1, selectedTimeUtc: 1}}).fetch();

    const excludeTimes = [];

    for (const booking of bookings) {
      if (booking.isPaymentComplete || booking.isPaymentProcessing) {
        // push the utc date string to excludeTimes
        excludeTimes.push(booking.selectedTimeUtc);
      }
    }

    const result = {
      availability,
      excludeTimes: excludeTimes
    };

    return result;
  }
});
