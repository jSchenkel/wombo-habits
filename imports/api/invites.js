import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Invites = new Mongo.Collection('invites');

// Deny changes to db on client
Invites.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
