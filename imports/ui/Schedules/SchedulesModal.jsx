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
        <p className="title is-3">Welcome to the Habit System Builder</p>
        <p className="subtitle is-5">
          Design a system of habits to become a <b>successful {props.identity}</b> and achieve the outcomes you desire.
        </p>
        <button className="button is-link" onClick={() => {
          props.handleModalOpen('essentials');
          analytics.track('CTA Button Clicked', {
            type: 'system-welcome',
            layout: 'na'
          });
        }}>
          <span>Start with the Essentials</span>
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
        <p className="subtitle is-5">
          Everyone is playing a game and you want to <b>win</b> the game.
          To win the game you need to treat yourself like an <b>athlete</b> competing in the Olympics.
          To win the game you need to play at <b>peak performance</b>.
          Novice athletes make <b>repeated</b> mistakes.
          The Essentials will help you avoid these mistakes and prime your <b>mind and body</b> for peak performance so that you can work <b>smarter</b> and harder.
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
        <p className="subtitle is-5">
          Your goal is to spend as much of your day in <b>flow</b> as possible.
          Plan deep work sessions at times during the day when you feel you are most productive.
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
