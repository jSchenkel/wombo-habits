import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

import { Questions } from '../../imports/api/questions.js';
import { sendQuestionAnsweredCustomerEmail } from './emails.js';

Meteor.methods({
  questionsGetPrivateQuestion(questionId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    new SimpleSchema({
      questionId: {
        type: String
      }
    }).validate({
      questionId
    });

    // NOTE: Right now we only get questions that are pending answers
    // in the future we can allow the creator to edit the answer if they want...
    const question = Questions.findOne({_id: questionId, creatorId: this.userId, isPendingAnswer: true, isPaymentComplete: true }, {fields: {
      _id: 1,
      customerId: 1,
      firstname: 1,
      description: 1,
      displayableDescription: 1,
      creatorId: 1,
      feeInformation: 1,
      created: 1
    }});

    if (!question) {
      throw new Meteor.Error('invalid-question', 'Invalid question.');
    }

    const customer = Meteor.users.findOne({_id: question.customerId}, {fields: {_id: 1, name: 1, username: 1, profilePictureImageUrl: 1}});

    return {
      ...question,
      asker: customer
    };
  },
  questionsSubmitAnswer(questionId, answerAudioUrl) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    new SimpleSchema({
      questionId: {
        type: String
      },
      answerAudioUrl: {
        type: String
      }
    }).validate({
      questionId, answerAudioUrl
    });

    const question = Questions.findOne({_id: questionId, creatorId: this.userId, isPendingAnswer: true, isPaymentComplete: true });

    if (!question) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    const creator = Meteor.users.findOne({_id: question.creatorId });

    const timestamp = moment().utc().toDate();

    Questions.update({_id: questionId, creatorId: this.userId, isPendingAnswer: true, isPaymentComplete: true }, {
      $set: {
        answerAudioUrl,
        isPendingAnswer: false,
        submitted: timestamp
      }
    });

    // send the email notification to the customer/asker
    sendQuestionAnsweredCustomerEmail(
      questionId,
      question.email,
      creator.name,
      question.description
    );
  },
  questionsGetPublicQuestion(questionId) {
    new SimpleSchema({
      questionId: {
        type: String
      }
    }).validate({
      questionId
    });

    const question = Questions.findOne({_id: questionId, isPendingAnswer: false, isPaymentComplete: true, isDeleted: false }, {fields: {
      _id: 1,
      customerId: 1,
      firstname: 1,
      displayableDescription: 1,
      creatorId: 1,
      created: 1,
      answerAudioUrl: 1,
      answerText: 1,
      submitted: 1
    }});

    if (!question) {
      throw new Meteor.Error('not-authorized', 'Not authorized.');
    }

    const creator = Meteor.users.findOne({_id: question.creatorId}, {fields: {_id: 1, name: 1, username: 1, profilePictureImageUrl: 1}});
    const customer = Meteor.users.findOne({_id: question.customerId}, {fields: {_id: 1, name: 1, username: 1, profilePictureImageUrl: 1}});

    const result = {
      ...question,
      creator,
      asker: customer
    }
    return result;
  },
  questionsGetPublicQuestions(username) {
    new SimpleSchema({
      username: {
        type: String
      }
    }).validate({
      username
    });

    const creator = Accounts.findUserByUsername(username, { fields: {_id: 1, name: 1, username: 1, profilePictureImageUrl: 1}});

    if (!creator) {
      throw new Meteor.Error('invalid-user', 'Invalid user.');
    }

    let questions = Questions.find({ creatorId: creator._id, isPendingAnswer: false, isPaymentComplete: true, isHiddenFromProfile: false, isDeleted: false }, {
      fields: {
        _id: 1,
        customerId: 1,
        firstname: 1,
        displayableDescription: 1,
        creatorId: 1,
        created: 1,
        answerAudioUrl: 1,
        answerText: 1,
        submitted: 1
      },
      sort: {
        submitted: -1
      }
    }).fetch();

    questions = questions.map((question) => {
      const customer = Meteor.users.findOne({_id: question.customerId}, {fields: {_id: 1, name: 1, username: 1, profilePictureImageUrl: 1}});

      return {
        ...question,
        creator,
        asker: customer
      }
    });

    return questions;
  }
});
