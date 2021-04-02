import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';

import LoggedInNavbar from '../Navbar/LoggedInNavbar.js';
import Profile from './Profile.js';
import Payment from './Payment.js';
import QuestionAnswer from './QuestionAnswer.js';
import Footer from '../Footer.js';
import LoadingIcon from '../LoadingIcon.js';

export default class AccountEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'profile',
      currentUser: null
    }
  }

  componentDidMount() {
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

  renderForms() {
    if (this.state.selectedTab === 'profile') {
      return <Profile />;
    } else if (this.state.selectedTab === 'payment') {
      return <Payment />;
    } else if (this.state.selectedTab === 'q-and-a') {
      return <QuestionAnswer />;
    }
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <LoggedInNavbar currentUser={this.state.currentUser} />
          <div className="hero-body">
            <div className="container">
              <div className="columns">
                <div className="column is-one-quarter">
                  <aside className="menu">
                    <p className="menu-label">
                      General
                    </p>
                    <ul className="menu-list">
                      <li><a className={this.state.selectedTab === 'profile' ? 'is-active' : ''} onClick={() => this.setState({selectedTab: 'profile'})}>Edit Profile</a></li>
                    </ul>
                    <p className="menu-label">
                      Products
                    </p>
                    <ul className="menu-list">
                      <li><a className={this.state.selectedTab === 'q-and-a' ? 'is-active' : ''} onClick={() => this.setState({selectedTab: 'q-and-a'})}>Question & Answer</a></li>
                    </ul>
                    <p className="menu-label">
                      Banking
                    </p>
                    <ul className="menu-list">
                      <li><a className={this.state.selectedTab === 'payment' ? 'is-active' : ''} onClick={() => this.setState({selectedTab: 'payment'})}>Earnings and Banking</a></li>
                    </ul>
                  </aside>
                </div>
                <div className="column is-three-quarters">
                  {this.renderForms()}
                </div>
              </div>
              {/* <div className="tabs is-centered is-toggle is-small">
                <ul>
                  <li className={this.state.selectedTab === 'profile' ? 'is-active' : ''}>
                    <a onClick={() => this.setState({selectedTab: 'profile'})}>
                      <span>Edit Profile</span>
                    </a>
                  </li>
                  <li className={this.state.selectedTab === 'payment' ? 'is-active' : ''}>
                    <a onClick={() => this.setState({selectedTab: 'payment'})}>
                      <span>Earnings and Banking</span>
                    </a>
                  </li>
                </ul>
              </div> */}
              <p className="has-text-centered has-text-grey is-italic">Have questions or need help with your account? Please contact: support@wombo.io</p>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
