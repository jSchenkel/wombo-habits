import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import LoadingIcon from './LoadingIcon.js';
import { Questions } from '../api/questions.js';

import { convertCentsToDollars, makeDollarFeeDisplayable } from '../helpers/payments.js';

class PendingQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      isLoading: true,
      error: ''
    }
  }

  componentDidMount() {
    const userId = this.props.userId;

    const handle = Meteor.subscribe('pendingQuestions');
    this.questionsTracker = Tracker.autorun(() => {
      const isReady = handle.ready();
      if (isReady) {
        this.setState({
          isLoading: false
        });
      }
      const questions = Questions.find({creatorId: userId, isPaymentComplete: true, isPendingAnswer: true}, {sort: {created: 1}}).fetch();
      if (questions && questions.length > 0) {
        this.setState({
          questions
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.questionsTracker) {
      this.questionsTracker.stop();
    }
  }

  renderPendingQuestions() {
    if (!this.state.isLoading && this.state.questions && this.state.questions.length > 0) {
      return this.state.questions.map((question) => {
        const customerName = `${question.firstname}`;
        const questionUrl = `/pq/${question._id}`;

        // Get rate
        const feeInDollars = convertCentsToDollars(question.feeInformation.baseFee);
        const feeFormatted = makeDollarFeeDisplayable(feeInDollars);

        return (
          <div key={question._id} className="notification is-light">
            <div className="level is-mobile mb-0">
              <div className="level-left">
                <div className="level-item">
                  <p className="title is-6">Question & Answer</p>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <span className="tag is-success">${feeFormatted}</span>
                </div>
              </div>
            </div>
            <p className="subtitle is-7 mb-3 has-text-grey">{moment(question.created).fromNow()}</p>
            <p className="is-size-7 overflow-y-scroll mb-2" style={{ maxHeight: '2rem'}}>{question.description}</p>
            <button className="button is-link is-small" onClick={() => this.props.history.push(questionUrl)}>Answer</button>
          </div>
        );
      });
    } else if (!this.state.isLoading && this.state.questions && this.state.questions.length === 0) {
      return <p className="help has-text-centered">No pending questions</p>;
    }

    return (
      <LoadingIcon />
    );
  }

  render() {
    const now = moment();
    const timeFormatted = now.format('h:mm a');
    const dateFormatted = now.format('dddd, MMMM D, YYYY');

    return (
      <div className="column is-half">
        <div className="box">
          <div className="notification is-white has-text-centered has-text-white" style={{background: `url('/images/park3.png')`, backgroundSize: 'cover', height: '8rem'}}>
            <p className="title is-3">{timeFormatted}</p>
            <p className="subtitle is-5">{dateFormatted}</p>
          </div>
          {this.state.error ? <p className="help is-danger has-text-centered">{this.state.error}</p> : null}
          {this.renderPendingQuestions()}
        </div>
      </div>
    );
  }
}

export default withRouter(PendingQuestions);
