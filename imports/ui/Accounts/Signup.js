import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { getSearchParams } from '../../helpers/utils.js';

import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer.js';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      trialId: '',
      email: '',
      name: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const trialId = searchParams.get('trialId');

    this.setState({
      name,
      email,
      trialId
    });
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

    const trialId = this.state.trialId.trim();
    const name = this.state.name.trim();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    if (trialId.length === 0) {
      return this.setState({error: "You missed a spot! Don't forget to add your trial id. This can be found in your trial started email."});
    }

    if (email.length === 0) {
      return this.setState({error: "You missed a spot! Don't forget to add your email."});
    }

    if (name.length === 0) {
      return this.setState({error: "You missed a spot! Don't forget to add your name."});
    }

    if (name.length > 24) {
      return this.setState({error: 'Please enter a shorter name (24 characters max).'});
    }

    if (password.length === 0) {
      return this.setState({error: "You missed a spot! Don't forget to add your password."});
    }

    if (password.length < 8) {
      return this.setState({error: 'Your password is too short! You need 8+ characters.'});
    }

    const profile = {
      name,
      planId: trialId
    };

    Accounts.createUser({email, password, profile}, (err) => {
      if (err) {
        this.setState({error: err.reason});
      } else {
        analytics.track('Sign Up', {
          name,
          email,
          planId: trialId,
        });
        this.setState({error: ''});
        this.props.history.replace(`/accounts/home`);
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
                      <p className="title is-3 has-text-centered has-text-dark">Sign Up</p>
                      <p className="subtitle is-5 has-text-centered has-text-dark">Design a system of habits to become successful.</p>
                      <div className="field">
                        {this.state.error ? <label className="help is-danger has-text-centered">{this.state.error}</label> : undefined}
                        <label className="label">Trial ID</label>
                        <p className="control">
                          <input className="input is-medium" type="text" name="trialId" value={this.state.trialId} placeholder="" onChange={this.handleChange} />
                        </p>
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <p className="control">
                          <input className="input is-medium" type="email" name="email" value={this.state.email} placeholder="" onChange={this.handleChange} />
                        </p>
                      </div>
                      <div className="field">
                        <label className="label">Name</label>
                        <p className="control">
                          <input className="input is-medium" type="text" name="name" value={this.state.name} placeholder="" onChange={this.handleChange} />
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
                          <input className="button is-medium is-fullwidth is-link" type="submit" value="Design My System" />
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
