import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

export const Rooms = new Mongo.Collection('rooms');

// Deny changes to db on client
Rooms.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('room', function (roomId) {
    new SimpleSchema({
      roomId: {
        type: String
      }
    }).validate({
      roomId
    });

    if (roomId) {
       return Rooms.find({ _id: roomId, isBlocked: false, isExpired: false });
    } else {
      this.ready();
    }
  });
}

Meteor.methods({
  roomsIsValidRoom(roomId) {
    new SimpleSchema({
      roomId: {
        type: String
      }
    }).validate({
      roomId
    });

    const Room = Rooms.findOne({ _id: roomId }, { fields: { _id: 1, isBlocked: 1, isExpired: 1 }});

    if (Room && !Room.isBlocked && !Room.isExpired) {
      return true;
    }

    return false;
  },
  roomsLeaveRoom(roomId, userId) {
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

    Rooms.update({ _id: roomId }, {
      $pull: {
        users: userId
      },
      $inc: {
        usersCount: -1
      }
    });
  }
});
