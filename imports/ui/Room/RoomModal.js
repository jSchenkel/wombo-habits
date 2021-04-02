import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

import { isAuthenticated } from './../../helpers/auth.js';

const RoomModal = (props) => {

  if (props.isModalOpen && props.activeModal === 'welcome') {
    const backLink = isAuthenticated() ? '/accounts/home' : '/';
    return (
      <div className="notification is-white">
        <p className="title is-4">Join session</p>
        <p className="subtitle is-6">Your virtual session is ready. Please enter your session access code below.</p>
        {/* <p className="is-size-7 has-text-grey">We're currently in public beta and are offering our products for free! In exchange, we'd really appreciate it if you left us some feedback at the end of your session. Thank you!</p>
        <br /> */}
        <div className="field">
          <label className="label">Session access code</label>
          <p className="control">
            <input className="input" type="text" name="currentUserId" value={props.currentUserId} placeholder="" onChange={props.onInputChange} />
          </p>
        </div>
        <a className="button is-link mb-2" onClick={props.onJoinAction}>Join now</a>
        <br />
        <p className="is-size-7 has-text-grey">Don't want to join? <Link to={backLink} className="is-size-7 has-text-grey">Go back</Link></p>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'gettingMedia') {
    return (
      <div className="notification is-white">
        <p className="subtitle is-6">To join the session, Wombo needs access to the microphone and camera.</p>
        <p className="is-size-7 has-text-grey">All sessions are secured with end-to-end encryption. Your audio and video data is end-to-end encrypted between you and your peers.</p>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'mediaError') {
    return (
      <div className="notification is-white">
        <p className="title is-4">Cannot access your microphone or camera</p>
        <p className="subtitle is-6">Refresh your browser and be sure to allow Wombo access to your microphone and camera.</p>
        <div className="field">
          <div className="control">
            <a className="button is-link" onClick={() => window.location.reload()}>
              Refresh
            </a>
          </div>
        </div>
      </div>
    );
  } else if (props.isModalOpen && props.activeModal === 'audioHelp') {
    return (
      <div className="notification is-white">
        {/* <button className="delete" onClick={() => props.handleModalClose()}></button> */}
        <p className="title is-4">Audio issues</p>
        {/* <p className="subtitle is-6"></p> */}
        <p className="is-size-6 has-text-weight-semibold">Audio feeback</p>
        <p className="is-size-6">To reduce feedback, lower your computer volume or try using headphones.</p>
        <br />
        <p className="is-size-6">Still need help? Send us a message <Link to="/contact/feedback" target="_blank">here</Link></p>
      </div>
    );
  }

  return null;
};

export default RoomModal;
