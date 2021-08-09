import React from 'react';
import { Link } from 'react-router-dom';

import LoadingIcon from '../LoadingIcon';

import { SYSTEM_ESSENTIALS } from './../../constants/system/essentials.js';
import { SYSTEM_PRODUCTIVITY } from './../../constants/system/productivity.js';

const SchedulesModal = (props) => {
  if (props.isUserProfileLoading) {
    return (
      <div className="box">
        <LoadingIcon />
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'welcome') {
    return (
      <div className="box">
        <p className="title is-3">Welcome to the Habit System Builder!</p>
        <p className="subtitle is-6">
          Now it's time to design a system of habits to become a <b>{props.identity}</b>.
          A system of habits is a process for becoming your dream self.
          It is the blueprint which, if implemented consistently, will lead you to success.
        </p>
        <button className="button is-link" onClick={() => {
          props.handleModalOpen('essentials');
          analytics.track('CTA Button Clicked', {
            type: 'system-welcome',
            layout: 'na'
          });
        }}>
          <span>Start With The Essentials For Peak Performance</span>
          <span className="icon">
            <i className="fas fa-chevron-right"></i>
          </span>
        </button>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'essentials') {
    return (
      <div className="box">
        <p className="title is-3">Essentials</p>
        <p className="subtitle is-6">
          The Essentials are a comprehensive set of habits designed to help you perform at your <b>peak</b>.
          A common mistake people make is that they are working hard but not <b>smart</b>.
          Ultimately, input does <b>not</b> equal output. 
          The Essentials focus on the overall health of your <b>mind</b> and <b>body</b> so that you can feel energized, think clearly, and make good judgments throughout the day.
          Add or <b>customize</b> the following habits to make them fit into your system.
        </p>
        <hr />
        {SYSTEM_ESSENTIALS.map((category) => {
          return (
            <div key={category.key}>
              <p className="title is-4">{category.title}</p>
              <p className="subtitle is-6">{category.description}</p>
              {category.habits.map((habit) => {
                return (
                  <div key={habit.title} className="notification">
                    <p className="title is-5">{habit.title}</p>
                    <p className="subtitle is-7 mb-3">{habit.description}</p>
                    <p className="is-size-7 mb-3">{habit.events[0].startTimeHour}:{habit.events[0].startTimeMinute}{habit.events[0].startTimePeriod}</p>
                    <p className="is-size-7 mb-3">{habit.events.length}x per week</p>
                    {props.addedHabits.hasOwnProperty(habit.title) ? (
                      <button className="button is-small is-link" disabled>Habit Added</button>
                    ) : (
                      <button className="button is-small is-link" onClick={() => props.saveHabit({...habit, currentHabitId: null})}>Add Habit</button>
                    )}
                    {!props.addedHabits.hasOwnProperty(habit.title) ? (
                      <button className="button is-small is-light ml-2" onClick={() => props.habitSelected({...habit, _id: null})}>Customize Habit</button>
                    ) : null}
                  </div>
                )
              })}
              <hr />
            </div>
          );
        })}
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'productivity') {
    return (
      <div className="box">
        <p className="title is-3">Productivity</p>
        <p className="subtitle is-6">
          Your goal is to spend as much of your day in <b>flow</b> as possible. Use Lists or Planned Work to help you stay focused and get things done.
        </p>
        <hr />
        {SYSTEM_PRODUCTIVITY.map((category) => {
          return (
            <div key={category.key}>
              <p className="title is-4">{category.title}</p>
              <p className="subtitle is-6">{category.description}</p>
              {category.habits.map((habit) => {
                return (
                  <div key={habit.title} className="notification">
                    <p className="title is-5">{habit.title}</p>
                    <p className="subtitle is-7 mb-3">{habit.description}</p>
                    <p className="is-size-7 mb-3">{habit.events[0].startTimeHour}:{habit.events[0].startTimeMinute}{habit.events[0].startTimePeriod}</p>
                    <p className="is-size-7 mb-3">{habit.events.length}x per week</p>
                    {props.addedHabits.hasOwnProperty(habit.title) ? (
                      <button className="button is-small is-link" disabled>Habit Added</button>
                    ) : (
                      <button className="button is-small is-link" onClick={() => props.saveHabit({...habit, currentHabitId: null})}>Add Habit</button>
                    )}
                    {!props.addedHabits.hasOwnProperty(habit.title) ? (
                      <button className="button is-small is-light ml-2" onClick={() => props.habitSelected({...habit, _id: null})}>Customize Habit</button>
                    ) : null}
                  </div>
                )
              })}
              <hr />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export default SchedulesModal;
