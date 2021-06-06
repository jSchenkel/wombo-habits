import React from 'react';
import { Link } from 'react-router-dom';

import { OUTCOMES, OUTCOME_TO_READABLE } from './../../constants/outcomes.js';

const HomeModal = (props) => {

  if (props.isModalOpen && props.activeModal === 'welcome') {
    return (
      <div className="box">
        <p className="title is-3">Welcome to Wombo</p>
        <p className="subtitle is-5">
          Design a system of habits and stick to it.
        </p>
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
        <p className="title is-3">Identity</p>
        <p className="subtitle is-6">
          System design starts by defining who you wish to become.
          The ultimate form of instrinsic motivation is when a habit becomes part of your identity.
          Let's start by defining who you wish to become.
        </p>
        <div className="field">
          <label className="label">I wish to become a peak performing...</label>
          <div className="control">
            <div className="select">
              <select name="identity" value={props.identity} onChange={props.handleInputChange}>
                <option value="entrepreneur">entrepreneur</option>
                {/* <option value="investor">investor</option>
                <option value="creator">creator</option>
                <option value="other">other</option> */}
              </select>
            </div>
          </div>
        </div>
        {props.identity === 'other' ? (
          <div className="field">
            <div className="control">
              <input className="input" type="text" name="otherIdentity" onChange={props.handleInputChange} value={props.otherIdentity} />
            </div>
          </div>
        ) : null}
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
              <button className="button is-link" disabled={(props.identity === 'other' && !props.otherIdentity) || (!props.identity)} onClick={() => {
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
        <p className="title is-3">Outcomes</p>
        <p className="subtitle is-6">
          Outcomes are the results you want to achieve.
          By becoming a <b>peak performing {props.identity}</b> you will achieve the outcomes you desire.
          You will become the type of person who gets the results you want.
        </p>
        <div className="field">
          <label className="label">My top 3 desired outcomes are...</label>
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
            <button className="button is-link" onClick={() => props.handleModalOpen('welcome-1')}>
              <span className="icon">
                <i className="fas fa-chevron-left"></i>
              </span>
              <span>Back</span>
            </button>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button is-link" disabled={props.outcomes.length < 3} onClick={() => {
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
        <p className="title is-3">Identity Habit Feedback Loop</p>
        <p className="subtitle is-6">
          Identity influences and motivates your habits.
        </p>
        <p className="subtitle is-6">
          Your habits reinforce your identity.
        </p>
        <p className="subtitle is-6">
          "We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle
        </p>
        {props.modalError ? <label className="help is-danger">{props.modalError}</label> : null}
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
              <button className="button is-link" disabled={(props.identity === 'other' && !props.otherIdentity) || (!props.identity)} onClick={() => {
                analytics.track('CTA Button Clicked', {
                  type: 'home-welcome-3',
                  layout: 'na'
                });
                props.handleWelcomeSubmit();
              }}>
                <span>Design System</span>
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


  {/* <span className="icon is-large">
    <i className="fas fa-sync-alt fa-2x"></i>
  </span> */}

  return null;
};

export default HomeModal;
