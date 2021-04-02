import React from 'react';
import { Meteor } from 'meteor/meteor';
import axios from 'axios';

export default class ProfilePictureChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      isUploading: false,
      isRemoving: false,
      error: ''
    };
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleProfilePictureChange = this.handleProfilePictureChange.bind(this);
    this.removeProfilePicture = this.removeProfilePicture.bind(this);
  }

  handleModalOpen() {
    this.setState({ modalIsOpen: true, isUploading: false, isRemoving: false, error: '' });
  }

  handleModalClose() {
    this.setState({ modalIsOpen: false, isUploading: false, isRemoving: false, error: '' });
  }

  handleProfilePictureChange(event) {
    const profilePictureImageUrl = this.props.profilePictureImageUrl;

    // TODO: right now if the uploaded image doesnt have an aspect ration of 1, then the image looks bad when displayed.
    // we should enforce aspect ratios of 1, but doing some preprocessing of the image
    // - could automatically crop to 1:1
    // - could preview the image and allow them to drag a 1:1 box to the part of the image they want to keep.
    const target = event.target;
    const file = target.files[0];

    this.setState({
      isUploading: true,
    });

    // if a profilePictureImageUrl already exists for the user and the user is uploading a new one then delete the original from s3
    if (profilePictureImageUrl) {
      // Parse the s3 image key from the image url
      const imageKey = profilePictureImageUrl.replace('https://s3.amazonaws.com/wombo-campaigns/', '');
      Meteor.call('deleteObject', imageKey, (err, res) => {
        if (err) {
          // console.log('deleteObject err: ', err);
        } else {}
      });
    }

    Meteor.call('getSignedUploadUrl', file.type, (err, res) => {
      if (err) {
        // console.log('getSignedUploadUrl err: ', err);
        this.setState({
          error: err.reason,
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
              const profilePictureImageUrl = `${S3_BASE_URL}${key}`;
              Meteor.call('updateCurrentUserProfilePicture', profilePictureImageUrl, (err, res) => {
                if (err) {
                  // console.log('updateCurrentUserProfilePicture err: ', err);
                  this.setState({
                    error: err.reason,
                    isUploading: false
                  });
                } else {
                  // Handle success

                  // call the passed onUpload function
                  if (this.props.onUpload) {
                    // in Profile Component, this should fetch the user object with latest data and update state
                    this.props.onUpload();
                  }

                  // close modal
                  // dont need to explicitly close modal because the component gets unmounted when parent reloads data
                  // this.handleModalClose();
                }
              });
            }
          })
          .catch((error) => {
            // handle upload error
            // should clean up imageUrl, imageFileName, and reset the file data from the event.target?
            // show message that there was an error and to try again
            this.setState({
              error: 'An issue occurred while uploading your new photo. Please try again.',
              isUploading: false
            });
          });
        }
      }
    });
  }

  removeProfilePicture() {

    const profilePictureImageUrl = this.props.profilePictureImageUrl;
    // if we dont have any image to delete then dont do anything and close modal
    if (!profilePictureImageUrl) {
      this.handleModalClose();
      return;
    }

    this.setState({
      isRemoving: true,
    });

    // Parse the s3 image key from the image url
    const imageKey = profilePictureImageUrl.replace('https://s3.amazonaws.com/wombo-campaigns/', '');
    Meteor.call('deleteObject', imageKey, (err, res) => {
      if (err) {
        // console.log('deleteObject err: ', err);
        this.setState({
          error: err.reason
        });
      } else {
        // console.log('deleteObject success');

        // now that the image has been deleted, lets set the profile image url to '' on the user
        Meteor.call('updateCurrentUserProfilePicture', '', (err, res) => {
          if (err) {
            // console.log('updateCurrentUserProfilePicture err: ', err);
            this.setState({
              error: err.reason
            });
          } else {
            // Handle success
            // call the passed onRemove function
            if (this.props.onRemove) {
              // in Profile Component, this should fetch the user object with latest data and update state
              this.props.onRemove();
            }

            // close modal
            // dont need to explicitly close modal because the component gets unmounted when parent reloads data
            // this.handleModalClose();
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="has-pointer" onClick={this.handleModalOpen}>
          {this.props.children}
        </div>
        <div className={this.state.modalIsOpen ? 'modal is-active' : 'modal'}>
          <div className="modal-background" onClick={this.handleModalClose}></div>
          <div className="modal-content">
            <div className="box">
              <p className="title is-size-5 has-text-weight-semibold">Change Profile Photo</p>
              {this.state.error ? <label className="help is-danger">{this.state.error}</label> : null}
              <p className="is-size-7 has-text-grey mb-2">Please make sure your image has a 1:1 aspect ratio (ex. 256x256 or 512x512)</p>
              {this.state.isUploading ? (
                <div className="field">
                  <div className="control">
                    <button className="button is-link is-loading">Upload photo</button>
                  </div>
                </div>
              ) : (
                <div className="field">
                  <div className="file is-link">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="image/*"
                        onChange={this.handleProfilePictureChange}
                      />
                      <span className="file-cta">
                        <span className="file-label">
                          Upload photo
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <button className={this.state.isRemoving ? 'button is-danger is-loading' : 'button is-danger'} onClick={this.removeProfilePicture} disabled={this.state.isUploading || !this.props.profilePictureImageUrl}>Remove current photo</button>
              <hr />
              <button className="button" onClick={this.handleModalClose} disabled={this.state.isUploading || this.state.isRemoving}>Cancel</button>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={this.handleModalClose}></button>
        </div>
      </div>
    );
  }
}
