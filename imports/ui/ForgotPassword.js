import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';

import Navbar from './Navbar/Navbar.js';
import Footer from './Footer.js';

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      email: '',
      passwordResetEmailSent: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const email = this.state.email.trim();

    if (email.length === 0) {
      return this.setState({error: 'Please enter your email.'});
    }

    Accounts.forgotPassword({email}, (err) => {
      if (err) {
        // console.log('forgotPassword err: ', err);
        if (err.message === 'User not found [403]') {
          this.setState({error: 'This email was not found.'});
        } else {
          this.setState({error: 'We are sorry but something went wrong.'});
        }
      } else {
        // update stat and show success message
        this.setState({error: '', passwordResetEmailSent: true});
      }
    });
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <Navbar />
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-half">
                  <form className="box" onSubmit={this.handleSubmit} noValidate>
                    <h1 className="title is-3 has-text-centered">Reset Password</h1>
                    <h1 className="subtitle is-5 has-text-centered">Enter your email and we'll send you instructions to reset your password.</h1>
                    <br />
                    <div className="field">
                      <p className="control">
                        {this.state.error ? <label className="help is-danger has-text-centered">{this.state.error}</label> : undefined}
                        {this.state.passwordResetEmailSent ? <label className="help is-success has-text-centered">Email sent. Please check your inbox.</label> : undefined}
                        <input className="input is-medium" type="email" name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <p className="control">
                        <input className="button is-medium is-fullwidth is-link" type="submit" value="Send password reset email" />
                        <label className="help has-text-centered">Need help? Email us at <a>contact@wombo.io</a></label>
                      </p>
                    </div>
                  </form>
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
