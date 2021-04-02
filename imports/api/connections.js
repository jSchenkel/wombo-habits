import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

export const Connections = new Mongo.Collection('connections');

// Deny changes to db on client
Connections.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('connections', function (roomId, userId) {
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

    if (roomId && userId) {
      return Connections.find({
        roomId,
        isClosed: false,
        $or: [
          { initiatorId: userId },
          { acceptorId: userId }
        ]
      });
    } else {
      this.ready();
    }
  });
}

Meteor.methods({
  // initiator sends the signal data
  connectionsInitiatorSignaled(connectionId, initiatorSignalData) {
    new SimpleSchema({
      connectionId: {
        type: String
      },
      initiatorSignalData: {
        type: Object
      },
      'initiatorSignalData.type': {
        type: String
      },
      'initiatorSignalData.sdp': {
        type: String
      }
    }).validate({
      connectionId,
      initiatorSignalData
    });

    const timestamp = moment().utc().toDate();

    Connections.update({ _id: connectionId }, {
      $set: {
        initiatorSignalData,
        initiatorSignaled: timestamp
      }
    });
  },
  // acceptor accepts the initiators signal and sends their signal data back
  connectionsAcceptConnection(connectionId, acceptorSignalData) {
    new SimpleSchema({
      connectionId: {
        type: String
      },
      acceptorSignalData: {
        type: Object
      },
      'acceptorSignalData.type': {
        type: String
      },
      'acceptorSignalData.sdp': {
        type: String
      }
    }).validate({
      connectionId,
      acceptorSignalData
    });

    const timestamp = moment().utc().toDate();

    Connections.update({ _id: connectionId }, {
      $set: {
        acceptorSignalData,
        wasAccepted: true,
        accepted: timestamp
      }
    });
  },
  // connections close or error event has been fired. close the connection
  // NOTE: this method is called likely more than once since it is set up to be called by the initiator or the acceptor on close/error (max 4 times per connectionId)
  connectionsCloseConnection(connectionId, error) {
    new SimpleSchema({
      connectionId: {
        type: String
      },
      error: {
        type: String,
        optional: true
      }
    }).validate({
      connectionId,
      error
    });


    const timestamp = moment().utc().toDate();

    const errorUpdate = {};

    if (error) {
      errorUpdate['$push'] = {
        errors: error
      }
    }

    Connections.update({ _id: connectionId }, {
      $set: {
        isClosed: true,
        closed: timestamp
      },
      ...errorUpdate
    });
  }
});
