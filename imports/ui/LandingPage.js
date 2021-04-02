import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Navbar from './Navbar/Navbar.js';
import Footer from './Footer.js';

const LandingPage = () => {
  // question data using prod data to seed
  const QUESTION = {
    _id: 'EGES8i7j6',
    displayableDescription: 'What is Wombo?',
    created: moment().subtract(1, 'days'),
    submitted: moment().subtract(1, 'hours'),
    firstname: 'Natalie',
    // asker: {
    //   username: 'jules',
    //   name: 'Jules Schenkel',
    //   profilePictureImageUrl: ''
    // },
    // creator: {
    //   username: 'david',
    //   name: 'David Dobrik',
    //   profilePictureImageUrl: '/images/david_dobrik_profile.jpg'
    // },
    creator: {
      username: 'jules',
      name: 'Jules Schenkel',
      profilePictureImageUrl: 'https://s3.amazonaws.com/wombo-campaigns/rM2N8oKaqAHsy2oJb/5hURcW7AC.jpeg'
    },
    answerAudioUrl: 'https://s3.amazonaws.com/wombo-campaigns/rM2N8oKaqAHsy2oJb/Kh9m5TEgZ.x-m4a'
  };

  // TITLE
  // Audience Connection/Engagement Platform
  // Turn Your Fans into Super Fans
  // Connect with Your Fans in One Place
  // Personal, Centralized, and Monetizable Connection with Your Audience
  // Answer your Audience's Questions in One Place
  // Answer Your Audience's Questions and Get Paid
  const TITLE = (<span>The <span className="has-text-link">Q&A</span> Platform for Creators</span>);
  // const TITLE = (<span>Connect with Your Audience through <span className="has-text-link">Q&A</span></span>);
  // const TITLE = (<span>Answer Your Audience's Questions in <span className="has-text-link">One Place</span></span>);
  // const TITLE = (<span>Personalized Answers to Your Audience's <span className="has-text-link">Questions</span></span>);
  // const TITLE = (<span>Answer Your Audience's Questions at <span className="has-text-link">Scale</span></span>);
  // const TITLE = (<span>Interact With Your Audience at <span className="has-text-link">Scale</span></span>);
  // const TITLE = (<span>Answer Your Audience's Questions in <span className="has-text-link">One Place</span></span>);


  // Build deeper connections with your fans by answering their questions with personalized audio messages.
  // const SUBTITLE = `Wombo creates a dedicated space to receive questions from your audience and answer them with personalized audio messages.`;
  // const SUBTITLE = `Make your fans feel special by answering their questions with personalized audio messages.`;
  // Connect with your audience in a more personal way.
  // const SUBTITLE = `Create magical moments for your fans by answering their questions with personalized audio messages.`;
  // const SUBTITLE = `A dedicated place to receive questions and engage with your fans. Set your rate, share your URL, and respond to questions with personalized audio messages.`;
  // Answer your audience's questions with personalized audio messages and turn your fans into super fans.
  // const SUBTITLE = `Connect with your fans by answering their questions with personalized audio messages.`;
  // const SUBTITLE = `Connect with your audience through Q&A at scale. Answer all of your audience's questions in one place with personalized audio messages.`;
  const SUBTITLE = `Create a dedicated space to receive questions and connect with your audience. Set your rate, share your URL, and respond to questions with personalized audio messages.`;
  const BUTTON_TEXT = 'Request Invite';

  return (
    <div>
      <section className="hero has-background-white is-fullheight">
        <Navbar />
        <div className="hero-body">
          <div className="container">
            {/* HERO */}
            <div className="columns is-vcentered is-centered mb-6">
              <div className="column is-two-thirds">
                <div className="is-hidden-mobile has-text-centered">
                  <p className="title is-1 has-text-black-ter" style={{fontWeight: '800', fontSize: '3.6rem'}}>{TITLE}</p>
                  <p className="subtitle is-4 has-text-black-ter mb-6">{SUBTITLE}</p>
                  <Link to="/accounts/request-invite" className="button is-link">
                    <span>{BUTTON_TEXT}</span>
                    <span className="icon">
                      <i className="fas fa-chevron-right"></i>
                    </span>
                  </Link>
                </div>
                <div className="is-hidden-tablet has-text-centered">
                  <p className="title is-3 has-text-black-ter" style={{fontWeight: '800', fontSize: '3.2rem'}}>{TITLE}</p>
                  <p className="subtitle is-4 has-text-black-ter mb-6">{SUBTITLE}</p>
                  <Link to="/accounts/request-invite" className="button is-link">
                    <span>{BUTTON_TEXT}</span>
                    <span className="icon">
                      <i className="fas fa-chevron-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            {/* Q&A DEMO */}
            <p className="is-size-4 has-text-weight-bold has-text-centered has-text-black-ter mb-3">Check out a <span className="has-text-link">Q&A</span> in action</p>
            <div className="columns is-centered mb-6">
              <div className="column is-half">
                <div className="columns is-centered">
                  <div className="notification is-warning">DEMO</div>
                </div>
              </div>
            </div>
            {/* How it works */}
            <p className="title is-2 has-text-centered mb-6 has-text-black-ter" style={{fontWeight: '800', fontSize: '3.2rem'}}>How it Works</p>
            <div className="columns is-centered mb-6">
              <div className="column is-one-third">
                <div className="box">
                  <div className="media">
                    <div className="media-left">
                      <span className="icon is-medium has-text-link">
                        <i className="fas fa-dollar-sign fa-2x"></i>
                      </span>
                    </div>
                    <div className="media-content">
                      <p className="title is-4 has-text-black-ter">Set your rate</p>
                      <p className="subtitle is-6 has-text-black-ter">Set your rate and connect your bank account to receive payouts.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <div className="box">
                  <div className="media">
                    <div className="media-left">
                      <span className="icon is-medium has-text-link">
                        <i className="fas fa-question fa-2x"></i>
                      </span>
                    </div>
                    <div className="media-content">
                      <p className="title is-4 has-text-black-ter">Receive questions</p>
                      <p className="subtitle is-6 has-text-black-ter">Share your URL and collect questions from your audience in one place.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <div className="box">
                  <div className="media">
                    <div className="media-left">
                      <span className="icon is-medium has-text-link">
                        <i className="fas fa-microphone fa-2x"></i>
                      </span>
                    </div>
                    <div className="media-content">
                      <p className="title is-4 has-text-black-ter">Answer questions</p>
                      <p className="subtitle is-6 has-text-black-ter">Respond to questions with personalized audio messages.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA #2 */}
            <div className="columns">
              <div className="column">
                <div className="notification has-background-black-ter pt-6 pr-6 pb-6 pl-6 my-6">
                  <p className="title is-2 mb-6 has-text-white" style={{fontWeight: '800', fontSize: '3.2rem'}}>Request an Invite</p>
                  <p className="subtitle is-5 has-text-white mb-6">Answer your audience's questions with Wombo <br />and turn your fans into super fans.</p>
                  <Link to="/accounts/request-invite" className="button is-link">
                    <span>{BUTTON_TEXT}</span>
                    <span className="icon">
                      <i className="fas fa-chevron-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
        <Footer />
      </section>
    </div>
  );
}

export default LandingPage;
