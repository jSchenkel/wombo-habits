import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Collection for capturing all emails that we send stuff to
// Schema:
// email
// type
// meta
// timestamp
export const Recipients = new Mongo.Collection('recipients');

// Deny changes to db on client
Recipients.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
