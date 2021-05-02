import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';
import moment from 'moment';

import LoadingIcon from '../LoadingIcon.js';

import { DAY_OF_WEEK_CODE_INT_TO_DAY_STRING } from '../../constants/schedules.js';
import { habitCompare } from '../../helpers/schedules.js';

export default class TodaysHabits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      // habits
      habits: [],
      isHabitsLoading: false,
      habitsError: ''
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
            isHabitsLoading: false
          });
        }
      }
    });
  }

  render() {
    if (this.state.isHabitsLoading) {
      return <LoadingIcon />;
    }

    const events = [];

    for (const habit of this.state.habits) {
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
              <p className="is-size-7 has-text-weight-semibold">{event.title}</p>
              <p className="is-size-7">{event.startTimeHour}:{event.startTimeMinute}{event.startTimePeriod}</p>
              <p className="is-size-7">{event.duration}min</p>
            </div>
          );
        }) : <p className="has-text-centered is-size-7">No events today</p>}
      </div>
    );
  }
}
