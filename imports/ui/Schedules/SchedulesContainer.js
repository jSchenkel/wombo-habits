import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';

import LoggedInNavbar from '../Navbar/LoggedInNavbar.js';
import LoadingIcon from '../LoadingIcon.js';
import HabitCurrent from './HabitCurrent.js';
import Footer from '../Footer.js';

import { habitCompare } from '../../helpers/schedules.js';
import { DAY_STRING_TO_DAY_SHORT_STRING } from './../../constants/schedules.js';

const INITIAL_EVENT_STATE = {
  // day of week string
  day: 'monday',
  // hour:minute string
  // startTime: '',
  startTimeHour: '08',
  startTimeMinute: '00',
  startTimePeriod: 'AM',
  // minute string
  duration: '30'
};

const INITIAL_HABIT_STATE = {
  isHabitActive: false,
  isHabitLoading: false,
  currentHabitId: '',
  title: '',
  description: '',
  events: [],
  habitError: ''
};

export default class SchedulesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // current habit
      ...INITIAL_HABIT_STATE,
      // habits
      habits: [],
      isHabitsLoading: false,
      habitsError: ''
    };

    // clear current habit state and make habit editor active
    this.addNewHabit = this.addNewHabit.bind(this);
    // clear current habit state and make habit editor inactive
    this.reset = this.reset.bind(this);
    this.fetchHabits = this.fetchHabits.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleEventInputChange = this.handleEventInputChange.bind(this);
    this.handleEventAdded = this.handleEventAdded.bind(this);
    this.handleEventRemoved = this.handleEventRemoved.bind(this);
    this.saveHabit = this.saveHabit.bind(this);
    this.deleteHabit = this.deleteHabit.bind(this);
    this.habitSelected = this.habitSelected.bind(this);
  }

  componentDidMount() {
    this.fetchHabits();
  }

  fetchHabits() {
    this.setState({
      isHabitsLoading: true
    });
    Meteor.call('getCurrentUserHabits', (err, res) => {
      if (err) {
        this.setState({
          habitsError: err.reason,
          isHabitsLoading: false
        });
      } else {
        if (res) {
          this.setState({
            habits: res,
            habitsError: '',
            isHabitsLoading: false
          });
        }
      }
    });
  }

  saveHabit(event) {
    event.preventDefault();

    this.setState({
      isHabitLoading: true
    });

    const {
      currentHabitId,
      title,
      description,
      events
    } = this.state;

    if (!title) {
      return this.setState({habitError: 'Please enter a title.', isHabitLoading: false});
    }
    if (!description) {
      return this.setState({habitError: 'Please enter a description.', isHabitLoading: false});
    }
    if (events && events.length === 0) {
      return this.setState({habitError: 'Please add at least one event.', isHabitLoading: false});
    }
    // Make sure all events have data
    for (const event of events) {
      if (!event.day || !event.startTimeHour || !event.startTimeHour || !event.startTimeMinute || !event.startTimePeriod || !event.duration) {
        return this.setState({habitError: 'Please enter a day, time, and duration for all events.', isHabitLoading: false});
      }
    }

    if (currentHabitId) {
      // update
      Meteor.call('updateHabit', currentHabitId, title, description, events, (err, res) => {
        if (err) {
          this.setState({
            habitError: err.reason,
            isHabitLoading: false
          });
        } else {
          this.setState({
            habitError: '',
            isHabitLoading: false
          });
          this.reset();
          this.fetchHabits();
        }
      });
    } else {
      // insert
      Meteor.call('createHabit', title, description, events, (err, res) => {
        if (err) {
          this.setState({
            habitError: err.reason,
            isHabitLoading: false
          });
        } else {
          this.setState({
            habitError: '',
            isHabitLoading: false
          });
          this.reset();
          this.fetchHabits();
        }
      });
    }
  }

  deleteHabit(currentHabitId) {
    // delete
    Meteor.call('deleteHabit', currentHabitId, (err, res) => {
      if (err) {
        this.setState({
          habitError: err.reason,
          isHabitLoading: false
        });
      } else {
        this.setState({
          habitError: '',
          isHabitLoading: false
        });
        this.reset();
        this.fetchHabits();
      }
    });
  }

  habitSelected(habit) {
    this.setState({
      isHabitActive: true,
      isHabitLoading: false,
      currentHabitId: habit._id,
      title: habit.title,
      description: habit.description,
      events: habit.events,
      habitError: ''
    });
  }

  reset() {
    this.setState({...INITIAL_HABIT_STATE});
  }

  addNewHabit() {
    this.setState({
      ...INITIAL_HABIT_STATE,
      isHabitActive: true,
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      habitError: ''
    });
  }

  handleEventAdded() {
    // deep copy of current events
    const newEvents = this.state.events.map((event) => {
      return {...event};
    });
    // push new event to list
    newEvents.push({...INITIAL_EVENT_STATE});
    // update state
    this.setState({
      events: newEvents,
      habitError: ''
    });
  }

  handleEventRemoved(index) {
    // deep copy of current events
    const newEvents = this.state.events.map((event) => {
      return {...event};
    });
    // remove the event by index
    newEvents.splice(index, 1);
    // update state
    this.setState({
      events: newEvents,
      habitError: ''
    });
  }

  handleEventInputChange(event, index) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const newEvents = this.state.events.map((event, i) => {
      if (index === i) {
        return {
          ...event,
          [name]: value
        }
      }
      return {...event};
    });
    // update state
    this.setState({
      events: newEvents,
      habitError: ''
    });
  }

  renderBody() {
    if (this.state.isHabitsLoading) {
      return (
        <div className="container">
          <LoadingIcon />
        </div>
      );
    }

    // create schedule structure
    const schedule = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    };

    // populate schedule structure with habit events
    for (const habit of this.state.habits) {
      for (const event of habit.events) {
        schedule[event.day].push({
          ...habit,
          ...event
        });
      }
    }

    // build schedule columns html
    const daysHTML = [];

    for (const day in schedule) {
      daysHTML.push(
        <div key={day} className="column has-text-centered">
          <p className="is-size-6 has-text-weight-semibold mt-3 mb-3">{DAY_STRING_TO_DAY_SHORT_STRING[day].toUpperCase()}</p>
          {schedule[day].sort(habitCompare).map((habit) => {
            return (
              <div key={habit._id} className="notification has-pointer" onClick={() => this.habitSelected(habit)}>
                <p className="is-size-7 has-text-weight-semibold">{habit.title}</p>
                <p className="is-size-7">{habit.startTimeHour}:{habit.startTimeMinute}{habit.startTimePeriod}</p>
                <p className="is-size-7">{habit.duration}min</p>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="container">
        <button className="button is-small is-link mb-3" onClick={this.addNewHabit}>Add New Habit</button>
        {this.state.isHabitActive && (
          <HabitCurrent
            // methods
            handleInputChange={this.handleInputChange}
            handleEventInputChange={this.handleEventInputChange}
            handleEventAdded={this.handleEventAdded}
            handleEventRemoved={this.handleEventRemoved}
            saveHabit={this.saveHabit}
            deleteHabit={this.deleteHabit}
            reset={this.reset}
            // state
            isHabitActive={this.state.isHabitActive}
            isHabitLoading={this.state.isHabitLoading}
            currentHabitId={this.state.currentHabitId}
            title={this.state.title}
            description={this.state.description}
            events={this.state.events}
            habitError={this.state.habitError}
          />
        )}
        <div className="columns is-centered" style={{overflow: 'scroll'}}>
          {daysHTML}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <LoggedInNavbar />
          <div className="hero-body">
            {this.renderBody()}
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
