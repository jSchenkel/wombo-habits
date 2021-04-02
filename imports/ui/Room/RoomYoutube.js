import React from 'react';
import { Meteor } from 'meteor/meteor';
// import YouTube from 'react-youtube';

export default class RoomYoutube extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // playerVars: https://developers.google.com/youtube/player_parameters
    this.youtubeOptions = {
      playerVars: {
        playsinline: 1,
        rel: 0,
        // NOTE: I could disable the default controls and add my own controls below the video?
        // I can add my own full screen button which makes the video big and overlays video call blocks
        controls: 1,
        modestbranding: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        origin: Meteor.settings.public.BASE_URL,
        start: this.props.room && this.props.room.youtubeVideoPlayerCurrentTime ? this.props.room.youtubeVideoPlayerCurrentTime : 0
      },
      width: '100%',
      height: '360'
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  renderYoutubeVideo() {
    const room = this.props.room;

    if (room && room.youtubeUrl && room.youtubeVideoId) {
      return null;
      // return (
      //   <YouTube
      //     videoId={room.youtubeVideoId}
      //     opts={this.youtubeOptions}
      //     onReady={this.props.youtubeOnReady}
      //     onPlay={this.props.youtubeOnPlay}
      //     onPause={this.props.youtubeOnPause}
      //     onStateChange={this.props.youtubeOnStateChange}
      //    />
      // );
    }

    return (
      <div className="has-background-white-ter columns is-centered is-vcentered" style={{height: '360px', width: '100%', borderRadius: '1%'}}>
        <div className="column is-one-third">
          <a className="button" onClick={() => this.props.handleModalOpen('videos')}>
            <span>Choose class</span>
          </a>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="column is-three-fifths">
        {this.renderYoutubeVideo()}
      </div>
    );
  }
}
