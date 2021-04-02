import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import LoadingIcon from '../LoadingIcon.js';

import { DAY_OF_WEEK_CODE_INT_TO_DAY_STRING } from '../../constants/products.js';
import { getTotalFee, convertDollarsToCents, convertCentsToDollars, makeDollarFeeDisplayable } from '../../helpers/payments.js';

const BookingModal = (props) => {
  const selectedProduct = props.selectedProduct;
  const timezone = props.customerTimezone;
  const timezoneReadable = timezone ? timezone.replace('_', ' ') : '';
  // console.log('selectedProduct: ', selectedProduct);

  if (props.isSelectedProductAvailabilityLoading) {
    return (
      <div className="box">
        <LoadingIcon />
      </div>
    );
  } else if (props.isSelectedProductAvailabilityError) {
    return (
      <div className="box">
        <p className="title is-size-5 has-text-weight-semibold">{selectedProduct.title}</p>
        <p className="has-text-weight-semibold has-text-danger">Something went wrong: {props.selectedProductAvailabilityError}</p>
        <button className="button is-link" onClick={props.handleModalClose}>Back</button>
      </div>
    );
  }

  const selectedProductAvailability = props.selectedProductAvailability;
  const availability = selectedProductAvailability.availability;
  const selectedTime = props.selectedTime;
  const day = moment(selectedTime).day();
  const dayString = DAY_OF_WEEK_CODE_INT_TO_DAY_STRING[day];
  const start = availability && availability[dayString].start;
  const end = availability && availability[dayString].end;
  const minTime = start && moment(start).toDate();
  // maxTime is inclusive so subtract the duration so that we dont allow users to book sessions that start at the time the availability ends
  const maxTime = end && moment(end).subtract(selectedProduct.duration, 'minutes').toDate();
  // DatePicker excludes times across dates so we have to take into account the selected date
  const excludeTimes = selectedProductAvailability.excludeTimes ?
    selectedProductAvailability.excludeTimes.map(excludeTime => moment(excludeTime).toDate()).filter(excludeTime => excludeTime.getDate() === selectedTime.getDate()) :
    [];

  // Get rate
  const rateInCents = convertDollarsToCents(selectedProduct.rate);
  const totalFeeInCents = getTotalFee(rateInCents);
  const totalFeeInDollars = convertCentsToDollars(totalFeeInCents);
  const totalFeeFormatted = makeDollarFeeDisplayable(totalFeeInDollars);
  return (
    <div className="box">
      <div className="columns">
        <div className="column is-one-third">
          <div className="image is-48x48 mb-2">
            <img className="is-rounded image-not-draggable" style={{ border: '1px solid lightgray' }} src={props.profile.profilePictureImageUrl ? props.profile.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
          </div>
          <p className="has-text-weight-semibold is-size-5">{props.profile.name}</p>
          <hr />
          <p className="is-size-7 has-text-grey has-text-weight-semibold">Service</p>
          <p className="has-text-weight-semibold is-size-6">{selectedProduct.title} <span className="has-text-grey">({selectedProduct.duration}mins)</span></p>
          <p className="is-size-7 has-text-grey overflow-y-scroll" style={{ maxHeight: '5rem'}}>{selectedProduct.description}</p>
          <br />
          <p className="is-size-7 has-text-grey has-text-weight-semibold">Price</p>
          <p className="has-text-weight-semibold is-size-6">${totalFeeFormatted}</p>
        </div>
        <div className="column">
          <p className="title is-5">Select a Date & Time</p>
          <DatePicker
            selected={selectedTime}
            onChange={date => props.handleSelectedTimeChanged(date)}
            showTimeSelect
            inline
            minDate={moment().toDate()}
            maxDate={moment().add(2, 'w').toDate()}
            filterDate={date => {
              // only display days that have some availability (a start and end value)
              const day = moment(date).day();
              const dayString = DAY_OF_WEEK_CODE_INT_TO_DAY_STRING[day];
              return availability[dayString].start && availability[dayString].end;
            }}
            excludeDates={[moment().toDate()]}
            minTime={minTime}
            maxTime={maxTime}
            // now we just need to exclude dates for times that are already booked
            // create a list of date/moment objects
            // excludeTimes
            timeIntervals={selectedProduct.duration}
            excludeTimes={excludeTimes}
          />
          <label className="help">
            <span className="icon mr-1">
              <i className="fas fa-clock"></i>
            </span>
            {timezoneReadable ? <span>{timezoneReadable}</span> : <span>Unknown timezone</span>}
          </label>
          <div className="level is-mobile mt-2">
            <div className="level-left">
              <div className="level-item">
                {selectedTime.getHours() ? <button className="button is-link" onClick={props.handleTimeSelected}>Confirm</button> : null}
              </div>
            </div>
            <div className="level-right">
              <button className="button is-light" onClick={props.handleModalClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingModal;
