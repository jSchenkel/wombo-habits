import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Navbar from './Navbar/Navbar.js';
import Footer from './Footer.js';

class RequestInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // request state
      isSuccess: false,
      // form state
      error: '',
      name: '',
      email: '',
      instagram: '',
      twitter: '',
      youtube: '',
      audienceSize: 0,
      source: '',
      answer: '',
      // catch bots with honey pot
      phone: ''
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
    const instagram = this.state.instagram.trim();
    const twitter = this.state.twitter.trim();
    const youtube = this.state.youtube.trim();
    const audienceSize = this.state.audienceSize ? parseInt(this.state.audienceSize) : 0;
    const source = this.state.source.trim();
    const answer = this.state.answer.trim();
    // honey pot
    const phone = this.state.phone.trim();

    // honey pot
    if (phone.length > 0) {
      return this.setState({error: 'Are you a robot? Contact us if you need help.'});
    }

    if (name.length === 0) {
      return this.setState({error: 'Please enter your name.'});
    }

    if (email.length === 0) {
      return this.setState({error: 'Please enter your email.'});
    }

    if (instagram.length === 0 && twitter.length === 0 && youtube.length === 0) {
      return this.setState({error: 'Please enter at least one social link.'});
    }

    if (source.length === 0) {
      return this.setState({error: 'Please let us know how your heard about us.'});
    }

    if (answer !== '5' && answer !== 'five') {
      return this.setState({error: 'Are you a robot? You got the answer to the math question wrong.'});
    }

    Meteor.call('invitesRequestInvite', name, email, instagram, twitter, youtube, audienceSize, source, (err, res) => {
      if (err) {
        this.setState({
          error: err.reason
        });
      } else {
        this.setState({
          error: '',
          isSuccess: true
        });
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
                    <p className="is-size-3 has-text-centered has-text-dark mb-3">Request Invite</p>
                    {this.state.isSuccess ? <label className="help is-success has-text-centered">We received your request! You will hear from us shortly.</label> : undefined}
                    {this.state.error ? <label className="help is-danger has-text-centered">{this.state.error}</label> : undefined}
                    <div className="field">
                      <label className="label is-small">Name</label>
                      <p className="control">
                        <input className="input is-small" type="text" name="name" value={this.state.name} placeholder="Name" onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <label className="label is-small">Email</label>
                      <p className="control">
                        <input className="input is-small" type="email" name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} />
                      </p>
                    </div>
                    {/* Honey pot */}
                    <div className="field is-hidden">
                      <label className="label is-small">Phone</label>
                      <p className="control">
                        <input className="input is-small" type="text" name="phone" value={this.state.phone} placeholder="Phone" onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <label className="label is-small">Instagram</label>
                      <p className="control">
                        <input className="input is-small" type="text" name="instagram" value={this.state.instagram} placeholder="Instagram" onChange={this.handleChange} />
                      </p>
                    </div>
                    {/* <div className="field">
                      <label className="label is-small">Twitter</label>
                      <p className="control">
                        <input className="input is-small" type="text" name="twitter" value={this.state.twitter} placeholder="Twitter" onChange={this.handleChange} />
                      </p>
                    </div> */}
                    <div className="field">
                      <label className="label is-small">Youtube</label>
                      <p className="control">
                        <input className="input is-small" type="text" name="youtube" value={this.state.youtube} placeholder="Youtube" onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <label className="label is-small">Size of Audience</label>
                      <p className="control">
                        <input className="input is-small" type="number" name="audienceSize" value={this.state.audienceSize} placeholder="1000, 10000, etc." onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <label className="label is-small">How did you hear about us?</label>
                      <p className="control">
                        <input className="input is-small" type="text" name="source" value={this.state.source} placeholder="Friends, social, email, etc." onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <label className="label is-small">What is 2 + 3?</label>
                      <p className="control">
                        <input className="input is-small" type="text" name="answer" value={this.state.answer} placeholder="1, 2, 3, 4, 5?" onChange={this.handleChange} />
                      </p>
                    </div>
                    <div className="field">
                      <p className="control">
                        <input className="button is-fullwidth is-link" type="submit" value="Request Invite" disabled={this.state.isSuccess} />
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

export default withRouter(RequestInvite);
