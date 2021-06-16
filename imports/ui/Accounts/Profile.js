import React from 'react';
import { Meteor } from 'meteor/meteor';

import momentTimezone from 'moment-timezone';
import { Link } from 'react-router-dom';

import { OUTCOMES, OUTCOME_TO_READABLE } from './../../constants/outcomes.js';

import LoadingIcon from '../LoadingIcon.js';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: 'entrepreneur',
      outcomes: '',
      three_month_goal: '',
      // contact
      name: '',
      email: '',
      // additional fields
      aboutError: '',
      accountLoaded: false,
      isSavingAbout: false,
      isAboutSaved : false
    }

    this.fetchUser = this.fetchUser.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.handleOutcomeSelected = this.handleOutcomeSelected.bind(this);
    this.handleOutcomeRemoved = this.handleOutcomeRemoved.bind(this);
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser() {
    this.setState({
      accountLoaded: false
    });
    Meteor.call('getCurrentUserProfile', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
      } else {
        // console.log('getCurrentUserAccount res: ', res);
        if (res) {
          this.setState({
            ...res,
            accountLoaded: true
          });
        }
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const identity = this.state.identity.trim();
    const outcomes = this.state.outcomes;
    const three_month_goal = this.state.three_month_goal;

    if (this.state.isAboutSaved || this.state.isSavingAbout) {
      return;
    }

    if (!identity) {
      return this.setState({aboutError: 'Please select an identity.'});
    }
    if (outcomes.length < 3) {
      return this.setState({aboutError: 'Please select 3 desired outcomes.'});
    }

    this.setState({
      isSavingAbout: true
    });

    Meteor.call('updateCurrentUserProfile', {identity, outcomes, three_month_goal}, (err, res) => {
      if (err) {
        // console.log('updateCurrentUserProfile err: ', err);
        this.setState({aboutError: err.reason, isSavingAbout: false, isAboutSaved: false});
      } else {
        this.setState({
          aboutError: '',
          isSavingAbout: false,
          isAboutSaved: true
        });
      }
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      isAboutSaved: false
    });
  }

  handleOutcomeSelected(outcome) {
    const outcomes = this.state.outcomes;
    if (outcomes.length >= 3) {
      return;
    }

    this.setState({
      outcomes: [...outcomes, outcome]
    });
  }

  handleOutcomeRemoved(outcome) {
    const newOutcomes = [...this.state.outcomes].filter(o => o !== outcome);

    this.setState({
      outcomes: newOutcomes
    });
  }

  render() {
    if (this.state.accountLoaded) {
      const saveButton = this.state.isSavingAbout ? (
       <div className="field">
         <div className="control">
           <button className="button is-link is-loading">Save</button>
         </div>
       </div>
      ) : (
        <div className="field">
          <div className="control">
            <button className="button is-link" type="submit">Save</button>
          </div>
        </div>
      );

      return (
        <div className="columns is-centered">
          <div className="column is-half">
            <form noValidate onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Name</label>
                <p className="control">
                  <input className="input" type="text" name="name" disabled value={this.state.name} placeholder="Name" />
                </p>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <p className="control">
                  <input className="input" disabled type="email" name="email" value={this.state.email} placeholder="Email" />
                </p>
              </div>
              <div className="field">
                <label className="label">Identity</label>
                <label className="help">I wish to become a peak performing...</label>
                <div className="control">
                  <div className="select">
                    <select name="identity" value={this.state.identity} onChange={this.handleInputChange}>
                      <option value="entrepreneur">entrepreneur</option>
                      <option value="creator">creator</option>
                      <option value="investor">investor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Outcomes</label>
                <label className="help">My top 3 desired outcomes are...</label>
                {OUTCOMES.map(outcome => {
                  if (this.state.outcomes.includes(outcome)) {
                    return (
                      <span key={outcome} className="tag is-link ml-1 has-pointer" onClick={() => this.handleOutcomeRemoved(outcome)}>
                        {OUTCOME_TO_READABLE[outcome]}
                        <button className="delete is-small"></button>
                      </span>
                    );
                  }
                  return (
                    <span key={outcome} className="tag ml-1 has-pointer" onClick={() => this.handleOutcomeSelected(outcome)}>
                      {OUTCOME_TO_READABLE[outcome]}
                    </span>
                  );
                })}
              </div>
              <div className="field">
                <label className="label">3 Month Goal</label>
                <p className="control">
                  <textarea className="textarea" type="text" name="three_month_goal" rows="2" value={this.state.three_month_goal} placeholder="i.e. Get 100 paying customers." onChange={this.handleInputChange} />
                </p>
              </div>
              {this.state.isAboutSaved ? <label className="help is-success">Saved!</label> : null}
              {this.state.aboutError ? <label className="help is-danger">{this.state.aboutError}</label> : null}
              {saveButton}
            </form>
          </div>
        </div>
      );
    }

    return (
      <LoadingIcon />
    );
  }
}
