import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import LoadingIcon from './LoadingIcon.js';

class TodaySessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isLoading: true,
      error: ''
    }
  }

  componentDidMount() {
    Meteor.call('bookingsGetUserBookingsToday', (err, res) => {
      if (err) {
        // console.log('bookingsGetUserBookingsToday err: ', err);
        this.setState({
          error: err.reason,
          isLoading: false
        });
      } else {
        // console.log('bookingsGetUserBookingsToday res: ', res);
        this.setState({
          bookings: res,
          isLoading: false
        });
      }
    });
  }

  renderTodaysBookings() {
    if (!this.state.isLoading && this.state.bookings.length > 0) {
      return this.state.bookings.map((booking) => {
        const productDuration = booking.product.duration;
        const customerName = `${booking.firstname} ${booking.lastname}`;
        const startTime = moment(booking.selectedTimeCreatorLocal);
        const endTime = moment(booking.selectedTimeCreatorLocal).add(productDuration, 'minutes');

        const sessionPath = `/s/${booking.roomId}?password=${booking.creatorSessionAccessCode}`;
        return (
          <div key={booking._id} className="notification is-light">
            <p className="title is-6">{booking.product.title} <span className="has-text-weight-normal">with</span> {customerName}</p>
            <p className="subtitle is-7 mb-2">{startTime.format('h:mm a')} - {endTime.format('h:mm a')}</p>
            <p className="is-size-7 has-text-weight-semibold">Session topic:</p>
            <p className="is-size-7 overflow-y-scroll mb-2" style={{ maxHeight: '2rem'}}>{booking.description}</p>
            <span className="tag is-link has-pointer" onClick={() => this.props.history.push(sessionPath)}>Join</span>
          </div>
        );
      });
    } else if (!this.state.isLoading && this.state.bookings.length === 0) {
      return <p className="help has-text-centered">No upcoming sessions today</p>;
    }

    return (
      <LoadingIcon />
    );
  }

  render() {
    const now = moment();
    const timeFormatted = now.format('h:mm a');
    const dateFormatted = now.format('dddd, MMMM D, YYYY');

    return (
      <div className="column is-half">
        <div className="box">
          <div className="notification is-white has-text-centered has-text-white" style={{background: `url('/images/park3.png')`, backgroundSize: 'cover', height: '8rem'}}>
            <p className="title is-3">{timeFormatted}</p>
            <p className="subtitle is-5">{dateFormatted}</p>
          </div>
          {this.state.error ? <p className="help is-danger has-text-centered">{this.state.error}</p> : null}
          {this.renderTodaysBookings()}
        </div>
      </div>
    );
  }
}

export default withRouter(TodaySessions);
