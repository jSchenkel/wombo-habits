import React from 'react';
import { Meteor } from 'meteor/meteor';

import momentTimezone from 'moment-timezone';
import { Link } from 'react-router-dom';

import ProfilePictureChange from './ProfilePictureChange.js';
import LoadingIcon from '../LoadingIcon.js';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutError: '',
      name: '',
      username: '',
      email: '',
      bio: '',
      // social links
      instagram: '',
      personal: '',
      shopping: '',
      youtube: '',
      tiktok: '',
      twitter: '',
      // additional fields
      phone: '',
      timezone: '',
      profilePictureImageUrl: '',
      accountLoaded: false,
      isSavingAbout: false,
      isAboutSaved : false
    }

    this.fetchUser = this.fetchUser.bind(this);
    this.handleAboutSubmit = this.handleAboutSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser() {
    this.setState({
      accountLoaded: false
    });
    Meteor.call('getCurrentUserAccount', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
      } else {
        // console.log('getCurrentUserAccount res: ', res);
        if (res) {
          this.setState({
            name: res.name,
            username: res.username,
            email: res.email,
            bio: res.bio,
            youtube: res.youtube,
            instagram: res.instagram,
            tiktok: res.tiktok,
            twitter: res.twitter,
            personal: res.personal,
            shopping: res.shopping,
            phone: res.phone,
            timezone: res.timezone,
            profilePictureImageUrl: res.profilePictureImageUrl,
            accountLoaded: true
          });
        }
      }
    });
  }

  handleAboutSubmit(event) {
    event.preventDefault();
    const name = this.state.name.trim();
    const username = this.state.username.trim();
    const bio = this.state.bio.trim();
    const phone = this.state.phone.trim();
    const timezone = this.state.timezone;

    // social links
    const instagram = this.state.instagram ? this.state.instagram.trim() : null;
    const personal = this.state.personal ? this.state.personal.trim() : null;
    const shopping = this.state.shopping ? this.state.shopping.trim() : null;
    const youtube = this.state.youtube ? this.state.youtube.trim() : null;
    const tiktok = this.state.tiktok ? this.state.tiktok.trim() : null;
    const twitter = this.state.twitter ? this.state.twitter.trim() : null;

    if (this.state.isAboutSaved) {
      return;
    }

    if (name.length === 0) {
      return this.setState({aboutError: 'Please enter a name.'});
    }

    if (name.length > 24) {
      return this.setState({aboutError: 'Please enter a shorter name (24 characters max).'});
    }

    if (bio && bio.length > 350) {
      return this.setState({aboutError: `Please enter a shorter bio (350 characters max). Your bio is ${bio.length} characters.`});
    }

    if (username.length === 0) {
      return this.setState({aboutError: 'Please enter a username.'});
    }

    if (username.length > 16) {
      return this.setState({aboutError: 'Please enter a shorter username (16 characters max).'});
    }

    if (!timezone) {
      return this.setState({aboutError: 'Please select a timezone.'});
    }

    this.setState({
      isSavingAbout: true
    });

    Meteor.call('updateCurrentUserProfile', name, username, bio, phone, timezone, youtube, instagram, tiktok, twitter, personal, shopping, (err, res) => {
      if (err) {
        // console.log('updateCurrentUserProfile err: ', err);
        this.setState({aboutError: err.reason, isSavingAbout: false, isAboutSaved: false});
      } else {
        analytics.track('Updated account', {
          name,
          username
        });
        this.setState({
          aboutError: '',
          isSavingAbout: false,
          isAboutSaved: true
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
      isAboutSaved: false
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
          <div className="column is-three-quarters">
            <div className="media mb-5">
              <div className="media-left">
                <ProfilePictureChange profilePictureImageUrl={this.state.profilePictureImageUrl} onUpload={this.fetchUser} onRemove={this.fetchUser}>
                  <figure className="image is-48x48">
                    <img className="is-rounded" src={this.state.profilePictureImageUrl ? this.state.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
                  </figure>
                </ProfilePictureChange>
              </div>
              <div className="media-content">
                <p className="title is-4">{this.state.username}</p>
                <ProfilePictureChange profilePictureImageUrl={this.state.profilePictureImageUrl} onUpload={this.fetchUser} onRemove={this.fetchUser}>
                  <p className="subtitle is-6 has-text-link has-text-weight-semibold">Change Profile Photo</p>
                </ProfilePictureChange>
              </div>
            </div>
            <form onSubmit={this.handleAboutSubmit}>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Name</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" name="name" value={this.state.name} placeholder="Name" onChange={this.handleInputChange} />
                  <p className="is-size-7 has-text-grey">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
                  {/* <label className="help">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</label> */}
                </div>
              </div>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Username</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" disabled name="username" value={this.state.username} placeholder="Username" onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Bio</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <textarea className="textarea" name="bio" value={this.state.bio} placeholder="" onChange={this.handleInputChange}></textarea>
                </div>
              </div>
              <br />
              <p className="is-size-7 has-text-grey has-text-weight-semibold">Social Links</p>
              <p className="is-size-7 has-text-grey mb-2">Add social links to your profile so that your audience can find you everywhere you are.</p>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Youtube</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" name="youtube" value={this.state.youtube} placeholder="URL" onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Instagram</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" name="instagram" value={this.state.instagram} placeholder="URL" onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Tiktok</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" name="tiktok" value={this.state.tiktok} placeholder="URL" onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Twitter</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" name="twitter" value={this.state.twitter} placeholder="URL" onChange={this.handleInputChange} />
                </div>
              </div>
              {/* <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Personal</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" name="personal" value={this.state.personal} placeholder="URL" onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Shopping</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="text" name="shopping" value={this.state.shopping} placeholder="URL" onChange={this.handleInputChange} />
                </div>
              </div> */}
              <br />
              <p className="is-size-7 has-text-grey has-text-weight-semibold">Personal Information</p>
              <p className="is-size-7 has-text-grey mb-2">Provide your personal information, even if the account is used for a business. This won't be a part of your public profile.</p>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Email</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" disabled type="email" name="email" value={this.state.email} placeholder="Email" />
                </div>
              </div>
              <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Phone Number</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <input className="input" type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={this.state.phone} placeholder="123-123-1234" onChange={this.handleInputChange} />
                </div>
              </div>
              {/* <div className="field">
                <div className="level is-mobile mb-2">
                  <div className="level-left">
                    <div className="level-item">
                      <label className="label">Timezone</label>
                    </div>
                  </div>
                  <div className="level-right">
                  </div>
                </div>
                <div className="control">
                  <div className="select">
                    <select name="timezone" value={this.state.timezone} onChange={this.handleInputChange}>
                      {momentTimezone.tz.zonesForCountry('US').map(timezone => <option key={timezone} value={timezone}>{timezone.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>
              </div> */}
              {this.state.isAboutSaved ? <label className="help is-success">Saved!</label> : null}
              {this.state.aboutError ? <label className="help is-danger">{this.state.aboutError}</label> : null}
              {saveButton}
            </form>
            {/* <br />
            <p className="title is-4">Settings</p>
            <hr />
            <div>
              <div className="field">
                <label className="label">Delete account</label>
                <p className="is-size-6 has-text-grey">
                  Send us an email and we'll delete your account.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      );
    }

    return (
      <LoadingIcon />
    );
  }
}
