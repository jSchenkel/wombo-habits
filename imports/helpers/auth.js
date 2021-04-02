import { Meteor } from 'meteor/meteor';

export const isAuthenticated = () => {
  return !!Meteor.userId();
}

export const currentUserId = () => {
  return Meteor.userId();
}
