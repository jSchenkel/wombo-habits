import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import LoggedInNavbar from './Navbar/LoggedInNavbar.js';
import LoadingIcon from './LoadingIcon.js';
import Footer from './Footer.js';

import { convertCentsToDollars, makeDollarFeeDisplayable } from '../helpers/payments.js';

export default class PrivateQuestionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      question: null,
      isQuestionLoading: true,
      questionError: '',
      // upload state
      isUploading: false,
      uploadError: '',
      isUploadSuccess: false
    };

    this.handleAudioChange = this.handleAudioChange.bind(this);
  }

  componentDidMount() {
    // get current user
    // TODO: this should be moved to a parent component so that we dont make repetitive requests to backend
    Meteor.call('getCurrentUserAccount', (err, res) => {
      if (err) {
        // console.log('getCurrentUserAccount err: ', err);
      } else {
        // console.log('getCurrentUserAccount res: ', res);
        this.setState({
          currentUser: res
        });
      }
    });

    const questionId = this.props.match.params.questionId;
    Meteor.call('questionsGetPrivateQuestion', questionId, (err, res) => {
      if (err) {
        // console.log('questionsGetPrivateQuestion err: ', err);
        this.setState({
          isQuestionLoading: false,
          questionError: err.reason,
        });
      } else {
        this.setState({
          question: res,
          isQuestionLoading: false,
          questionError: '',
        });
      }
    });
  }

  handleAudioChange(event) {
    const questionId = this.props.match.params.questionId;
    const target = event.target;
    const file = target.files[0];

    this.setState({
      isUploading: true,
    });

    Meteor.call('getSignedUploadUrl', file.type, (err, res) => {
      if (err) {
        // console.log('getSignedUploadUrl err: ', err);
        this.setState({
          uploadError: err.reason,
          isUploading: false
        });
      } else {
        if (res) {
          // console.log('getSignedUploadUrl res: ', res);

          // key -> unique id for the image in s3
          const key = res.key;
          // url -> signed s3 upload url
          const url = res.url;
          axios.put(url, file, {
            headers: {
              'Content-Type': file.type
            }
          })
          .then((response) => {
            // console.log(response);
            // console.log('s3 put success');
            // can add check, if response.statusCode === 200
            if (response.status === 200) {
              // console.log(inputUrl, key);
              const S3_BASE_URL = 'https://s3.amazonaws.com/wombo-campaigns/';
              const answerAudioUrl = `${S3_BASE_URL}${key}`;
              Meteor.call('questionsSubmitAnswer', questionId, answerAudioUrl, (err, res) => {
                if (err) {
                  // console.log('questionsSubmitAnswer err: ', err);
                  this.setState({
                    uploadError: err.reason,
                    isUploading: false
                  });
                } else {
                  // Handle success
                  // show success message and link to the public question URL
                  this.setState({
                    isUploadSuccess: true,
                    uploadError: '',
                    isUploading: false
                  });
                }
              });
            }
          })
          .catch((error) => {
            // handle upload error
            // should clean up imageUrl, imageFileName, and reset the file data from the event.target?
            // show message that there was an error and to try again
            this.setState({
              uploadError: 'An issue occurred while uploading your audio file. Please try again.',
              isUploading: false
            });
          });
        }
      }
    });
  }

  renderBody() {
    const questionId = this.props.match.params.questionId;
    if (this.state.isQuestionLoading) {
      return <LoadingIcon />;
    } else if (!this.state.currentUser) {
      return <LoadingIcon />;
    } else if (this.state.isUploadSuccess) {
      return (
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <div className="box">
              <div className="media mb-5">
                <div className="media-left">
                  <span className="icon is-large has-text-success">
                    <i className="fas fa-check-circle fa-2x"></i>
                  </span>
                </div>
                <div className="media-content">
                  {/* Your session with {this.props.profile.name} is booked! */}
                  <p className="title is-4">Answer submitted</p>
                  <p className="subtitle is-6">You can view the public Question & Answer post <Link to={`/q/${questionId}`}>here</Link></p>
                </div>
              </div>
              <Link className="button is-light" to="/accounts/home">Go home</Link>
            </div>
          </div>
        </div>
      );
    } else if (!this.state.isQuestionLoading && this.state.question) {
      const question = this.state.question;
      // Get rate
      const feeInDollars = convertCentsToDollars(question.feeInformation.baseFee);
      const feeFormatted = makeDollarFeeDisplayable(feeInDollars);

      let askerMediaJSX = (
        <article className="media">
          <figure className="media-left">
            <span className="icon is-medium">
              <i className="fas fa-user-circle fa-2x"></i>
            </span>
          </figure>
          <div className="media-content">
            <div className="content">
              <p className="mb-2 has-text-grey-dark">
                <strong>{question.firstname}</strong> <small>{moment(question.created).fromNow()}</small>
              </p>
              <p>{question.displayableDescription}</p>
            </div>
          </div>
        </article>
      );

      if (question.asker) {
        askerMediaJSX = (
          <article className="media">
            <figure className="media-left">
              <Link to={`/${question.asker.username}`} className="image is-32x32">
                <img className="is-rounded" style={{ border: '1px solid lightgray' }} src={question.asker.profilePictureImageUrl ? question.asker.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
              </Link>
            </figure>
            <div className="media-content">
              <div className="content">
                <Link to={`/${question.asker.username}`} className="mb-2 has-text-grey-dark">
                  <strong>{question.asker.name}</strong> <small>@{question.asker.username}</small> <small>{moment(question.created).fromNow()}</small>
                </Link>
                <p>{question.displayableDescription}</p>
              </div>
            </div>
          </article>
        );
      }

      return (
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <div className="box">
              <div className="level is-mobile mb-0">
                <div className="level-left">
                  <div className="level-item">
                  <p className="title is-4">Question</p>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <span className="tag is-success">${feeFormatted}</span>
                  </div>
                </div>
              </div>
              <br />
              {askerMediaJSX}
              {/* <p className="subtitle is-6 mb-3 has-text-grey">{moment(question.created).fromNow()}</p> */}
              {/* <p className="is-size-6 mb-2">{question.description}</p> */}
              <hr />
              <p className="title is-4">Answer</p>
              {this.state.uploadError ? <label className="help is-danger">{this.state.uploadError}</label> : null}
              <p className="is-size-7 has-text-grey mb-2">Upload an audio recording of your answer.</p>
              {this.state.isUploading ? (
                <div className="field">
                  <div className="control">
                    <button className="button is-link is-loading">Upload audio</button>
                  </div>
                </div>
              ) : (
                <div className="field">
                  <div className="file is-link">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="audio/*,.m4a,.ogg,.mp3,.wav,.mp4"
                        capture
                        onChange={this.handleAudioChange}
                      />
                      <span className="file-cta">
                        <span className="file-label">
                          Upload audio
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              )}
              <p className="is-size-7 has-text-grey">Need help recording audio on Mac? Click <a href="https://support.apple.com/guide/quicktime-player/record-audio-qtpf25d6f827/mac" target="_blank">here</a>.</p>
              <p className="is-size-7 has-text-grey">In Safari on iOS, "Upload audio" will open up the microphone app, allowing you to record audio and then send it back to Wombo.</p>
              {/* <p className="is-size-7 has-text-grey">Wombo audio recorder coming soon...</p> */}
              {/* TODO<p className="is-size-7 has-text-grey">Record answer coming soon...</p> */}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="columns is-centered">
        <div className="column is-half">
          <p className="title is-4">Sorry, this page isn't available.</p>
          <p className="subtitle is-6">The link you followed may be broken, or the page may have been removed. {!!this.state.currentUser ? <Link to="/accounts/home">Go back to Wombo</Link> : <Link to="/">Go back to Wombo</Link>}</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <LoggedInNavbar currentUser={this.state.currentUser} />
          <div className="hero-body">
            <div className="container">
              {this.renderBody()}
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
