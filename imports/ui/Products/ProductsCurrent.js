import React from 'react';

import InfoTooltip from '../blocks/InfoTooltip.js';

import { calculatePlatformFee, convertDollarsToCents, convertCentsToDollars, makeDollarFeeDisplayable } from '../../helpers/payments.js';

const ProductsCurrent = (props) => {
  const saveButton = props.isProductLoading ? (
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

  const cancelButton = props.isProductLoading ? (
     <div className="field">
       <div className="control">
         <button className="button is-light" type="button" disabled>Cancel</button>
       </div>
     </div>
    ) : (
    <div className="field">
      <div className="control">
        <button className="button is-light" type="button" onClick={props.reset}>Cancel</button>
      </div>
    </div>
  );

  let totalRateHelpText = null;
  if (props.rate && props.rate > 0) {
    const feeInDollars = props.rate;
    const feeInCents = convertDollarsToCents(feeInDollars);
    const platformFee = calculatePlatformFee(feeInCents);
    const totalFee = feeInCents + platformFee;
    const totalFeeInDollars = convertCentsToDollars(totalFee);
    const finalFee = makeDollarFeeDisplayable(totalFeeInDollars);

    const tooltipText = (
      <span>
        Price Breakdown:<br />
        Rate (${feeInDollars})<br />
        Platform fee (${makeDollarFeeDisplayable(convertCentsToDollars(platformFee))})
      </span>
    );

    // NOTE: Right now the total price can have decimals in them, which isnt pretty. Better to have a whole number.
    // We can either dynamically calculate the platform fee so that the total is a whole number or
    // we let the creator determine the final price displayed to the customer (their rate)
    //  then we deduct the fees from that (can display that information in the product editor)

    totalRateHelpText = (
      <label className="help mb-1">The total amount charged to customers for this session: ${finalFee} <InfoTooltip text={tooltipText} iconSize="is-small" /></label>
    );
  }

  return (
    <div className="box">
      {/* <div className="tabs is-centered is-toggle is-small">
        <ul>
          <li className={props.selectedProductTab === 'profile' ? 'is-active' : ''}>
            <a onClick={() => this.setState({selectedTab: 'profile'})}>
              <span>Product Information</span>
            </a>
          </li>
          <li className={props.selectedProductTab === 'payment' ? 'is-active' : ''}>
            <a onClick={() => this.setState({selectedTab: 'payment'})}>
              <span>Availability</span>
            </a>
          </li>
          <li className={props.selectedProductTab === 'payment' ? 'is-active' : ''}>
            <a onClick={() => this.setState({selectedTab: 'payment'})}>
              <span>Discount Codes</span>
            </a>
          </li>
          <li className={props.selectedProductTab === 'payment' ? 'is-active' : ''}>
            <a onClick={() => this.setState({selectedTab: 'payment'})}>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div> */}
      <form onSubmit={props.handleProductSave}>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label">Title</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
          {/* add labels for every field to add details and examples. improve experience */}
          {/* <label className="help">Name that people see on your profile</label> */}
          <div className="control">
            <input className="input" type="text" name="title" value={props.title} required maxLength="30" placeholder="" onChange={props.handleInputChange} />
          </div>
        </div>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label">Description</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
          <div className="control">
            <textarea className="textarea" name="description" value={props.description} required placeholder="" onChange={props.handleInputChange}></textarea>
          </div>
        </div>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label">Duration</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
          <div className="control">
            <div className="select">
              <select name="duration" value={props.duration} required onChange={props.handleInputChange}>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>
        </div>
        <div className="level is-mobile mb-1">
          <div className="level-left">
            <div className="level-item">
              <label className="label">Rate</label>
            </div>
          </div>
          <div className="level-right">
          </div>
        </div>
        {totalRateHelpText}
        <div className="field has-addons">
          <div className="control">
            <div className="select">
              <select value="$" readOnly>
                <option value="$">$</option>
              </select>
            </div>
          </div>
          <div className="control">
            <input className="input" type="number" min="20" step="1" name="rate" value={props.rate} required placeholder="" onChange={props.handleInputChange} />
          </div>
        </div>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label">Number of Participants</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
          {/* <label className="help">The number of people who can .</label> */}
          <div className="control">
            <input className="input" type="number" disabled name="numberOfParticipants" value={1} required placeholder="" onChange={props.handleInputChange} />
          </div>
        </div>
        <div className="field">
          <div className="level is-mobile mb-1">
            <div className="level-left">
              <div className="level-item">
                <label className="label">Availability</label>
              </div>
            </div>
            <div className="level-right">
            </div>
          </div>
          <label className="help">Set what times during the week you are available for booking. All times must start and end on the hour or half hour (ex. 6:00pm or 6:30pm). Empty values will be ignored.</label>
          {navigator && navigator.userAgent && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Chromium') ? <label className="help is-danger">Safari requires the following format: (hour):(minute). Ex. 06:00 => 6am, 10:30 => 10:30am, 14:00 => 2pm</label> : null}
        </div>
        <div className="columns is-multiline">
          <div className="column is-one-quarter">
            <div className="field">
              <p className="is-size-7 has-text-weight-semibold">Sunday</p>
              <div className="control">
                <input className="input" type="time" step="1800" name="sundayStart" value={props.sundayStart} placeholder="" onChange={props.handleInputChange} />
              </div>
              <label className="help">to</label>
              <div className="control">
                <input className="input" type="time" step="1800" name="sundayEnd" value={props.sundayEnd} placeholder="" onChange={props.handleInputChange} />
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="field">
              <p className="is-size-7 has-text-weight-semibold">Monday</p>
              <div className="control">
                <input className="input" type="time" step="1800" name="mondayStart" value={props.mondayStart} placeholder="" onChange={props.handleInputChange} />
              </div>
              <label className="help">to</label>
              <div className="control">
                <input className="input" type="time" step="1800" name="mondayEnd" value={props.mondayEnd} placeholder="" onChange={props.handleInputChange} />
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="field">
              <p className="is-size-7 has-text-weight-semibold">Tuesday</p>
              <div className="control">
                <input className="input" type="time" step="1800" name="tuesdayStart" value={props.tuesdayStart} placeholder="" onChange={props.handleInputChange} />
              </div>
              <label className="help">to</label>
              <div className="control">
                <input className="input" type="time" step="1800" name="tuesdayEnd" value={props.tuesdayEnd} placeholder="" onChange={props.handleInputChange} />
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="field">
              <p className="is-size-7 has-text-weight-semibold">Wednesday</p>
              <div className="control">
                <input className="input" type="time" step="1800" name="wednesdayStart" value={props.wednesdayStart} placeholder="" onChange={props.handleInputChange} />
              </div>
              <label className="help">to</label>
              <div className="control">
                <input className="input" type="time" step="1800" name="wednesdayEnd" value={props.wednesdayEnd} placeholder="" onChange={props.handleInputChange} />
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="field">
              <p className="is-size-7 has-text-weight-semibold">Thursday</p>
              <div className="control">
                <input className="input" type="time" step="1800" name="thursdayStart" value={props.thursdayStart} placeholder="" onChange={props.handleInputChange} />
              </div>
              <label className="help">to</label>
              <div className="control">
                <input className="input" type="time" step="1800" name="thursdayEnd" value={props.thursdayEnd} placeholder="" onChange={props.handleInputChange} />
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="field">
              <p className="is-size-7 has-text-weight-semibold">Friday</p>
              <div className="control">
                <input className="input" type="time" step="1800" name="fridayStart" value={props.fridayStart} placeholder="" onChange={props.handleInputChange} />
              </div>
              <label className="help">to</label>
              <div className="control">
                <input className="input" type="time" step="1800" name="fridayEnd" value={props.fridayEnd} placeholder="" onChange={props.handleInputChange} />
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <div className="field">
              <p className="is-size-7 has-text-weight-semibold">Saturday</p>
              <div className="control">
                <input className="input" type="time" step="1800" name="saturdayStart" value={props.saturdayStart} placeholder="" onChange={props.handleInputChange} />
              </div>
              <label className="help">to</label>
              <div className="control">
                <input className="input" type="time" step="1800" name="saturdayEnd" value={props.saturdayEnd} placeholder="" onChange={props.handleInputChange} />
              </div>
            </div>
          </div>
        </div>
        {props.error ? <label className="help is-danger">{props.error}</label> : null}
        {saveButton}
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              {cancelButton}
            </div>
          </div>
          <div className="level-right">
            {props.currentProductId ? (
              <div className="field">
                <div className="control">
                  <button className="button is-danger" type="button" onClick={() => props.handleModalOpen('confirm-delete-product')}>Delete</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductsCurrent;
