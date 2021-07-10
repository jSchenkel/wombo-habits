import React from 'react';
import { Meteor } from 'meteor/meteor';

import moment from 'moment';

import LoadingIcon from '../LoadingIcon';
import { DAY_OF_WEEK_CODE_INT_TO_DAY_STRING , DAY_STRING_TO_DAY_SHORT_STRING } from '../../constants/schedules.js';

const PastDays = (props) => {

  if (props.isDaysLoading) {
    return <LoadingIcon />;
  }

  if (props.daysError) {
    return <label className="is-text-centered help is-danger">{props.daysError}</label>
  }

  return (
    <div className="columns is-mobile">
      {props.days && props.days.map((day, index) => {
        // if we have total events then get percentage complete (decimal)
        const decimalComplete = day.numTotalEvents && day.numCompletedEvents ? day.numCompletedEvents/day.numTotalEvents : 0;
        return (
          <div key={day.dateString} className="column has-text-centered">
            <p className="is-size-7">{DAY_STRING_TO_DAY_SHORT_STRING[DAY_OF_WEEK_CODE_INT_TO_DAY_STRING[day.dayOfWeekCode]].toUpperCase()}</p>
            <div className={index > (props.days.length / 2) ? "dropdown is-hoverable is-right" : "dropdown is-hoverable"}>
              <div className="dropdown-trigger">
                {day.numCompletedEvents && day.numTotalEvents ? (
                  <span className="icon is-medium has-text-link" style={{opacity: decimalComplete}} aria-haspopup="true" aria-controls="dropdown-menu4">
                    <i className="fas fa-square fa-2x" aria-hidden="true"></i>
                  </span>
                ) : (
                  <span className="icon is-medium has-text-light" aria-haspopup="true" aria-controls="dropdown-menu4">
                    <i className="fas fa-square fa-2x" aria-hidden="true"></i>
                  </span>
                )}
              </div>
              <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                <div className="dropdown-content">
                  <div className="dropdown-item">
                    {day.numCompletedEvents ? <span className="is-size-7 has-text-weight-semibold mr-2">{Math.round(decimalComplete*100)}%</span> : <span className="is-size-7 has-text-weight-semibold mr-2">0%</span>}
                    <span className="is-size-7">on {moment(day.dateString, 'MM-DD-YYYY').format('MMM D, YYYY')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PastDays;
