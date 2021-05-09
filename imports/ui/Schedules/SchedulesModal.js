import React from 'react';
import { Link } from 'react-router-dom';

import { SYSTEM_BASICS } from './../../constants/system/basics.js';
import { SYSTEM_WEALTH } from './../../constants/system/wealth.js';

const SchedulesModal = (props) => {

  if (props.isModalOpen && props.activeModal === 'welcome') {
    return (
      <div className="box">
        <p className="title is-3">Welcome to the System Builder</p>
        <p className="subtitle is-5">
          Here you can design your system of habits to become successful.
          Once your system is ready, you can view your list of habits for the day in the Home page.
        </p>
        <button className="button is-link" onClick={() => props.handleModalOpen('basics')}>Take Me to the Basics</button>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'basics') {
    return (
      <div className="box">
        <p className="title is-3">Basics</p>
        <p className="subtitle is-5">
          Everyone is playing a game and you want to <b>win</b> the game.
          To win the game you need to treat yourself like an <b>athlete</b> competing in the Olympics.
          To win the game you need to play at <b>peak performance</b>.
          Novice athletes make <b>repeated</b> mistakes.
          The Basics will help you avoid these mistakes and prime your <b>mind and body</b> for peak performance.
        </p>
        <hr />
        {SYSTEM_BASICS.map((category) => {
          return (
            <div key={category.key}>
              <p className="title is-4">{category.title}</p>
              <p className="subtitle is-6">{category.description}</p>
              {category.habits.map((habit) => {
                return (
                  <div key={habit.title} className="notification">
                    <p className="title is-5">{habit.title}</p>
                    <p className="subtitle is-7 mb-3">{habit.description}</p>
                    <p className="is-size-7 mb-3">{habit.events.length}x per week</p>
                    {props.addedHabits.hasOwnProperty(habit.title) ? (
                      <button className="button is-small is-link" disabled>Added</button>
                    ) : (
                      <button className="button is-small is-link" onClick={() => props.saveHabit({...habit, currentHabitId: null})}>Add to System</button>
                    )}
                  </div>
                )
              })}
              <hr />
            </div>
          );
        })}
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'wealth') {
    return (
      <div className="box">
        <p className="title is-3">Wealth</p>
        <p className="subtitle is-5">
          To build wealth you need to either build or buy <b>equity</b> in a business.
          This is the path to financial freedom.
          You need to <b>disconnect</b> your <b>inputs</b> from your <b>outputs</b>.
          You’re never going to get rich renting out your time and working for someone else, because your inputs are <b>tied</b> to your outputs.
          You work X hours and get paid Y.
          Ownership earns while you <b>sleep</b>.
        </p>
        <hr />
        {SYSTEM_WEALTH.map((category) => {
          return (
            <div key={category.key}>
              <p className="title is-4">{category.title}</p>
              <p className="subtitle is-6">{category.description}</p>
              {category.habits.map((habit) => {
                return (
                  <div key={habit.title} className="notification">
                    <p className="title is-5">{habit.title}</p>
                    <p className="subtitle is-7 mb-3">{habit.description}</p>
                    <p className="is-size-7 mb-3">{habit.events.length}x per week</p>
                    {props.addedHabits.hasOwnProperty(habit.title) ? (
                      <button className="button is-small is-link" disabled>Added</button>
                    ) : (
                      <button className="button is-small is-link" onClick={() => props.saveHabit({...habit, currentHabitId: null})}>Add to System</button>
                    )}
                  </div>
                )
              })}
              <hr />
            </div>
          );
        })}
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'happiness') {
    return (
      <div className="box">
        <p className="title is-3">Happiness</p>
        <p className="subtitle is-5">
          Happiness = Health + Wealth + Good Relationships. More to come...
        </p>
        <hr />
      </div>
    );
  }

  return null;
};

export default SchedulesModal;
