import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';
import moment from 'moment';
import shortid from 'shortid';

import SimpleNavbar from '../Navbar/SimpleNavbar.js';
import LoadingIcon from '../LoadingIcon.js';
import Footer from '../Footer.js';

import { convertLocalHourMinuteStringToTimezoneUtcDateString, convertUtcDateStringToLocalHourMinuteString, displayHourMinuteString } from './../../helpers/date.js';
import { IDENTITY_TO_HABIT_MAP } from './../../constants/habits.js';
import { DAY_STRING_TO_DAY_SHORT_STRING } from './../../constants/schedules.js';

const INITIAL_HABIT_STATE = {
  isHabitActive: false,
  isHabitLoading: false,
  currentHabitId: '',
  title: '',
  description: '',
  duration: 15,
  startTime: '',
  endTime: '',
  error: '',
};

export default class SchedulesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // step state
      step: 'identity',
      // current habit
      ...INITIAL_HABIT_STATE,
      // habits
      habits: [],
      // identities
      identities: [],
      // schedule
      schedule: {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
      },
      // results step
      resultsError: '',
      email: '',
    };

    // TODO: implement create, edit, delete habits
    this.handleHabitSave = this.handleHabitSave.bind(this);
    this.addNewHabit = this.addNewHabit.bind(this);
    this.reset = this.reset.bind(this);
    this.habitSelected = this.habitSelected.bind(this);
    this.deleteHabit = this.deleteHabit.bind(this);

    // Implemented
    this.handleInputChange = this.handleInputChange.bind(this);
    this.finishIdentity = this.finishIdentity.bind(this);
    this.selectIdentity = this.selectIdentity.bind(this);
    this.handleResultsSubmit = this.handleResultsSubmit.bind(this);
  }

  handleResultsSubmit(event) {
    event.preventDefault();

    const email = this.state.email.trim();

    if (email.length === 0) {
      return this.setState({resultsError: 'Please enter your email.'});
    }

    Meteor.call('schedulesSendCalenderEmail', email, this.state.schedule, this.state.identities, (err, res) => {
      if (err) {
        this.setState({
          resultsError: err.reason
        });
      } else {
        // progress to last step "confirmation"
        // show a success message - "Check your email. Check your spam."
        // Display the aristotle quote,
        // "You are what you repeatedly do. Excellence then is not an act, but a habit."
        this.setState({step: 'done'});
      }
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      error: ''
    });
  }

  handleHabitSave(event) {
    event.preventDefault();
    const currentHabitId = this.state.currentHabitId
    const title = this.state.title.trim();
    const description = this.state.description.trim();
    const duration = this.state.duration ? parseInt(this.state.duration) : 0;
    const startTime = this.state.startTime;
    const endTime = this.state.endTime;

    if (title.length === 0) {
      return this.setState({error: 'A title is required.'});
    }
    if (title.length > 30) {
      return this.setState({error: 'Your title is too long. 30 characters max.'});
    }
    if (description.length === 0) {
      return this.setState({error: 'A description is required.'});
    }
    if (duration < 1) {
      return this.setState({error: 'A duration is required.'});
    }
    if (!startTime || !endTime) {
      return this.setState({error: 'Every habit must have a start and end time.'});
    }
    if (startTime && !['00', '30'].includes(startTime.split(':')[1])) {
      return this.setState({error: 'All times must start and end on the hour or half hour (ex. 6:00pm or 6:30pm).'});
    }
    if (startTime && endTime && startTime > endTime) {
      return this.setState({error: 'Start times must come before end times.'});
    }
    if (startTime && endTime && startTime === endTime) {
      return this.setState({error: 'Cannot start and end at the same time.'});
    }

    // Build the availability object
    // Sunday as 0 and Saturday as 6
    // we now have hour:minute strings in local time.
    // we need to create a local date object from hour:minute and then convert to utc date string for saving in db

    // const availability = {
    //   'sunday': {
    //     'start': startTime ? convertLocalHourMinuteStringToTimezoneUtcDateString(startTime, timezone) : '',
    //     'end': endTime ? convertLocalHourMinuteStringToTimezoneUtcDateString(endTime, timezone) : ''
    //   }
    // };

    return
  }

  addNewHabit() {
    this.setState({
      ...INITIAL_HABIT_STATE,
      isHabitActive: true,
    });
  }

  reset() {
    this.setState(INITIAL_HABIT_STATE);
  }

  habitSelected(habit) {
    this.setState({
      isHabitActive: true,
      isHabitLoading: false,
      currentHabitId: habit._id,
      title: habit.title,
      description: habit.description,
      duration: habit.duration,
      // start and end times are saved as utc date string
      // convert to local time and parse out hour and minute to display on client
      // startTime: habit.availability.sunday.start ? convertUtcDateStringToLocalHourMinuteString(habit.availability.sunday.start, timezone) : '',
      // endTime: habit.availability.sunday.end ? convertUtcDateStringToLocalHourMinuteString(habit.availability.sunday.end, timezone) : '',
      error: ''
    });
  }

  deleteHabit() {
    console.log('deleteHabit');
  }

  finishIdentity() {
    const { identities } = this.state;

    const schedule = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    }

    for (const identity of identities) {
      const habits = IDENTITY_TO_HABIT_MAP[identity];
      for (const habit of habits) {
        const events = habit['events'];
        for (const event of events) {
          schedule[event.day].push({
            ...event,
            title: habit.title,
            description: habit.description,
            id: shortid.generate()
          });
        }
      }
    }

    // update the step
    this.setState({step: 'process', schedule});
  }

  selectIdentity(category) {
    const { identities } = this.state;

    let newIdentities = [...identities];

    if (newIdentities.includes(category)) {
      newIdentities = newIdentities.filter(identity => identity !== category);
    } else {
      newIdentities.push(category);
    }

    this.setState({
      identities: newIdentities
    });
  }

  renderBody() {
    if (this.state.step === 'identity') {
      return (
        <div className="container">
          {/* Progress */}
          <div className="columns is-mobile mb-0">
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Identity</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Process</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Results</p>
            </div>
          </div>
          <progress className="progress is-link mb-6" value="3" max="100">3%</progress>
          {/* Main */}
          <p className="title is-3">Identity</p>
          <p className="subtitle is-5">I want to become...</p>
          <div className="columns">
            <div className="column">
              <div className={this.state.identities.includes('healthy') ? 'notification has-text-centered is-link has-pointer' : 'notification has-text-centered has-pointer'} onClick={() => this.selectIdentity('healthy')}>Healthy</div>
            </div>
            <div className="column">
              <div className={this.state.identities.includes('wealthy') ? 'notification has-text-centered is-link has-pointer' : 'notification has-text-centered has-pointer'} onClick={() => this.selectIdentity('wealthy')}>Wealthy</div>
            </div>
            <div className="column">
              <div className={this.state.identities.includes('wise') ? 'notification has-text-centered is-link has-pointer' : 'notification has-text-centered has-pointer'} onClick={() => this.selectIdentity('wise')}>Wise</div>
            </div>
          </div>
          <button className="button is-link" disabled={this.state.identities.length === 0} onClick={this.finishIdentity}>Next</button>
        </div>
      );
    } else if (this.state.step === 'process') {
      const schedule = this.state.schedule;
      const daysHTML = [];

      // sort the habits by start time. earlier -> later
      const habitCompare = (a, b) => {
        if (a.startTime > b.startTime) {
          return -1
        }
        return 0
      }

      for (const day in schedule) {
        daysHTML.push(
          <div key={day} className="column has-text-centered">
            <p className="is-size-6 has-text-weight-semibold mt-3 mb-3">{DAY_STRING_TO_DAY_SHORT_STRING[day].toUpperCase()}</p>
            {schedule[day].sort(habitCompare).map((habit) => {
              return (
                <div key={habit.id} className="notification has-pointer">
                  <p className="is-size-7 has-text-weight-semibold">{habit.title}</p>
                  {/* <p>{habit.description}</p> */}
                  <p className="is-size-7">{displayHourMinuteString(habit.startTime, 'h:mm a')} - {displayHourMinuteString(habit.endTime, 'h:mm a')}</p>
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <div className="container">
          {/* Progress */}
          <div className="columns is-mobile mb-0">
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Identity</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Process</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Results</p>
            </div>
          </div>
          <progress className="progress is-link mb-6" value="33" max="100">33%</progress>
          {/* Main */}
          <p className="title is-3">Process</p>
          <p className="subtitle is-5">Your system of habits to become successful.</p>
          <div className="columns is-centered" style={{overflow: 'scroll'}}>
            {daysHTML}
          </div>
          <button className="button is-link" onClick={() => this.setState({step: 'results'})}>Next</button>
        </div>
      );
    } else if (this.state.step === 'results') {
      return (
        <div className="container">
          {/* Progress */}
          <div className="columns is-mobile mb-0">
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Identity</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Process</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Results</p>
            </div>
          </div>
          <progress className="progress is-link mb-6" value="66" max="100">66%</progress>
          {/* Main */}
          <p className="title is-3">Results</p>
          <p className="subtitle is-5 mb-6">Add your system of habits to your calendar and get better every day.</p>
          <div className="columns is-centered">
            <div className="column is-half">
              <form className="box" onSubmit={this.handleResultsSubmit} noValidate>
                <div className="field">
                  <label className="label">Email</label>
                  <p className="control">
                    {this.state.resultsError ? <label className="help is-danger has-text-centered">{this.state.resultsError}</label> : undefined}
                    <input className="input is-medium" type="email" name="email" value={this.state.email} placeholder="Email" onChange={this.handleInputChange} />
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <input className="button is-medium is-fullwidth is-link" type="submit" value="Send Me My System" />
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    } else if (this.state.step === 'done') {
      return (
        <div className="container">
          {/* Progress */}
          <div className="columns is-mobile mb-0">
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Identity</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Process</p>
            </div>
            <div className="column has-text-centered">
              <p className="has-text-weight-semibold">Results</p>
            </div>
          </div>
          <progress className="progress is-link mb-6" value="100" max="100">100%</progress>
          {/* Main */}
          <p className="title is-3">Success</p>
          <p className="subtitle is-5 mb-6">Your system has been sent to your email. Import it into your calendar and get better every day.</p>
          <div className="columns is-centered">
            <div className="column has-text-centered">
              <p className="is-size-6">"We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle</p>
              <br />
              <p className="is-size-6">Thank you for using Wombo!</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <SimpleNavbar />
          <div className="hero-body">
            {this.renderBody()}
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
