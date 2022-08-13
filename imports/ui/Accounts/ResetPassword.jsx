import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      newPassword: '',
      newPasswordConfirm: ''
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

    const newPassword = this.state.newPassword.trim();
    const newPasswordConfirm = this.state.newPasswordConfirm.trim();

    if (newPassword.length === 0) {
      return this.setState({error: 'Please enter your password.'});
    }

    if (newPassword.length < 8) {
      return this.setState({error: 'Password must be at least 8 characters long.'});
    }

    if (newPasswordConfirm.length === 0) {
      return this.setState({error: 'Please confirm your password.'});
    }

    if (newPassword !== newPasswordConfirm) {
      return this.setState({error: 'The passwords you entered do not match.'});
    }

    Accounts.resetPassword(this.props.match.params.token, newPassword, (err) => {
      if (err) {
        // console.log('resetPassword err: ', err);
        this.setState({error: err.reason});
      } else {
        // console.log('password reset success');
        // automatically rerouted from router
        this.props.history.replace('/home');
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
                    <h1 className="subtitle is-5 has-text-centered">Enter a new password below.</h1>
                    <br />
                    <div className="field">
                      <p className="control">
                        {this.state.error ? <label className="help is-danger has-text-centered">{this.state.error}</label> : undefined}
                        <input className="input is-medium" type="password" name="newPassword" value={this.state.newPassword} placeholder="Password" onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <p className="control">
                        <input className="input is-medium" type="password" name="newPasswordConfirm" value={this.state.newPasswordConfirm} placeholder="Confirm password" onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <p className="control">
                        <input className="button is-medium is-fullwidth is-link" type="submit" value="Reset Password" />
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

export default withRouter(ResetPassword);
