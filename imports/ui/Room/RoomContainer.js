import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Peer from 'simple-peer';
import moment from 'moment';

// helpers
import { isAuthenticated } from './../../helpers/auth.js';

import NavbarBrandImage from '../Navbar/NavbarBrandImage.js';
import RoomPeers from './RoomPeers.js';
import RoomModal from './RoomModal.js';
import Footer from './../Footer.js';
import InfoTooltip from './../blocks/InfoTooltip.js';
import LoadingIcon from './../LoadingIcon.js';

import { Rooms } from './../../api/rooms.js';
import { Connections } from './../../api/connections.js';

class RoomContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      error: '',
      roomId: '',
      // current user id is the unique access token used by the customer/creator
      currentUserId: '',
      currentUserStream: '',
      // on join data
      joinError: '',
      booking: null,
      userType: '',
      iceServers: [],
      isJoining: true,
      // stores all streams that user has received
      // drives video ui
      streams: [],
      // modal
      activeModal: 'welcome',
      isModalOpen: true,
    };

    // bind methods
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.getUserMedia = this.getUserMedia.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.onJoinAction = this.onJoinAction.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.clearTimeout = this.clearTimeout.bind(this);

    // a store for all of the peer objects that are created (key: connectionId, value: peer object)
    this.peerStore = {}

    // keep track of connectionIds that the user has received streams for
    this.connectedConnectionIds = []

    // refs
    this.userVideo = React.createRef();

    // save the timestamp for when the user joined the session
    this.timestampJoined = moment();
  }

  componentDidMount() {
    // get ids
    const roomId = this.props.match.params.id;
    const searchParams = new URLSearchParams(this.props.location.search);
    const password = searchParams.get('password');

    this.setState({
      roomId,
      currentUserId: password ? password : '',
      isAuthenticated: isAuthenticated()
    });
  }

  componentWillUnmount() {
    if (this.peerStore) {
      const peers = Object.values(this.peerStore);

      peers.forEach((peer) => {
        // console.log('peer destroyed');
        peer.destroy();
      });
    }

    // Stop tracker
    if (this.trackerInitiator) {
      this.trackerInitiator.stop();
    }

    if (this.trackerAcceptor) {
      this.trackerAcceptor.stop();
    }

    // stop timeout if running
    this.clearTimeout();

    // stop camera and voice stream
    const userVideo = this.userVideo.current;
    if (userVideo && userVideo.srcObject) {
      const stream = userVideo.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    }

    Meteor.call('roomsLeaveRoom', this.state.roomId, this.state.currentUserId, (err,res) => {});
  }

  onJoinAction() {
    if (!this.state.currentUserId) {
      return;
    }
    this.getUserMedia();
  }

  getUserMedia() {
    this.setState({
      isModalOpen: true,
      activeModal: 'gettingMedia'
    });

    const mediaConstraints = {
      audio: {
        echoCancellation: true
      },
      video: {
        facingMode: 'user'
      }
    };

    // get video/voice stream
    navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then(stream => {
        // NOTE: can currentUserStream be saved as a class attribute? why in state?
        this.setState({
          currentUserStream: stream,
          isModalOpen: false,
          activeModal: ''
        });

        if (this.userVideo.current) {
          this.userVideo.current.srcObject = stream;
        }

        // join the room and handle webrtc peer connections
        this.joinRoom();
      })
      .catch(err => {
        console.log('err: ', err);
        this.setState({
          isModalOpen: true,
          activeModal: 'mediaError'
        });
      });
  }

  joinRoom() {
    const roomId = this.state.roomId;
    const currentUserId = this.state.currentUserId;

    // join the room
    Meteor.call('roomsJoinRoom', roomId, currentUserId, (err, res) => {
      if (err) {
        // console.log('roomsJoinRoom err: ', err);
        this.setState({
          joinError: err.reason,
          isJoining: false
        });
        analytics.track('Session Joined Error', {
          roomId: roomId,
          userId: currentUserId,
          connections: this.state.streams.length,
          error: err.reason
        });

        // stop camera and voice stream
        const userVideo = this.userVideo.current;
        if (userVideo && userVideo.srcObject) {
          const stream = userVideo.srcObject;
          const tracks = stream.getTracks();

          tracks.forEach((track) => {
            track.stop();
          });
        }
      } else {
        if (res) {
          // console.log('roomsJoinRoom res: ', res);
          analytics.track('Session Joined', {
            roomId: roomId,
            userId: currentUserId,
            connections: this.state.streams.length,
            userType: res.userType          });

          const booking = res.booking;
          const userType = res.userType;

          this.setState({
            booking: res.booking,
            userType: res.userType,
            iceServers: res.iceServers,
            isJoining: false,
            joinError: ''
          });

          this.timestampJoined = moment();

          // initialize the connection trackers
          // handle initiating and accepting connections
          this.trackerInitiator = Tracker.autorun(() => {
            Meteor.subscribe('connections', roomId, currentUserId);
            const connections = Connections.find({
              roomId,
              isClosed: false,
              initiatorId: currentUserId
            }).fetch();
            // console.log('~~trackerInitiator~~');
            // console.log('db connections: ', connections);
            // console.log('state streams: ', this.state.streams);
            // console.log('connectedConnectionIds: ', this.connectedConnectionIds);
            // console.log('this.peerStore: ', Object.keys(this.peerStore));

            if (connections && connections.length > 0) {
              // console.log('connections: ', connections);
              for (const connection of connections) {
                const connectionId = connection._id;
                const initiatorId = connection.initiatorId;
                const acceptorId = connection.acceptorId;
                const initiatorSignalData = connection.initiatorSignalData;
                const acceptorSignalData = connection.acceptorSignalData;

                // continue if the connection is closed
                if (connection.isClosed) {
                  continue;
                }

                // the possible cases throughout the lifecycle of the connection
                // dont process additional connections if the 4 connections limit has already been met
                if (initiatorId === currentUserId) {
                  // current user is the initiator
                  if (!initiatorSignalData && acceptorId && !acceptorSignalData) {
                    // initiator needs to signal
                    // FYI: trickle: true => signal fires once, trickle: false => signal fires multiple times (trickling data)
                    if (this.state.currentUserStream && !this.peerStore[connectionId]) {
                      this.peerStore[connectionId] = new Peer({
                        initiator: true,
                        config: { iceServers: this.state.iceServers},
                        trickle: false,
                        stream: this.state.currentUserStream,
                      });

                      this.peerStore[connectionId].on('signal', data => {
                        // console.log('initiator signaled: ', data);
                        Meteor.call('connectionsInitiatorSignaled', connectionId, data, (err, res) => {
                          if (err) {
                            console.log('connectionsInitiatorSignaled err: ', err);
                          } else {
                            // console.log('connectionsInitiatorSignaled res: ', res);
                          }
                        });
                      });

                      this.peerStore[connectionId].on('stream', stream => {
                        // console.log('initiator received steam');
                        this.addStream(connectionId, stream);
                      });

                      this.peerStore[connectionId].on('close', () => {
                        Meteor.call('connectionsCloseConnection', connectionId, '', (err, res) => {
                          if (err) {
                            console.log('connectionsCloseConnection err: ', err);
                          } else {
                            // console.log('connectionsCloseConnection res: ', res);
                          }
                        });
                        this.removeStream(connectionId);
                        // console.log('initiator connection closed');
                      });

                      this.peerStore[connectionId].on('error', (error) => {
                        Meteor.call('connectionsCloseConnection', connectionId, error.code, (err, res) => {
                          if (err) {
                            console.log('connectionsCloseConnection err: ', err);
                          } else {
                            // console.log('connectionsCloseConnection res: ', res);
                          }
                        });
                        this.removeStream(connectionId);
                        this.setState({
                          error: 'Connection closed'
                        }, () => {
                          this.clearTimeout();
                          this.setTimeout = Meteor.setTimeout(() => {
                            this.setState({error: ''});
                          }, 7 * 1000);
                        });
                        // console.log('initiator connection error: ', error, error.code);
                      });
                    } else {
                      // we dont have a media stream for current user. should never get hear
                      // console.log('initiator no stream');
                    }
                  } else if (initiatorSignalData && acceptorId && acceptorSignalData) {
                    // acceptor signaled back. need to process acceptorSignalData to establish connection
                    // We only want to signal once so keep track of the conneciton in connectedConnectionIds
                    if (!this.connectedConnectionIds.includes(connectionId)) {
                      // console.log('initiator received acceptor signal data');
                      this.peerStore[connectionId].signal(acceptorSignalData);
                      this.connectedConnectionIds.push(connectionId);
                    } else {
                      // console.log('initiator ALREADY received acceptor signal data');
                    }
                  }
                }
              }
            }
          });

          // acceptor connections tracker
          this.trackerAcceptor = Tracker.autorun(() => {
            Meteor.subscribe('connections', roomId, currentUserId);
            const connections = Connections.find({
              roomId,
              isClosed: false,
              acceptorId: currentUserId
            }).fetch();
            // console.log('~~trackerAcceptor~~');
            // console.log('db connections: ', connections);
            // console.log('state streams: ', this.state.streams);
            // console.log('connectedConnectionIds: ', this.connectedConnectionIds);
            // console.log('this.peerStore: ', Object.keys(this.peerStore));

            if (connections && connections.length > 0) {
              // console.log('connections: ', connections);
              for (const connection of connections) {
                const connectionId = connection._id;
                const initiatorId = connection.initiatorId;
                const acceptorId = connection.acceptorId;
                const initiatorSignalData = connection.initiatorSignalData;
                const acceptorSignalData = connection.acceptorSignalData;

                // continue if the connection is closed
                if (connection.isClosed) {
                  continue;
                }

                // the possible cases throughout the lifecycle of the connection
                // dont process additional connections if the 4 connections limit has already been met
                if (acceptorId === currentUserId) {
                  // current user is the acceptor
                  if (initiatorId && initiatorSignalData && !acceptorSignalData && !this.connectedConnectionIds.includes(connectionId)) {
                    // initiator signaled, acceptor needs to accept and signal back
                    if (this.state.currentUserStream && !this.peerStore[connectionId]) {
                      this.peerStore[connectionId] = new Peer({
                        initiator: false,
                        config: { iceServers: this.state.iceServers},
                        trickle: false,
                        stream: this.state.currentUserStream,
                      });

                      this.peerStore[connectionId].on('signal', data => {
                        // console.log('acceptor signaled: ', data);
                        Meteor.call('connectionsAcceptConnection', connectionId, data, (err, res) => {
                          if (err) {
                            console.log('connectionsAcceptConnection err: ', err);
                          } else {
                            // console.log('connectionsAcceptConnection res: ', res);
                          }
                        });
                      });

                      this.peerStore[connectionId].on('stream', stream => {
                        // console.log('acceptor received steam');
                        this.addStream(connectionId, stream);
                      });

                      this.peerStore[connectionId].on('close', () => {
                        // we dont want to call this method twice (by initiator and acceptor).
                        // i just arbitrarily decided that the acceptor peer will call this method and update the connection document
                        Meteor.call('connectionsCloseConnection', connectionId, '', (err, res) => {
                          if (err) {
                            console.log('connectionsCloseConnection err: ', err);
                          } else {
                            // console.log('connectionsCloseConnection res: ', res);
                          }
                        });
                        this.removeStream(connectionId);
                        // console.log('acceptor connection closed');
                      });

                      this.peerStore[connectionId].on('error', (error) => {
                        Meteor.call('connectionsCloseConnection', connectionId, error.code, (err, res) => {
                          if (err) {
                            console.log('connectionsCloseConnection err: ', err);
                          } else {
                            // console.log('connectionsCloseConnection res: ', res);
                          }
                        });
                        this.removeStream(connectionId);
                        this.setState({
                          error: 'Connection closed'
                        }, () => {
                          this.clearTimeout();
                          this.setTimeout = Meteor.setTimeout(() => {
                            this.setState({error: ''});
                          }, 7 * 1000);
                        });
                        // console.log('acceptor connection error: ', error, error.code);
                      });

                      this.peerStore[connectionId].signal(initiatorSignalData);
                      this.connectedConnectionIds.push(connectionId);
                    } else {
                      // console.log('acceptor no stream');
                    }
                  }
                }
              }
            }
          });
        } else {
          // no match found
          this.props.history.replace('/');
        }
      }
    });
  }

  onInputChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
      error: ''
    });
  }

  clearTimeout() {
    if (this.setTimeout) {
      Meteor.clearTimeout(this.setTimeout);
    }
  }

  handleModalClose() {
    this.setState({
      isModalOpen: false,
      activeModal: '',
      error: ''
    });
  }

  handleModalOpen(activeModal) {
    this.setState({
      isModalOpen: true,
      activeModal,
      error: ''
    });
  }

  addStream(connectionId, stream) {
    // console.log('addStream connectionId: ', connectionId);
    const newStreams = [...this.state.streams];
    newStreams.push({
      id: connectionId,
      stream
    });

    this.setState({
      streams: newStreams
    });
  }

  removeStream(connectionId) {
    const streams = this.state.streams.filter(c => c && c.id !== connectionId);
    this.connectedConnectionIds = this.connectedConnectionIds.filter(c => c !== connectionId);

    this.setState({streams});
  }

  render() {
    const shareUrl = `${Meteor.settings.public.BASE_URL}/session/${this.state.roomId}`;
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          <div className="hero-head">
            <div className="container">
              <div className="level is-mobile my-1">
                <div className="level-left">
                  <Link to="/" className="level-item is-hidden-mobile">
                    <NavbarBrandImage />
                  </Link>
                  <Link to="/" className="level-item is-hidden-tablet">
                    <NavbarBrandImage />
                  </Link>
                </div>
                <div className="level-right">
                  <span className="level-item">
                    <div className="dropdown is-hoverable is-right">
                      <div className="dropdown-trigger">
                        <button className="button is-white" aria-haspopup="true" aria-controls="dropdown-menu">
                          <span className="icon is-small has-text-dark">
                            <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                          </span>
                        </button>
                      </div>
                      <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                          <a className="dropdown-item" onClick={() => this.setState({isModalOpen: true, activeModal: 'audioHelp'})}>
                            Audio issues
                          </a>
                          <Link to="/contact/feedback" target="_blank" className="dropdown-item">
                            Feedback
                          </Link>
                          <Link to="/" className="dropdown-item">
                            Leave session
                          </Link>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-body">
            <div className="container">
              {this.state.error ? <p className="help is-danger">{this.state.error}</p> : null}
              {this.state.joinError ? <p className="help is-danger has-text-centered">{this.state.joinError}</p> : null}
              <div className="level is-mobile">
                <div className="level-left">
                </div>
                <div className="level-right">
                  {/* {this.state.room && this.state.room.usersCount ? <p className="level-item">{this.state.room.usersCount} joined <InfoTooltip text="Total number of participants"/></p> : null} */}
                </div>
              </div>
              <div className="columns">
                <RoomPeers streams={this.state.streams} userVideo={this.userVideo} />
                <div className="column is-one-third">
                  {!this.state.isJoining && this.state.booking ? (
                    <div className="columns is-multiline">
                      <div className="column is-full">
                        <div className="box">
                          <p className="is-size-7 has-text-weight-semibold">Session details</p>
                          <p className="is-size-7 has-text-weight-semibold">Service:</p>
                          <p className="is-size-7 mb-1">{this.state.booking.product.title} ({this.state.booking.product.duration}mins)</p>
                          <span className="is-size-7 has-text-weight-semibold">Date and time:</span>
                          <p className="is-size-7 mb-1">{moment(this.state.booking.selectedTimeUtc).format('dddd, MMMM D, YYYY [at] h:mm a')}</p>
                          <span className="is-size-7 has-text-weight-semibold">Session topic:</span>
                          <p className="is-size-7 overflow-y-scroll mb-1" style={{ maxHeight: '6rem'}}>{this.state.booking.description}</p>
                        </div>
                      </div>
                      {/* <div className="column is-full">
                        <div className="box">
                          <p>messaging</p>
                        </div>
                      </div> */}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="level is-mobile">
                <div className="level-left">
                </div>
                <div className="level-right">

                </div>
              </div>
              {this.state.isJoining || this.state.joinError ? <div className="container"><LoadingIcon /></div> : (
                <div>
                  <hr />
                  <p className="is-size-6 has-text-weight-semibold" style={{marginBottom: '0.5rem'}}>How was your session?</p>
                  <div className="level is-mobile">
                    <div className="level-left">
                      <Link className="level-item button" to="/contact/feedback" target="_blank">Share feedback</Link>
                    </div>
                    <div className="level-right">
                      <Link className="level-item button is-danger" to="/">Leave</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={this.state.isModalOpen ? 'modal is-active' : 'modal'}>
              <div className="modal-background" onClick={() => {
                if (['audioHelp'].includes(this.state.activeModal)) {
                  this.handleModalClose();
                }
              }}></div>
              <div className="modal-content">
                <RoomModal
                  handleModalClose={this.handleModalClose}
                  onInputChange={this.onInputChange}
                  onJoinAction={this.onJoinAction}
                  activeModal={this.state.activeModal}
                  isModalOpen={this.state.isModalOpen}
                  currentUserId={this.state.currentUserId}
                />
              </div>
              {['audioHelp'].includes(this.state.activeModal) ? <button className="modal-close is-large" aria-label="close" onClick={this.handleModalClose}></button> : null}
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}

export default withRouter(RoomContainer);
