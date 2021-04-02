import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';
import momentTimezone from 'moment-timezone';

import LoggedInNavbar from '../Navbar/LoggedInNavbar.js';
import ProductsCurrent from './ProductsCurrent.js';
import LoadingIcon from '../LoadingIcon.js';
import Footer from '../Footer.js';

import { convertLocalHourMinuteStringToTimezoneUtcDateString, convertUtcDateStringToLocalHourMinuteString } from './../../helpers/date.js';

const INITIAL_PRODUCT_STATE = {
  isProductActive: false,
  isProductLoading: false,
  currentProductId: '',
  title: '',
  description: '',
  duration: 15,
  rate: '',
  numberOfParticipants: '',
  sundayStart: '',
  sundayEnd: '',
  mondayStart: '',
  mondayEnd: '',
  tuesdayStart: '',
  tuesdayEnd: '',
  wednesdayStart: '',
  wednesdayEnd: '',
  thursdayStart: '',
  thursdayEnd: '',
  fridayStart: '',
  fridayEnd: '',
  saturdayStart: '',
  saturdayEnd: '',
  error: '',
};

export default class ProductsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      // current product
      ...INITIAL_PRODUCT_STATE,
      // products
      products: [],
      isProductsLoading: true,
      productsError: '',
      // modal
      modalIsOpen: false,
      activeModal: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleProductSave = this.handleProductSave.bind(this);
    this.addNewProduct = this.addNewProduct.bind(this);
    this.reset = this.reset.bind(this);
    this.productSelected = this.productSelected.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
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

    // get user products
    this.fetchProducts();
  }

  fetchProducts() {
    Meteor.call('productsGetProducts', (err, res) => {
      if (err) {
        // console.log('productsGetProducts err: ', err);
        this.setState({
          isProductsLoading: false,
          productsError: err.reason,
        });
      } else {
        // console.log('productsGetProducts res: ', res);
        this.setState({
          products: res,
          isProductsLoading: false,
          productsError: '',
          // reset product editor ui
          ...INITIAL_PRODUCT_STATE
        });
      }
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      error: ''
    });
  }

  handleProductSave(event) {
    event.preventDefault();
    // current user
    const currentUser = this.state.currentUser;
    const timezone = currentUser.timezone;

    const currentProductId = this.state.currentProductId
    const title = this.state.title.trim();
    const description = this.state.description.trim();
    const duration = this.state.duration ? parseInt(this.state.duration) : 0;
    const rate = this.state.rate ? parseInt(this.state.rate) : 0;
    const sundayStart = this.state.sundayStart;
    const sundayEnd = this.state.sundayEnd;
    const mondayStart = this.state.mondayStart;
    const mondayEnd = this.state.mondayEnd;
    const tuesdayStart = this.state.tuesdayStart;
    const tuesdayEnd = this.state.tuesdayEnd;
    const wednesdayStart = this.state.wednesdayStart;
    const wednesdayEnd = this.state.wednesdayEnd;
    const thursdayStart = this.state.thursdayStart;
    const thursdayEnd = this.state.thursdayEnd;
    const fridayStart = this.state.fridayStart;
    const fridayEnd = this.state.fridayEnd;
    const saturdayStart = this.state.saturdayStart;
    const saturdayEnd = this.state.saturdayEnd;
    // number of Participants is hardcoded to 1 right now
    const numberOfParticipants = 1;

    if (title.length === 0) {
      return this.setState({error: 'A title is required.'});
    }
    if (title.length > 30) {
      return this.setState({error: 'Your title is too long. 30 characters max.'});
    }
    if (description.length === 0) {
      return this.setState({error: 'A description is required.'});
    }
    if (duration < 1) {
      return this.setState({error: 'A duration is required.'});
    }
    if (rate < 1) {
      return this.setState({error: 'A rate is required.'});
    }
    if (rate < 20) {
      return this.setState({error: 'The rate must be $20 or greater.'});
    }
    if (numberOfParticipants < 1) {
      return this.setState({error: 'A number of participants is required.'});
    }
    if (!(sundayStart && sundayEnd) &&
      !(mondayStart && mondayEnd) &&
      !(tuesdayStart && tuesdayEnd) &&
      !(wednesdayStart && wednesdayEnd) &&
      !(thursdayStart && thursdayEnd) &&
      !(fridayStart && fridayEnd) &&
      !(saturdayStart && saturdayEnd)
    ) {
      return this.setState({error: 'You must set availability for at least one day of the week.'});
    }
    if ((sundayStart && !['00', '30'].includes(sundayStart.split(':')[1])) ||
      (sundayEnd && !['00', '30'].includes(sundayEnd.split(':')[1])) ||
      (mondayStart && !['00', '30'].includes(mondayStart.split(':')[1])) ||
      (mondayEnd && !['00', '30'].includes(mondayEnd.split(':')[1])) ||
      (tuesdayStart && !['00', '30'].includes(tuesdayStart.split(':')[1])) ||
      (tuesdayEnd && !['00', '30'].includes(tuesdayEnd.split(':')[1])) ||
      (wednesdayStart && !['00', '30'].includes(wednesdayStart.split(':')[1])) ||
      (wednesdayEnd && !['00', '30'].includes(wednesdayEnd.split(':')[1])) ||
      (thursdayStart && !['00', '30'].includes(thursdayStart.split(':')[1])) ||
      (thursdayEnd && !['00', '30'].includes(thursdayEnd.split(':')[1])) ||
      (fridayStart && !['00', '30'].includes(fridayStart.split(':')[1])) ||
      (fridayEnd && !['00', '30'].includes(fridayEnd.split(':')[1])) ||
      (saturdayStart && !['00', '30'].includes(saturdayStart.split(':')[1])) ||
      (saturdayEnd && !['00', '30'].includes(saturdayEnd.split(':')[1]))
    ) {
      return this.setState({error: 'All times must start and end on the hour or half hour (ex. 6:00pm or 6:30pm).'});
    }
    if ((sundayStart && sundayEnd && sundayStart > sundayEnd) ||
      (mondayStart && mondayEnd && mondayStart > mondayEnd) ||
      (tuesdayStart && tuesdayEnd && tuesdayStart > tuesdayEnd) ||
      (wednesdayStart && wednesdayEnd && wednesdayStart > wednesdayEnd) ||
      (thursdayStart && thursdayEnd && thursdayStart > thursdayEnd) ||
      (fridayStart && fridayEnd && fridayStart > fridayEnd) ||
      (saturdayStart && saturdayEnd && saturdayStart > saturdayEnd)
    ) {
      return this.setState({error: 'Start times must come before end times.'});
    }
    if ((sundayStart && sundayEnd && sundayStart === sundayEnd) ||
      (mondayStart && mondayEnd && mondayStart === mondayEnd) ||
      (tuesdayStart && tuesdayEnd && tuesdayStart === tuesdayEnd) ||
      (wednesdayStart && wednesdayEnd && wednesdayStart === wednesdayEnd) ||
      (thursdayStart && thursdayEnd && thursdayStart === thursdayEnd) ||
      (fridayStart && fridayEnd && fridayStart === fridayEnd) ||
      (saturdayStart && saturdayEnd && saturdayStart === saturdayEnd)
    ) {
      return this.setState({error: 'Cannot start and end at the same time.'});
    }
    // NOTE: Prevent sessions from being scheduled Sunday 1am-11am
    // Reserve some time for scheduled releases that wont hurt user experience (interupt sessions).
    if (sundayEnd && sundayEnd.split(':')[0] > '17') {
      return this.setState({error: 'We perform scheduled maintenance on Sundays from 6pm-11pm. Please make sure your Sunday availability ends at 5pm.'});
    }

    // Build the availability object
    // Sunday as 0 and Saturday as 6
    // we now have hour:minute strings in local time.
    // we need to create a local date object from hour:minute and then convert to utc date string for saving in db

    const availability = {
      'sunday': {
        'start': sundayStart ? convertLocalHourMinuteStringToTimezoneUtcDateString(sundayStart, timezone) : '',
        'end': sundayEnd ? convertLocalHourMinuteStringToTimezoneUtcDateString(sundayEnd, timezone) : ''
      },
      'monday': {
        'start': mondayStart ? convertLocalHourMinuteStringToTimezoneUtcDateString(mondayStart, timezone) : '',
        'end': mondayEnd ? convertLocalHourMinuteStringToTimezoneUtcDateString(mondayEnd, timezone) : ''
      },
      'tuesday': {
        'start': tuesdayStart ? convertLocalHourMinuteStringToTimezoneUtcDateString(tuesdayStart, timezone) : '',
        'end': tuesdayEnd ? convertLocalHourMinuteStringToTimezoneUtcDateString(tuesdayEnd, timezone) : ''
      },
      'wednesday': {
        'start': wednesdayStart ? convertLocalHourMinuteStringToTimezoneUtcDateString(wednesdayStart, timezone) : '',
        'end': wednesdayEnd ? convertLocalHourMinuteStringToTimezoneUtcDateString(wednesdayEnd, timezone) : ''
      },
      'thursday': {
        'start': thursdayStart ? convertLocalHourMinuteStringToTimezoneUtcDateString(thursdayStart, timezone) : '',
        'end': thursdayEnd ? convertLocalHourMinuteStringToTimezoneUtcDateString(thursdayEnd, timezone) : ''
      },
      'friday': {
        'start': fridayStart ? convertLocalHourMinuteStringToTimezoneUtcDateString(fridayStart, timezone) : '',
        'end': fridayEnd ? convertLocalHourMinuteStringToTimezoneUtcDateString(fridayEnd, timezone) : ''
      },
      'saturday': {
        'start': saturdayStart ? convertLocalHourMinuteStringToTimezoneUtcDateString(saturdayStart, timezone) : '',
        'end': saturdayEnd ? convertLocalHourMinuteStringToTimezoneUtcDateString(saturdayEnd, timezone) : ''
      }
    };

    this.setState({
      isProductsLoading: true,
      isProductLoading: true
    });
    if (currentProductId) {
      // we have a product id so update the existing product
      Meteor.call('productsUpdateProduct', currentProductId, title, description, duration, rate, numberOfParticipants, availability, (err, res) => {
        if (err) {
          // console.log('productsUpdateProduct err: ', err);
          this.setState({
            isProductsLoading: false,
            isProductLoading: false,
            productsError: err.reason,
            error: ''
          });
        } else {
          this.fetchProducts();
        }
      });
    } else {
      // we dont have a product id so create a new one
      Meteor.call('productsInsertProduct', title, description, duration, rate, numberOfParticipants, availability, (err, res) => {
        if (err) {
          // console.log('productsInsertProduct err: ', err);
          this.setState({
            isProductsLoading: false,
            isProductLoading: false,
            productsError: err.reason,
            error: ''
          });
        } else {
          this.fetchProducts();
        }
      });
    }
  }

  addNewProduct() {
    this.setState({
      ...INITIAL_PRODUCT_STATE,
      isProductActive: true,
    });
  }

  reset() {
    this.setState(INITIAL_PRODUCT_STATE);
  }

  productSelected(product) {
    const currentUser = this.state.currentUser;
    const timezone = currentUser.timezone;

    this.setState({
      isProductActive: true,
      isProductLoading: false,
      productsError: '',
      currentProductId: product._id,
      title: product.title,
      description: product.description,
      duration: product.duration,
      rate: product.rate,
      numberOfParticipants: product.numberOfParticipants,
      // start and end times are saved as utc date string
      // convert to local time and parse out hour and minute to display on client
      sundayStart: product.availability.sunday.start ? convertUtcDateStringToLocalHourMinuteString(product.availability.sunday.start, timezone) : '',
      sundayEnd: product.availability.sunday.end ? convertUtcDateStringToLocalHourMinuteString(product.availability.sunday.end, timezone) : '',
      mondayStart: product.availability.monday.start ? convertUtcDateStringToLocalHourMinuteString(product.availability.monday.start, timezone) : '',
      mondayEnd: product.availability.monday.end ? convertUtcDateStringToLocalHourMinuteString(product.availability.monday.end, timezone) : '',
      tuesdayStart: product.availability.tuesday.start ? convertUtcDateStringToLocalHourMinuteString(product.availability.tuesday.start, timezone) : '',
      tuesdayEnd: product.availability.tuesday.end ? convertUtcDateStringToLocalHourMinuteString(product.availability.tuesday.end, timezone) : '',
      wednesdayStart: product.availability.wednesday.start ? convertUtcDateStringToLocalHourMinuteString(product.availability.wednesday.start, timezone) : '',
      wednesdayEnd: product.availability.wednesday.end ? convertUtcDateStringToLocalHourMinuteString(product.availability.wednesday.end, timezone) : '',
      thursdayStart: product.availability.thursday.start ? convertUtcDateStringToLocalHourMinuteString(product.availability.thursday.start, timezone) : '',
      thursdayEnd: product.availability.thursday.end ? convertUtcDateStringToLocalHourMinuteString(product.availability.thursday.end, timezone) : '',
      fridayStart: product.availability.friday.start ? convertUtcDateStringToLocalHourMinuteString(product.availability.friday.start, timezone) : '',
      fridayEnd: product.availability.friday.end ? convertUtcDateStringToLocalHourMinuteString(product.availability.friday.end, timezone) : '',
      saturdayStart: product.availability.saturday.start ? convertUtcDateStringToLocalHourMinuteString(product.availability.saturday.start, timezone) : '',
      saturdayEnd: product.availability.saturday.end ? convertUtcDateStringToLocalHourMinuteString(product.availability.saturday.end, timezone) : '',
      error: ''
    });
  }

  deleteProduct() {
    Meteor.call('productsDeleteProduct', this.state.currentProductId, (err, res) => {
      if (err) {
        // console.log('productsDeleteProduct err: ', err);
        this.setState({
          isProductsLoading: false,
          isProductLoading: false,
          productsError: err.reason,
          error: ''
        });
        this.handleModalClose();
      } else {
        this.fetchProducts();
        this.handleModalClose();
      }
    });
  }

  handleModalClose() {
    this.setState({ modalIsOpen: false, activeModal: '' });
  }

  handleModalOpen(activeModal) {
    this.setState({ modalIsOpen: true, activeModal });
  }

  renderModal() {
    if (this.state.modalIsOpen && this.state.activeModal === 'confirm-delete-product') {
      return (
        <div className="box">
          <p className="title is-size-5 has-text-weight-semibold">Delete</p>
          <p className="subtitle is-size-6 has-text-grey">Your session will be permanently deleted. Are you sure? Scheduled bookings made from this session will not be deleted.</p>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-link" onClick={this.handleModalClose}>No, take me back</button>
            </div>
            <div className="control">
              <button className="button" onClick={this.deleteProduct}>Yes, delete</button>
            </div>
          </div>
        </div>
      );
    }
  }

  renderBody() {
    if (this.state.isProductsLoading) {
      return <LoadingIcon />;
    }

    if (!this.state.currentUser) {
      return <LoadingIcon />;
    }

    if (this.state.currentUser && !this.state.currentUser.stripeAccountId) {
      return (
        <div className="columns is-centered">
          <div className="column">
            <p className="has-text-centered">
              You need to set up payouts before you can create sessions. Click <Link to="/accounts/edit">here</Link> then click "Payouts".
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="columns">
        <div className="column is-one-third">
          {/* <button className="button">Add New Product</button> */}
          <div className="notification is-link has-pointer" onClick={this.addNewProduct}>
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add New Session</span>
          </div>
          {this.state.products ? this.state.products.map((product) => {
            return (
              <div key={product._id} className={this.state.currentProductId === product._id ? 'notification has-pointer is-info': 'notification has-pointer'} onClick={() => this.productSelected(product)}>
                {product.title}
              </div>
            );
          }) : null}
        </div>
        <div className="column is-two-thirds">
          {this.state.isProductActive ? (
            <ProductsCurrent
              handleProductSave={this.handleProductSave}
              handleInputChange={this.handleInputChange}
              reset={this.reset}
              deleteProduct={this.deleteProduct}
              handleModalOpen={this.handleModalOpen}
              {...this.state}
            />
          ) : <p className="has-text-centered">No session selected.</p>}
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
              {this.state.productsError ? <p className="help is-danger has-text-centered">{this.state.productsError}</p> : null}
              {this.renderBody()}
            </div>
            <div className={this.state.modalIsOpen ? 'modal is-active' : 'modal'}>
              <div className="modal-background" onClick={this.handleModalClose}></div>
              <div className="modal-content">
                {this.renderModal()}
              </div>
              <button className="modal-close is-large" aria-label="close" onClick={this.handleModalClose}></button>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}
