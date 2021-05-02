import React from 'react';
import { Meteor } from 'meteor/meteor';

import momentTimezone from 'moment-timezone';
import { Link } from 'react-router-dom';

import LoadingIcon from '../LoadingIcon.js';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutError: '',
      name: '',
      email: '',
      isPaid: false,
      // additional fields
      accountLoaded: false,
      isSavingAbout: false,
      isAboutSaved : false
    }

    this.fetchUser = this.fetchUser.bind(this);
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser() {
    this.setState({
      accountLoaded: false
    });
    Meteor.call('getCurrentUserProfile', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
      } else {
        // console.log('getCurrentUserAccount res: ', res);
        if (res) {
          this.setState({
            name: res.name,
            email: res.email,
            isPaid: res.isPaid,
            accountLoaded: true
          });
        }
      }
    });
  }

  render() {
    if (this.state.accountLoaded) {
      const saveButton = this.state.isSavingAbout ? (
       <div className="field">
         <div className="control">
           <button className="button is-link is-loading">Save</button>
         </div>
       </div>
      ) : (
        <div className="field">
          <div className="control">
            <button className="button is-link" type="submit">Save</button>
          </div>
        </div>
      );

      return (
        <div className="columns is-centered">
          <div className="column is-half">
            <p className="title is-4">Settings</p>
            <hr />
            <form noValidate>
              {/* <div className="field">
                <div className="flex-row flex-row__space-between">
                  <label className="label">Wombo Plus</label>
                  <p className="is-size-7 has-text-grey-light">
                    <span className="icon">
                      <i className="fas fa-globe-americas"></i>
                    </span>
                    Always Public
                  </p>
                </div>
                {this.state.isPaid ? (
                  <p className="is-size-6 has-text-grey">
                    <span className="icon has-text-link">
                      <i className="fas fa-plus-circle"></i>
                    </span>
                    Typeboost Plus member.
                  </p>
                ) : (
                  <p className="is-size-6 has-text-grey">
                    Not a Typeboost Plus member. <Link to="/plus">Upgrade now</Link>
                  </p>
                )}
              </div> */}
              <div className="field">
                <div className="flex-row flex-row__space-between">
                  <label className="label">Name</label>
                  <p className="is-size-7 has-text-grey-light">
                    <span className="icon">
                      <i className="fas fa-globe-americas"></i>
                    </span>
                    Always Public
                  </p>
                </div>
                <p className="control">
                  {this.state.isAboutSaved ? <label className="help is-success">Saved!</label> : null}
                  {this.state.aboutError ? <label className="help is-danger">{this.state.aboutError}</label> : null}
                  <input className="input" type="text" name="name" disabled value={this.state.name} placeholder="Name" />
                </p>
              </div>
              {/* {saveButton} */}
            </form>
            <br />
            <p className="title is-4">Contact</p>
            <hr />
            <div>
              <div className="field">
                <div className="flex-row flex-row__space-between">
                  <label className="label">Email</label>
                  <p className="is-size-7 has-text-grey-light">
                    <span className="icon">
                      <i className="fas fa-lock"></i>
                    </span>
                    Always Private
                  </p>
                </div>
                <p className="control">
                  <input className="input" disabled type="email" name="email" value={this.state.email} placeholder="Email" />
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <LoadingIcon />
    );
  }
}
