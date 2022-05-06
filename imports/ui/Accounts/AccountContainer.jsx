import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';

import LoggedInNavbar from '../Navbar/LoggedInNavbar';
import Profile from './Profile';
import Subscription from './Subscription';
import Footer from '../Footer';
import LoadingIcon from '../LoadingIcon';

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
