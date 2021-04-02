import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { VALID_REPEAT_RULES } from './../constants/scheduling.js';
import { isAuthenticated } from './../helpers/auth.js';

import LoadingIcon from './LoadingIcon.js';

class UpcomingSessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isLoadingEvents: true,
      error: '',
      // modal
      modalIsOpen: false,
      activeModal: ''
    }

    this.handleModalClose = this.handleModalClose.bind(this);
    this.onSchedule = this.onSchedule.bind(this);
  }

  componentDidMount() {
    Meteor.call('eventsGetUserUpcomingEvents', (err, res) => {
      if (err) {
        // console.log('eventsGetUserEventsBetweenDateRange err: ', err);
        this.setState({
          error: err.reason,
          isLoadingEvents: false
        });
      } else {
        // console.log('eventsGetUserEventsBetweenDateRange res: ', res);

        // determine if there are any recurring events. if not then show the schedule modal
        let modalIsOpen = false;
        let activeModal = '';
        const recurringEvents = res && res.filter(event => VALID_REPEAT_RULES.includes(event.repeatRules));
        if (recurringEvents && recurringEvents.length < 1) {
          modalIsOpen = true;
          activeModal = 'schedule-weekly-session';
        }

        this.setState({
          events: res,
          isLoadingEvents: false,
          modalIsOpen,
          activeModal
        });
      }
    });
  }

  renderUpcomingEvents() {
    if (!this.state.isLoadingEvents) {
      // filter out repeating events
      const upcomingEvents = this.state.events.filter(event => !VALID_REPEAT_RULES.includes(event.repeatRules)).map((event) => {
        const startTime = moment(event.startTime);

        const repeatsTag = event.repeatRules && VALID_REPEAT_RULES.includes(event.repeatRules) ? <span className="tag is-link">{event.repeatRules}</span> : null;

        return (
          <div key={event._id} className="notification has-pointer" onClick={() => this.props.history.push(`/upcoming/${event._id}`)}>
            <p className="title is-6">{event.title}</p>
            <p className="subtitle is-7">{startTime.format('h:mm a dddd, MMM D, YYYY')}</p>
            {repeatsTag}
          </div>
        );
      });

      return upcomingEvents.length > 0 ? upcomingEvents : <p className="help">No upcoming sessions</p>;
    }

    return (
      <LoadingIcon />
    );
  }

  renderRecurringEvents() {
    if (!this.state.isLoadingEvents) {
      // filter out non repeating events
      const recurringEvents = this.state.events.filter(event => VALID_REPEAT_RULES.includes(event.repeatRules)).map((event) => {
        const startTime = moment(event.startTime);

        const repeatsTag = event.repeatRules && VALID_REPEAT_RULES.includes(event.repeatRules) ? <span className="tag is-link">{event.repeatRules}</span> : null;

        return (
          <div key={event._id} className="notification has-pointer" onClick={() => this.props.history.push(`/upcoming/${event._id}`)}>
            <p className="title is-6">{event.title}</p>
            <p className="subtitle is-7">{startTime.format('h:mm a dddd')}</p>
            {repeatsTag}
          </div>
        );
      });

      return recurringEvents.length > 0 ? recurringEvents : <p className="help">No recurring sessions</p>;
    }

    return (
      <LoadingIcon />
    );
  }

  handleModalClose() {
    this.setState({ modalIsOpen: false, activeModal: '' });
  }

  onSchedule() {
    analytics.track('Schedule Session Clicked', {
      location: 'schedule-weekly-session-modal1',
      isAuthenticated: isAuthenticated()
    });

    this.props.history.push('/classes/schedule');
  }

  renderModal() {
    if (this.state.modalIsOpen && this.state.activeModal === 'schedule-weekly-session') {

      // Midweek sessions are most popular because they improve team moral and help the team finish the week strong.
      return (
        <div className="box">
          <p className="has-text-link is-size-2 is-unselectable wombo-logo has-text-centered mb-4">Wombo</p>
          <p className="title is-3">Schedule a weekly session</p>
          <p className="subtitle is-5">
            Get a weekly session on the calendar and bring the team together.
          </p>
          <p className="is-size-7 has-text-grey mb-4">Our users say that morning or end of the day sessions on Wednesdays are their favorite.</p>
          <div className="buttons are-medium">
            <a className="button is-success" onClick={this.onSchedule}>Schedule weekly session</a>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="">
        {this.state.error ? <p className="help is-danger has-text-centered">{this.state.error}</p> : null}
        <p className="title is-5">Upcoming</p>
        {this.renderUpcomingEvents()}
        <br />
        <p className="title is-5">Recurring</p>
        {this.renderRecurringEvents()}
        <div className={this.state.modalIsOpen ? 'modal is-active' : 'modal'}>
          <div className="modal-background" onClick={this.handleModalClose}></div>
          <div className="modal-content">
            {this.renderModal()}
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={this.handleModalClose}></button>
        </div>
      </div>
    );
  }
}

export default withRouter(UpcomingSessions);
