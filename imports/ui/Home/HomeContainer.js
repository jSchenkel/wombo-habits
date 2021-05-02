import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import moment from 'moment';

import LoggedInNavbar from './../Navbar/LoggedInNavbar.js';
import TodaysHabits from './TodaysHabits.js';
import Footer from './../Footer.js';

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
                  <div className="notification is-white has-text-centered has-text-white" style={{background: `url('/images/park3.png')`, backgroundSize: 'cover', height: '8rem'}}>
                    <p className="title is-3">{timeFormatted}</p>
                    <p className="subtitle is-5">{dateFormatted}</p>
                  </div>
                  <TodaysHabits />
                </div>
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
