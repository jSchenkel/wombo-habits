import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

import { Connections } from '../../imports/api/connections.js';

// initiate the connection with the initiatorId and acceptorId
export const connectionsInitiateConnection = (roomId, initiatorId, acceptorId, userType) => {
  new SimpleSchema({
    roomId: {
      type: String
    },
    initiatorId: {
      type: String
    },
    acceptorId: {
      type: String
    },
    userType: {
      type: String
    }
  }).validate({
    roomId,
    initiatorId,
    acceptorId,
    userType
  });

  const timestamp = moment().utc().toDate();
  const _id = shortid.generate();

  Connections.insert({
    _id,
    roomId,
    initiatorId,
    acceptorId,
    userType,
    initiatorSignalData: null,
    acceptorSignalData: null,
    isClosed: false,
    wasAccepted: false,
    errors: [],
    initiated: timestamp,
    initiatorSignaled: timestamp,
    accepted: timestamp,
    closed: timestamp
  });
};
