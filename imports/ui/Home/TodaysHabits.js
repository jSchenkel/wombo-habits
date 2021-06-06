import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';
import moment from 'moment';

import LoadingIcon from '../LoadingIcon.js';

import { habitCompare, displayDuration } from '../../helpers/schedules.js';

const TodaysHabits = (props) => {

  const {
    isHabitsLoading,
    isDayLoading,
    day,
    events
  } = props;

  if (isHabitsLoading || isDayLoading) {
    return <LoadingIcon />;
  }

  return (
    <div>
      {events && events.length > 0 ? events.sort(habitCompare).map((event) => {
        const habitEventId = `${event.title}-${event.startTimeHour}-${event.startTimeMinute}-${event.startTimePeriod}`
        const isCompleted = day && day.completedEvents && day.completedEvents.includes(habitEventId);
        return (
          <div className="media" key={event._id}>
            <div className="media-left">
              {isCompleted ? (
                <span className="icon is-medium has-text-link">
                  <i className="fas fa-check-square fa-2x"></i>
                </span>
              ) : (
                <span className="icon is-medium has-text-light has-pointer" onClick={() => props.handleHabitEventCompleted(day._id, habitEventId, events.length)}>
                  <i className="far fa-square fa-2x"></i>
                </span>
              )}
            </div>
            <div className="media-content">
              <div className={isCompleted ? 'notification' : 'notification'}>
                <p className="is-size-5 has-text-weight-semibold">{event.title}</p>
                <p className="is-size-7 mb-2">{event.description.trim()}</p>
                <p className="is-size-7 has-text-weight-semibold">{event.startTimeHour}:{event.startTimeMinute}{event.startTimePeriod}</p>
                <p className="is-size-7 has-text-weight-semibold">{displayDuration(event.duration)}</p>
              </div>
            </div>
          </div>
        );
      }) : <p className="has-text-centered is-size-7">No events today</p>}
    </div>
  );
};

export default TodaysHabits;
