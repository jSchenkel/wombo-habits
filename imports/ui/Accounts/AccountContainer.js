import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';

import LoggedInNavbar from '../Navbar/LoggedInNavbar.js';
import Profile from './Profile.js';
import Subscription from './Subscription.js';
import Footer from '../Footer.js';
import LoadingIcon from '../LoadingIcon.js';

export default class AccountEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'profile',
    }
  }

  renderForms() {
    if (this.state.selectedTab === 'profile') {
      return <Profile />;
    } else if (this.state.selectedTab === 'subscription') {
      return <Subscription />;
    }
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <LoggedInNavbar />
          <div className="hero-body">
            <div className="container">
              <div className="columns mb-4">
                <div className="column is-one-quarter">
                  <aside className="menu">
                    <p className="menu-label">
                      Account
                    </p>
                    <ul className="menu-list">
                      <li><a className={this.state.selectedTab === 'profile' ? 'is-active' : ''} onClick={() => this.setState({selectedTab: 'profile'})}>Edit Profile</a></li>
                    </ul>
                    <p className="menu-label">
                      Billing
                    </p>
                    <ul className="menu-list">
                      <li><a className={this.state.selectedTab === 'subscription' ? 'is-active' : ''} disabled>Manage Subscription (coming soon)</a></li>
                      {/* <li><a className={this.state.selectedTab === 'subscription' ? 'is-active' : ''} onClick={() => this.setState({selectedTab: 'subscription'})}>Manage Subscription</a></li> */}
                    </ul>
                  </aside>
                </div>
                <div className="column">
                  {this.renderForms()}
                </div>
              </div>
              <p className="has-text-centered has-text-grey is-italic">Have questions or need help with your account? Please contact: support@wombo.io</p>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
