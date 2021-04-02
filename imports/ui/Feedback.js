import React from 'react';
import { Meteor } from 'meteor/meteor';

import SimpleNavbar from './Navbar/SimpleNavbar.js';
import LoggedInNavbar from './Navbar/LoggedInNavbar.js';
import Footer from './Footer.js';

import { Link } from 'react-router-dom';

export default class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      currentUser: null,
      feedbackSubmitted: false,
      message: '',
      email: '',
      subject: 'feedback',
      happyWithWombo: 'yes',
      // honey pot
      phone: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    // if user is logged in then prefill their email
    const user = Meteor.user();
    const email = user && user.emails && user.emails.length > 0 && user.emails[0].address ? user.emails[0].address : '';

    this.setState({
      currentUser: user,
      email
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const subject = this.state.subject;
    const message = this.state.message.trim();
    const email = this.state.email;
    const happyWithWombo = this.state.happyWithWombo;

    // honey pot
    const phone = this.state.phone.trim();
    if (phone.length > 0) {
      return this.setState({error: 'Are you a robot? Contact us if you need help.'});
    }

    if (message.length === 0) {
      return this.setState({error: 'Please enter a message.'});
    }

    Meteor.call('feedbackInsert', subject, message, email, happyWithWombo, (err, res) => {
      if (err) {
        // console.log('feedbackInsert err: ', err);
        this.setState({error: err.reason});
      } else {
        analytics.track('Feedback Submitted', {
          subject,
          message,
          email,
          happyWithWombo
        });
        this.setState({
          error: '',
          feedbackSubmitted: true,
          message: '',
          subject: 'feedback',
          happyWithWombo: 'yes'
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
      error: '',
      feedbackSubmitted: false
    });
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          {this.state.currentUser ? <LoggedInNavbar currentUser={this.state.currentUser} /> : <SimpleNavbar />}
          <div className="hero-body">
            <div className="container">
              <h2 className="title is-4">Feedback</h2>
              <h4 className="subtitle is-6">How can we make Wombo better?</h4>
              <form onSubmit={this.handleSubmit} noValidate>
                <div className="field">
                  {this.state.error ? <label className="help is-danger">{this.state.error}</label> : undefined}
                  {this.state.feedbackSubmitted ? <label className="help is-success">Thank you for your feedback. We really appreciate it! We'll get back to you soon!</label> : undefined}
                  <label className="label">Subject</label>
                  <div className="control">
                    <div className="select">
                      <select name="subject" value={this.state.subject} onChange={this.handleInputChange}>
                        <option value="complaint">Complaint</option>
                        <option value="feature-request">Feature Request</option>
                        <option value="bug-report">Bug Report</option>
                        <option value="feedback">Feedback</option>
                        <option value="question">Question</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Message</label>
                  <div className="control">
                    <textarea className="textarea has-fixed-size" name="message" value={this.state.message} placeholder="Message" onChange={this.handleInputChange}></textarea>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input className="input" name="email" value={this.state.email} placeholder="Email" onChange={this.handleInputChange} />
                  </div>
                </div>
                {/* Honey pot */}
                <div className="field is-hidden">
                  <label className="label is-small">Phone</label>
                  <p className="control">
                    <input className="input is-small" type="text" name="phone" value={this.state.phone} placeholder="Phone" onChange={this.handleInputChange} />
                  </p>
                </div>
                <div className="field">
                  <label className="label">Are you happy with Wombo?</label>
                  <div className="control">
                    <div className="select">
                      <select name="happyWithWombo" value={this.state.happyWithWombo} onChange={this.handleInputChange}>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button className="button is-link" type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
