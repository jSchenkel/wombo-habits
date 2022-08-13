import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      selector: '',
      password: ''
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
    const selector = this.state.selector.trim();
    const password = this.state.password.trim();

    if (selector.length === 0) {
      return this.setState({error: 'Please enter your email.'});
    }

    if (password.length === 0) {
      return this.setState({error: 'Please enter your password.'});
    }

    Meteor.loginWithPassword(selector, password, (err) => {
      if (err) {
        this.setState({error: 'The information you entered is incorrect. Please try again.'});
      } else {
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
                  <form className="" onSubmit={this.handleSubmit} noValidate>
                    <p className="is-size-3 has-text-centered has-text-dark">Log In</p>
                    <br />
                    <div className="field">
                      <label className="label">Email</label>
                      <p className="control">
                        {this.state.error ? <label className="help is-danger has-text-centered">{this.state.error}</label> : undefined}
                        <input className="input is-medium" type="text" name="selector" value={this.state.selector} placeholder="" onChange={this.handleChange} />
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
                        <input className="button is-medium is-fullwidth is-link" type="submit" value="Log In" />
                        <label className="help has-text-centered">Not a Wombo member? <Link to="/accounts/signup" className="has-text-weight-semibold">Start Free Trial</Link></label>
                        <label className="help has-text-centered">Forgot your password? <Link to="/accounts/forgot-password" className="has-text-weight-semibold">Reset Password</Link></label>
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

export default withRouter(Login);
