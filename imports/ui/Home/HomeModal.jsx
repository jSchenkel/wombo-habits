import React from 'react';
import { Link } from 'react-router-dom';

import { OUTCOMES, OUTCOME_TO_READABLE } from './../../constants/outcomes.js';

const HomeModal = (props) => {
  if (props.isModalOpen && props.activeModal === 'welcome') {
    return (
      <div className="box">
        <p className="title is-4">Welcome to Wombo</p>
        <p className="subtitle is-6">
          Design a system of habits to perform at your best and become your dream self.
        </p>
        <div className="content">
          <blockquote>
            "We are what we repeatedly do. Excellence, then, is not an act but a habit." - Aristotle
          </blockquote>
        </div>
        <nav className="level">
          <div className="level-left">
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button is-link" onClick={() => {
                analytics.track('CTA Button Clicked', {
                  type: 'home-welcome',
                  layout: 'na'
                });
                props.handleModalOpen('welcome-1');
              }}>
                <span>Continue</span>
                <span className="icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'welcome-1') {
    return (
      <div className="box">
        <p className="title is-4 mb-0">How To Succeed With Wombo</p>
        <div className="content">
          <ol>
            <li>Define who you wish to become and the results that you want to achieve.</li>
            <li>Design a system of habits to become your dream self.</li>
            <li>Complete your simple plan and make progress every day.</li>
          </ol>
        </div>
        <nav className="level">
          <div className="level-left">
            <button className="button is-link" onClick={() => props.handleModalOpen('welcome')}>
              <span className="icon">
                <i className="fas fa-chevron-left"></i>
              </span>
              <span>Back</span>
            </button>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button is-link" onClick={() => {
                analytics.track('CTA Button Clicked', {
                  type: 'home-welcome-1',
                  layout: 'na'
                });
                props.handleModalOpen('welcome-2');
              }}>
                <span>Continue</span>
                <span className="icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'welcome-2') {
    return (
      <div className="box">
        <p className="title is-4">Identity</p>
        <p className="subtitle is-6">
          The most effective way to change your habits is to focus on who you wish to become.
          By focusing on who you wish to become you will be motivated to stick to your system of habits.
          Eventually, your habits will become part of your identity and this is the ultimate form of intrinsic motivation.
        </p>
        <div className="field">
          <label className="label">I wish to become...</label>
          <label className="help">a successful entrepreneur, a famous Youtuber, etc.</label>
          <div className="control">
            <input className="input" type="text" name="identity" value={props.identity} placeholder="" onChange={props.handleInputChange} />
          </div>
        </div>
        <nav className="level">
          <div className="level-left">
            <button className="button is-link" onClick={() => props.handleModalOpen('welcome-1')}>
              <span className="icon">
                <i className="fas fa-chevron-left"></i>
              </span>
              <span>Back</span>
            </button>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button is-link" disabled={!props.identity} onClick={() => {
                analytics.track('CTA Button Clicked', {
                  type: 'home-welcome-2',
                  layout: 'na'
                });
                props.handleModalOpen('welcome-3');
              }}>
                <span>Continue</span>
                <span className="icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'welcome-3') {
    return (
      <div className="box">
        <p className="title is-4">Outcomes</p>
        <p className="subtitle is-6">
          Outcomes are the results that you want to achieve.
          By becoming <b>{props.identity}</b> you will get the outcomes that you want.
          Outcomes are an additional source of motivation to stick to your system of habits.
        </p>
        <div className="field">
          <label className="label">My top 3 desired outcomes are...</label>
          <label className="help">Pick at least one outcome.</label>
          {OUTCOMES.map(outcome => {
            if (props.outcomes.includes(outcome)) {
              return (
                <span key={outcome} className="tag is-link ml-1 has-pointer" onClick={() => props.handleOutcomeRemoved(outcome)}>
                  {OUTCOME_TO_READABLE[outcome]}
                  <button className="delete is-small"></button>
                </span>
              );
            }
            return (
              <span key={outcome} className="tag ml-1 has-pointer" onClick={() => props.handleOutcomeSelected(outcome)}>
                {OUTCOME_TO_READABLE[outcome]}
              </span>
            );
          })}
        </div>
        <nav className="level">
          <div className="level-left">
            <button className="button is-link" onClick={() => props.handleModalOpen('welcome-2')}>
              <span className="icon">
                <i className="fas fa-chevron-left"></i>
              </span>
              <span>Back</span>
            </button>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button is-link" disabled={props.outcomes.length < 1} onClick={() => {
                analytics.track('CTA Button Clicked', {
                  type: 'home-welcome-3',
                  layout: 'na'
                });
                props.handleWelcomeSubmit();
              }}>
                <span>Design Habit System</span>
                <span className="icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return null;
};

export default HomeModal;
