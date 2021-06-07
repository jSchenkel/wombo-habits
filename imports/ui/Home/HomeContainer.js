import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import moment from 'moment';

import LoggedInNavbar from './../Navbar/LoggedInNavbar.js';
import TodaysHabits from './TodaysHabits.js';
import PastDays from './PastDays.js';
import HomeModal from './HomeModal.js';
import Footer from './../Footer.js';

import { arrayToCommaSeparatedString } from '../../helpers/utils.js';
import { DAY_OF_WEEK_CODE_INT_TO_DAY_STRING } from '../../constants/schedules.js';

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dayString: '',
      // user profile
      isUserProfileLoading: true,
      userProfileError: '',
      // habits
      habits: [],
      events: [],
      isHabitsLoading: false,
      habitsError: '',
      // modal
      isModalOpen: false,
      activeModal: '',
      modalError: '',
      // form
      identity: 'entrepreneur',
      otherIdentity: '',
      outcomes: [],
      // day completed
      day: null,
      isDayLoading: false,
      dayError: '',
      // past days
      days: [],
      isDaysLoading: false,
      daysError: ''
    };

    this.fetchHabits = this.fetchHabits.bind(this);
    this.fetchDay = this.fetchDay.bind(this);
    this.fetchPastDays = this.fetchPastDays.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleWelcomeSubmit = this.handleWelcomeSubmit.bind(this);

    this.handleOutcomeSelected = this.handleOutcomeSelected.bind(this);
    this.handleOutcomeRemoved = this.handleOutcomeRemoved.bind(this);

    this.handleHabitEventCompleted = this.handleHabitEventCompleted.bind(this);
  }

  componentDidMount() {
    const now = moment();
    const dayOfWeekCode = now.day();
    const dayString = DAY_OF_WEEK_CODE_INT_TO_DAY_STRING[dayOfWeekCode];
    this.setState({
      dayString
    });
    // get habits
    this.fetchHabits(dayString);
    // get current user profile
    Meteor.call('getCurrentUserProfile', (err, res) => {
      if (err) {
        this.setState({
          isUserProfileLoading: false,
          userProfileError: err.reason
        });
      } else {
        this.setState({
          isUserProfileLoading: false,
          userProfileError: '',
          identity: res.identity || 'entrepreneur',
          outcomes: res.outcomes
        });
      }
    });
    // get day with completed state
    this.fetchDay(now.format('MM-DD-YYYY'));

    // fetch past days
    this.fetchPastDays();
  }

  fetchHabits(dayString) {
    this.setState({
      isHabitsLoading: true
    });

    Meteor.call('getCurrentUserHabitsByDay', dayString, (err, res) => {
      if (err) {
        this.setState({
          habitsError: err.reason,
          isHabitsLoading: false
        });
      } else {
        if (res) {
          const isHabitsEmpty = res && res.length === 0;

          const events = [];

          for (const habit of res) {
            for (const event of habit.events) {
              if (event.day === dayString) {
                events.push({
                  ...habit,
                  ...event
                });
              }
            }
          }

          this.setState({
            habits: res,
            habitsError: '',
            isHabitsLoading: false,
            isModalOpen: isHabitsEmpty,
            activeModal: isHabitsEmpty ? 'welcome' : '',
            modalError: '',
            events
          });
        }
      }
    });
  }

  fetchDay(dateString) {
    this.setState({
      isDayLoading: true
    });

    Meteor.call('getCurrentUserDayByDayString', dateString, (err, res) => {
      if (err) {
        this.setState({
          dayError: err.reason,
          isDayLoading: false,
        });
      } else {
        this.setState({
          day: res,
          isDayLoading: false,
        });

        // fetch past days
        this.fetchPastDays();
      }
    });
  }

  fetchPastDays() {
    this.setState({
      isDaysLoading: true
    });

    Meteor.call('getPastDays', 8, (err, res) => {
      if (err) {
        this.setState({
          daysError: err.reason,
          isDaysLoading: false
        });
      } else {
        this.setState({
          days: res,
          isDaysLoading: false
        });
      }
    });
  }

  handleModalOpen(activeModal) {
    this.setState({
      isModalOpen: true,
      activeModal,
      modalError: ''
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleWelcomeSubmit() {
    const identity = this.state.identity.trim();
    const outcomes = this.state.outcomes;

    Meteor.call('updateCurrentUserProfile', {identity, outcomes}, (err, res) => {
      if (err) {
        this.setState({
          modalError: err.reason
        });
      } else {
        this.props.history.replace(`/system`);
      }
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

  handleHabitEventCompleted(dayId, habitEventId, numTotalEvents) {
    this.setState({
      isDayLoading: true,
    });

    Meteor.call('updateDaysHabitCompleted', dayId, habitEventId, numTotalEvents, (err, res) => {
      if (err) {
        this.setState({
          dayError: err.reason,
          isDayLoading: false,
        });
      } else {
        this.setState({
          isDayLoading: false,
        });
        this.fetchDay(moment().format('MM-DD-YYYY'))
      }
    })
  }

  render() {
    const now = moment();
    const timeFormatted = now.format('h:mm a');
    const dateFormatted = now.format('dddd, MMMM D, YYYY');

    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <LoggedInNavbar />
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-half">
                  {this.state.identity && this.state.outcomes && this.state.outcomes.length > 0 ? (
                    <article className="message is-link is-small">
                      <div class="message-header">
                        <p>Get Better Every Day</p>
                      </div>
                      <div className="message-body">
                        Become a peak performing {this.state.identity} and achieve {arrayToCommaSeparatedString(this.state.outcomes)}.
                      </div>
                    </article>
                  ) : null}
                  <PastDays
                    days={this.state.days}
                    isDaysLoading={this.state.isDaysLoading}
                    daysError={this.state.daysError}
                  />
                  <div className="notification is-white has-text-centered has-text-white" style={{background: `url('/images/park3.png')`, backgroundSize: 'cover', height: '8rem'}}>
                    <p className="title is-3">{timeFormatted}</p>
                    <p className="subtitle is-5">{dateFormatted}</p>
                  </div>
                  {this.state.day ? <progress className="progress is-link" value={this.state.day.numCompletedEvents} max={this.state.day.numTotalEvents} title={`${Math.round(this.state.day.numCompletedEvents/this.state.day.numTotalEvents*100)}%`}></progress> : null}
                  <TodaysHabits
                    // data
                    events={this.state.events}
                    habitsError={this.state.habitsError}
                    isHabitsLoading={this.state.isHabitsLoading}
                    day={this.state.day}
                    isDayLoading={this.state.isDayLoading}
                    dayError={this.state.dayError}
                    // methods
                    handleHabitEventCompleted={this.handleHabitEventCompleted}
                  />
                </div>
              </div>
            </div>
            <div className={this.state.isModalOpen ? 'modal is-active' : 'modal'}>
              <div className="modal-background"></div>
              <div className="modal-content">
                <HomeModal
                  // methods
                  handleModalOpen={this.handleModalOpen}
                  handleInputChange={this.handleInputChange}
                  handleOutcomeSelected={this.handleOutcomeSelected}
                  handleOutcomeRemoved={this.handleOutcomeRemoved}
                  handleWelcomeSubmit={this.handleWelcomeSubmit}
                  // data
                  isModalOpen={this.state.isModalOpen}
                  activeModal={this.state.activeModal}
                  modalError={this.state.modalError}
                  // form
                  identity={this.state.identity}
                  otherIdentity={this.state.otherIdentity}
                  outcomes={this.state.outcomes}
                />
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}

export default withRouter(HomeContainer);
