import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';
import moment from 'moment';

import LoadingIcon from '../LoadingIcon.js';

import { DAY_OF_WEEK_CODE_INT_TO_DAY_STRING } from '../../constants/schedules.js';
import { habitCompare, displayDuration } from '../../helpers/schedules.js';

export default class TodaysHabits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      // habits
      habits: [],
      isHabitsLoading: false,
      habitsError: '',
      // modal
      isModalOpen: true,
    };

    this.fetchHabits = this.fetchHabits.bind(this);
  }

  componentDidMount() {
    const dayOfWeekCode = moment().day();
    const dayString = DAY_OF_WEEK_CODE_INT_TO_DAY_STRING[dayOfWeekCode];
    this.setState({
      day: dayString
    });
    this.fetchHabits(dayString);
  }

  fetchHabits(day) {
    this.setState({
      isHabitsLoading: true
    });

    Meteor.call('getCurrentUserHabitsByDay', day, (err, res) => {
      if (err) {
        this.setState({
          habitsError: err.reason,
          isHabitsLoading: false
        });
      } else {
        if (res) {
          this.setState({
            habits: res,
            habitsError: '',
            isHabitsLoading: false,
            isModalOpen: res && res.length === 0
          });
        }
      }
    });
  }

  render() {
    const {
      isHabitsLoading,
      habits,
      isModalOpen
    } = this.state;

    if (isHabitsLoading) {
      return <LoadingIcon />;
    }

    const events = [];

    for (const habit of habits) {
      for (const event of habit.events) {
        if (event.day === this.state.day) {
          events.push({
            ...habit,
            ...event
          });
        }
      }
    }

    return (
      <div>
        {events && events.length > 0 ? events.sort(habitCompare).map((event) => {
          return (
            <div key={event._id} className="notification">
              <p className="is-size-5 has-text-weight-semibold">{event.title}</p>
              <p className="is-size-7 mb-2">{event.description.trim()}</p>
              <p className="is-size-7 has-text-weight-semibold">{event.startTimeHour}:{event.startTimeMinute}{event.startTimePeriod}</p>
              <p className="is-size-7 has-text-weight-semibold">{displayDuration(event.duration)}</p>
            </div>
          );
        }) : <p className="has-text-centered is-size-7">No events today</p>}
        <div className={isModalOpen ? 'modal is-active' : 'modal'}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              <p className="title is-3">Welcome to Wombo</p>
              <p className="subtitle is-5">
                There are two parts to Wombo.
                First, you design your system of habits.
                Second, every day you view and complete your habits for the day.
              </p>
              <Link to="/system" className="button is-link" onClick={() => {
                analytics.track('CTA Button Clicked', {
                  type: 'home-welcome',
                  layout: 'na'
                });
              }}>
                <span>System Builder</span>
                <span className="icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
