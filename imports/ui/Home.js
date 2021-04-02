import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router';

import { isAuthenticated } from './../helpers/auth.js';

import LoggedInNavbar from './Navbar/LoggedInNavbar.js';
import PendingQuestions from './PendingQuestions.js';
import LoadingIcon from './LoadingIcon.js';
import Footer from './Footer.js';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    };

    this.onStart = this.onStart.bind(this);
    this.onSchedule = this.onSchedule.bind(this);
    this.onJoin = this.onJoin.bind(this);
  }

  componentDidMount() {
    // get current user
    // TODO: this should be moved to a HOC parent component so that we dont make repetitive requests to backend
    Meteor.call('getCurrentUserAccount', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
      } else {
        // console.log('getCurrentUserAccount res: ', res);
        this.setState({
          currentUser: res
        });
      }
    });
  }

  onStart() {
    analytics.track('Start Session Clicked', {
      location: 'home',
      isAuthenticated: isAuthenticated()
    });

    this.props.history.push('/classes/now');
  };

  onSchedule() {
    analytics.track('Schedule Session Clicked', {
      location: 'home',
      isAuthenticated: isAuthenticated()
    });

    this.props.history.push('/classes/schedule');
  }

  onJoin() {
    analytics.track('Join Session Clicked', {
      location: 'home',
      isAuthenticated: isAuthenticated()
    });

    this.props.history.push('/join');
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <LoggedInNavbar currentUser={this.state.currentUser} />
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                {/* <div className="column is-half">
                  <div className="columns is-multiline">
                    <div className="column is-half">
                      <div className="notification has-text-centered has-pointer is-success" onClick={this.onStart}>
                        <span className="icon is-large">
                          <i className="fas fa-video fa-2x"></i>
                        </span>
                        <p>New Session</p>
                      </div>
                    </div>
                    <div className="column is-half">
                      <div className="notification has-text-centered has-pointer" onClick={this.onSchedule}>
                        <span className="icon is-large">
                          <i className="fas fa-calendar fa-2x"></i>
                        </span>
                        <p>Schedule</p>
                      </div>
                    </div>
                    <div className="column is-half">
                      <div className="notification has-text-centered has-pointer" onClick={this.onJoin}>
                        <span className="icon is-large">
                          <i className="fas fa-plus-square fa-2x"></i>
                        </span>
                        <p>Join</p>
                      </div>
                    </div>
                  </div>
                </div> */}
                {this.state.currentUser ? (
                  <PendingQuestions userId={this.state.currentUser._id} />
                ) : (
                  <LoadingIcon />
                )}
              </div>
              {/* <UpcomingSessions /> */}
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}

export default withRouter(Home);
