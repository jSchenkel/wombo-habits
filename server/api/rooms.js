import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

import { Rooms } from '../../imports/api/rooms.js';
import { Bookings } from '../../imports/api/bookings.js';
import { Connections } from '../../imports/api/connections.js';
import { connectionsInitiateConnection } from './connections.js';

const accountSid = Meteor.settings.private.TWILIO_ACCOUNT_SID;
const authToken = Meteor.settings.private.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

Meteor.methods({
  async roomsJoinRoom(roomId, userId) {
    new SimpleSchema({
      roomId: {
        type: String
      },
      userId: {
        type: String
      }
    }).validate({
      roomId,
      userId
    });

    if (Meteor.isServer) {

      const room = roomsGetRoom(roomId);

      if (!room) {
        throw new Meteor.Error('invalid-room', 'Invalid room.');
      }

      // NOTE: assumes one to one relationship between ROOM and BOOKING (one on one sessions)
      const booking = Bookings.findOne({ roomId });
      if (!booking) {
        throw new Meteor.Error('invalid-booking', 'Invalid booking.');
      }

      // validate the userId and identify the userType (accessCode)
      let userType = '';
      if (userId === booking.creatorSessionAccessCode) {
        userType = 'creator';
      } else if (userId === booking.customerSessionAccessCode) {
        userType = 'customer';
      } else {
        // throw error because the access code didnt match anything so its invalid
        throw new Meteor.Error('invalid-session-access-code', 'Invalid session access code. Please refresh the page and try again.');
      }

      const utcNow = moment().utc();
      const utcExpired = moment(room.expired).utc();

      // check if the room is expired
      if (utcNow > utcExpired) {
        Rooms.update({_id: roomId}, {$set: {isExpired: true}});
        throw new Meteor.Error('expired-room', 'This room is expired.');
      }

      // Kill any connections that may already exist for the current user
      Connections.remove({
        roomId,
        $or: [
          { initiatorId: userId },
          { acceptorId: userId }
        ]
      });

      const otherUsers = room.users;

      // connect with other users in the room
      // NOTE: we're not worrying about creating a bunch of connections beause these calls are supposed to be one to one
      if (otherUsers && otherUsers.length > 0) {
        for (const otherUser of otherUsers) {
          // add check to handle edge case where a user doesnt leave gracefully and their id is still in rooms.users. avoid trying to connect to yourself
          if (userId !== otherUser) {
            connectionsInitiateConnection(roomId, userId, otherUser, userType);
          }
        }
      } else {
        // this user is the first to join. room owner?
      }

      Rooms.update({ _id: roomId }, {
        // $addToSet will only add the userId string to the array if it doesnt already exist in the array. avoid bloat
        $addToSet: {
          users: userId
        },
        $inc: {
          usersCount: 1,
          totalUsersJoined: 1
        }
      });

      // get twilio iceServers
      let token;

      try {
        token = await client.tokens.create()
      } catch (err) {
        console.log('client.tokens.create err: ', err);
      }

      const iceServers = token && 'iceServers' in token && token['iceServers'] ? token.iceServers : [];

      return {
        // only send the data we need to the client
        booking: {
          firstname: booking.firstname,
          lastname: booking.lastname,
          description: booking.description,
          selectedTimeUtc: booking.selectedTimeUtc,
          product: {
            title: booking.product.title,
            duration: booking.product.duration
          }
        },
        userType,
        iceServers
      };
    }
  }
});




/*
  ~~~ Server functions ~~~
*/

// startTime: Utc date string
export const roomsCreateRoom = (creatorId, startTime, duration, bookingId) => {
  new SimpleSchema({
    creatorId: { type: String },
    startTime: { type: String },
    duration: { type: Number },
    bookingId: { type: String },
  }).validate({
    creatorId, startTime, duration, bookingId
  });

  const timestamp = moment().utc().toDate();
  const expired = moment(startTime).utc().add(1, 'days').toDate();
  const _id = shortid.generate();
  const creatorSessionAccessCode = shortid.generate();

  Rooms.insert({
    _id,
    creatorId,
    startTime,
    duration,
    bookingId,
    // code used by the creator to join the session
    creatorSessionAccessCode,
    users: [],
    messages: [],
    usersCount: 0,
    totalUsersJoined: 0,
    isBlocked: false,
    isExpired: false,
    created: timestamp,
    // timestamp when the room expires
    expired,
  });

  const room = Rooms.findOne({ _id });

  return room;
}

export const roomsGetRoom = (roomId) => {
  new SimpleSchema({
    roomId: {
      type: String
    }
  }).validate({
    roomId
  });

  const Room = Rooms.findOne({ _id: roomId, isBlocked: false, isExpired: false });

  if (Room) {
    return Room;
  }

  return null;
}
