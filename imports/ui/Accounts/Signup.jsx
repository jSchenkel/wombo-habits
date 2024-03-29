import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { getSearchParams } from '../../helpers/utils.js';
import { BASIC_PLAN_TRIAL_LENGTH_DAYS } from '../../constants/plans.js';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      name: '',
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      error: ''
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const name = this.state.name.trim();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    if (name.length === 0) {
      return this.setState({error: "You missed a spot! Don't forget to add your name."});
    }

    if (name.length > 24) {
      return this.setState({error: 'Please enter a shorter name (24 characters max).'});
    }

    if (email.length === 0) {
      return this.setState({error: "You missed a spot! Don't forget to add your email."});
    }

    if (password.length === 0) {
      return this.setState({error: "You missed a spot! Don't forget to add your password."});
    }

    if (password.length < 6) {
      return this.setState({error: 'Your password is too short! You need 6+ characters.'});
    }

    const profile = {
      name,
    };

    Accounts.createUser({email, password, profile}, (err) => {
      if (err) {
        this.setState({error: err.reason});
      } else {
        analytics.track('Sign Up', {
          name,
          email,
        });
        this.setState({error: ''});
        this.props.history.replace(`/home`);
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
                <div className="column is-one-third">
                  <div>
                    <form className="" onSubmit={this.handleSubmit} noValidate>
                      <p className="title is-4 has-text-centered has-text-dark">Create Account</p>
                      <p className="subtitle is-6 has-text-centered has-text-dark">Design a system of habits to perform at your best and become your dream self.</p>
                      <div className="field">
                        {this.state.error ? <label className="help is-danger has-text-centered">{this.state.error}</label> : undefined}
                        <label className="label">First Name</label>
                        <p className="control">
                          <input className="input is-medium" type="text" name="name" value={this.state.name} placeholder="" onChange={this.handleChange} />
                        </p>
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <p className="control">
                          <input className="input is-medium" type="email" name="email" value={this.state.email} placeholder="" onChange={this.handleChange} />
                        </p>
                      </div>
                      <div className="field">
                        <label className="label">Password</label>
                        <p className="control">
                          <input className="input is-medium" type="password" name="password" value={this.state.password} placeholder="" onChange={this.handleChange} />
                        </p>
                      </div>
                      <div className="field">
                        <p className="control">
                          <input className="button is-medium is-fullwidth is-link" type="submit" value={`Create Account`} />
                          <label className="help has-text-centered">Already have an account? <Link to="/accounts/login" className="has-text-weight-semibold">Log In</Link></label>
                        </p>
                      </div>
                    </form>
                    <label className="help has-text-centered">By creating an account, you agree to Wombo's <Link to="/legal/terms">Terms of Service</Link> and <Link to="/legal/privacy">Privacy Policy</Link>.</label>
                  </div>
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

export default withRouter(Signup);
