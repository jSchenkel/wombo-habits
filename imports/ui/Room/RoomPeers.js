import React from 'react';

export default class RoomPeers extends React.Component {
  // console.log('this.props.connections: ', this.props.connections);
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only rerender this component if the streams prop changes
    if (nextProps.streams === this.props.streams) {
      return false;
    }
    return true;
  }

  render() {
    // when there are more than 3 OTHER streams (1 current user + 3 others = 4) then make the video streams smaller
    const videoColumnClassname = this.props.streams && this.props.streams.length > 3 ? 'column is-one-third' : 'column is-half';

    return (
      <div className="column is-two-thirds">
        <div className="columns is-multiline">
          <div className="column">
            <div className="columns is-multiline is-mobile">
              <div key='userVideo' className={videoColumnClassname}><video className="user-video" playsInline muted={true} ref={this.props.userVideo} autoPlay /></div>
              {this.props.streams.map((stream,  index) => {
                if (stream && stream.stream) {
                  return (<div key={stream.id} className={videoColumnClassname}><video className="user-video" playsInline ref={ref => {
                    if (ref) {
                      ref.srcObject = stream.stream;
                    }
                  }} autoPlay /></div>);
                }
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
