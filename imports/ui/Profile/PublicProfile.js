import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { ElementsConsumer } from '@stripe/react-stripe-js';

import { isAuthenticated } from '../../helpers/auth.js';
import { DAY_OF_WEEK_CODE_INT_TO_DAY_STRING } from '../../constants/products.js';

import LoggedInNavbar from '../Navbar/LoggedInNavbar.js';
import SimpleNavbar from '../Navbar/SimpleNavbar.js';
import BookingModal from './BookingModal.js';
import BookingDetailsModal from './BookingDetailsModal.js';
import QuestionModal from './QuestionModal.js';
import QuestionAnswer from '../QuestionAnswers/QuestionAnswer.js';
import LoadingIcon from '../LoadingIcon.js';
import Footer from '../Footer.js';

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      // profile
      profile: null,
      isProfileLoading: true,
      isProfileError: false,
      profileError: '',
      // products
      products: [],
      isProductsLoading: true,
      isProductsError: false,
      productsError: '',
      // questions
      questions: [],
      isQuestionsLoading: true,
      isQuestionsError: false,
      questionsError: '',
      // selected product - availability
      selectedProduct: null,
      selectedProductAvailability: {},
      isSelectedProductAvailabilityLoading: true,
      isSelectedProductAvailabilityError: false,
      selectedProductAvailabilityError: '',
      // modal
      modalIsOpen: false,
      activeModal: '',
      // booking
      selectedTime: moment().hour(0).minute(0).toDate(),
      selectedTimeDay: moment().day(),
      customerTimezone: ''
    };

    this.fetchProfile = this.fetchProfile.bind(this);
    this.handleProductSelected = this.handleProductSelected.bind(this);
    this.handleAskQuestionSelected = this.handleAskQuestionSelected.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSelectedTimeChanged = this.handleSelectedTimeChanged.bind(this);
    this.handleTimeSelected = this.handleTimeSelected.bind(this);
  }

  componentDidMount() {
    const currentUserId = Meteor.userId();
    const username = this.props.match.params.username;

    this.fetchProfile(username);

    // get current user if logged in
    if (currentUserId) {
      Meteor.call('getCurrentUserAccount', (err, res) => {
        if (err) {
          // console.log('getCurrentUserAccount err: ', err);
        } else {
          this.setState({
            currentUser: res
          });
        }
      });
    }

    this.setState({
      customerTimezone: momentTimezone.tz.guess()
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if the username changes then pull the new profile data
    if (nextProps.match.params.username !== this.props.match.params.username) {
      this.fetchProfile(nextProps.match.params.username);
    }
    return true;
  }

  fetchProfile(username) {
    this.setState({
      isProfileLoading: true,
      isProfileError: false,
      profileError: ''
    });

    // get profile
    Meteor.call('getUserPublicProfile', username, (err, res) => {
      if (err) {
        // console.log('getUserPublicProfile err: ', err);
        this.setState({
          isProfileLoading: false,
          isProfileError: true,
          profileError: err.reason,
        });
      } else {
        if (res) {
          // console.log('getUserPublicProfile res: ', res)
          // user found
          this.setState({
            profile: res,
            isProfileLoading: false,
            isProfileError: false,
            profileError: ''
          });

          analytics.track('Profile Loaded', {
            username
          });
        } else {
          // no user found
          this.setState({
            isProfileLoading: false,
            isProfileError: true,
            profileError: 'user-unavailable',
          });
        }
      }
    });

    // get question answers
    Meteor.call('questionsGetPublicQuestions', username, (err, res) => {
      if (err) {
        // console.log('questionsGetPublicQuestions err: ', err);
        this.setState({
          isQuestionsLoading: false,
          isQuestionsError: true,
          questionsError: err.reason
        });
      } else {
        if (res) {
          // console.log('questionsGetPublicQuestions res: ', res);
          // questions found
          this.setState({
            questions: res,
            isQuestionsLoading: false,
            isQuestionsError: false,
            questionsError: ''
          });
        } else {
          // no questions found
          this.setState({
            isQuestionsLoading: false,
            isQuestionsError: false,
            questionsError: ''
          });
        }
      }
    });

    // get products
    Meteor.call('productsGetPublicProducts', username, (err, res) => {
      if (err) {
        // console.log('getUserPublicProfile err: ', err);
        this.setState({
          isProductsLoading: false,
          isProductsError: true,
          productsError: err.reason
        });
      } else {
        if (res) {
          // console.log('productsGetPublicProducts res: ', res);
          // products found
          this.setState({
            products: res,
            isProductsLoading: false,
            isProductsError: false,
            productsError: ''
          });
        } else {
          // no products found
          this.setState({
            isProductsLoading: false,
            isProductsError: true,
            productsError: 'user-unavailable'
          });
        }
      }
    });
  }

  handleAskQuestionSelected() {
    this.setState({
      modalIsOpen: true,
      activeModal: 'ask-a-question',
    });

    analytics.track('Ask Question Selected', {
      username: this.props.match.params.username
    });
  }

  handleProductSelected(product) {
    this.setState({
      selectedProduct: product,
      modalIsOpen: true,
      activeModal: 'booking',
      isSelectedProductAvailabilityLoading: true,
    });

    // need to make request to method to get the availability for this product
    // set state that is loading
    // show loader
    Meteor.call('productsGetProductAvailability', product._id, (err, res) => {
      if (err) {
        // console.log('productsGetProductAvailability err: ', err);
        this.setState({
          selectedProductAvailability: {},
          isSelectedProductAvailabilityLoading: false,
          isSelectedProductAvailabilityError: true,
          selectedProductAvailabilityError: err.reason
        });
      } else {
        // console.log('productsGetProductAvailability res: ', res);
        // loop through the availability object and find a day where there is availability. then set the selected time to that day next week
        // Note: there should always be availability because we enforce that when creating products and when fetching
        let newSelectedTime = moment();
        const availability = res.availability;
        for (let i = 0; i < 7; i++) {
          const dayString = DAY_OF_WEEK_CODE_INT_TO_DAY_STRING[i];
          if (dayString in availability && availability[dayString] && availability[dayString].start && availability[dayString].end) {
            newSelectedTime = newSelectedTime.day(i).add(1, 'w').hour(0).minute(0).toDate();
            break;
          }
        }

        this.setState({
          selectedProductAvailability: res,
          isSelectedProductAvailabilityLoading: false,
          isSelectedProductAvailabilityError: false,
          selectedProductAvailabilityError: '',
          // modal ui
          selectedTime: newSelectedTime,
          selectedTimeDay: moment(newSelectedTime).day()
        });

        analytics.track('Profile Session Selected', {
          username: this.props.match.params.username,
          productId: product._id,
          productTitle: product.title
        });
      }
    });
  }

  handleTimeSelected() {
    /*
      Need to:
      1. open the new modal. and show loader. (update state)
      2. call method to create the payment intent secret for stripe payment (can also check for availability again here and show error if taken)
      3. show form (Provide booking details)
      4. Finish and pay button (check availability, handle payment,
        save document in database, send email to customer with cal event, send email to creator with cal event, on success redirect user to success page w/ booking number (document id))
    */
    this.setState({
      modalIsOpen: true,
      activeModal: 'finish-pay',
      isSelectedProductAvailabilityLoading: true,
    });

    // need to make request to method to get the availability for this product
    // set state that is loading
    // show loader
    const product = this.state.selectedProduct;
    Meteor.call('productsGetProductAvailability', product._id, (err, res) => {
      if (err) {
        // console.log('productsGetProductAvailability err: ', err);
        this.setState({
          selectedProductAvailability: {},
          isSelectedProductAvailabilityLoading: false,
          isSelectedProductAvailabilityError: true,
          selectedProductAvailabilityError: err.reason
        });
      } else {
        // TODO: Right now we dont do anything with the response. we should check if the selectedTime is no longer available when selected.
        // process the response and check if this.state.selectedTime is no longer available
        // check availability object
        // check excludeTimes list of dates (use moment isSame method)
        this.setState({
          selectedProductAvailability: res,
          isSelectedProductAvailabilityLoading: false,
          isSelectedProductAvailabilityError: false,
          selectedProductAvailabilityError: ''
        });
      }
    });

    analytics.track('Profile Session Time Selected', {
      username: this.props.match.params.username,
      productId: product._id,
      productTitle: product.title
    });
  }

  handleModalClose() {
    this.setState({
      modalIsOpen: false,
      activeModal: '',
      // reset selected product and availability
      selectedProduct: null,
      selectedProductAvailability: {},
      isSelectedProductAvailabilityLoading: true,
      isSelectedProductAvailabilityError: false,
      selectedProductAvailabilityError: '',
      // reset modal UI
      selectedTime: moment().hour(0).minute(0).toDate(),
      selectedTimeDay: moment().day()
    });
  }

  handleSelectedTimeChanged(date) {
    const selectedTimeDay = this.state.selectedTimeDay;
    const newSelectedTimeDay = date.getDay();
    // if the day changed then unset the time (hour, minutes) (idk why this isnt default behavior)
    if (selectedTimeDay !== newSelectedTimeDay) {
      date.setMinutes(0);
      date.setHours(0);
    }
    // console.log('date: ', date);
    this.setState({
      selectedTime: date,
      selectedTimeDay: moment(date).day()
    });
  }

  renderModal() {
    if (this.state.modalIsOpen && this.state.activeModal === 'booking') {
      return (
        <BookingModal
          selectedProduct={this.state.selectedProduct}
          isSelectedProductAvailabilityLoading={this.state.isSelectedProductAvailabilityLoading}
          isSelectedProductAvailabilityError={this.state.isSelectedProductAvailabilityError}
          selectedProductAvailabilityError={this.state.selectedProductAvailabilityError}
          selectedProductAvailability={this.state.selectedProductAvailability}
          selectedTime={this.state.selectedTime}
          profile={this.state.profile}
          customerTimezone={this.state.customerTimezone}
          // methods
          handleSelectedTimeChanged={this.handleSelectedTimeChanged}
          handleModalClose={this.handleModalClose}
          handleTimeSelected={this.handleTimeSelected}
        />
      );
    } else if (this.state.modalIsOpen && this.state.activeModal === 'finish-pay') {
      // need to wrap the class component BookingDetailsModal in ElementsConsumer and pass the elements and stripe props
      return (
        <ElementsConsumer>
          {({elements, stripe}) => (
            <BookingDetailsModal
              selectedProduct={this.state.selectedProduct}
              isSelectedProductAvailabilityLoading={this.state.isSelectedProductAvailabilityLoading}
              isSelectedProductAvailabilityError={this.state.isSelectedProductAvailabilityError}
              selectedProductAvailabilityError={this.state.selectedProductAvailabilityError}
              selectedTime={this.state.selectedTime}
              profile={this.state.profile}
              customerTimezone={this.state.customerTimezone}
              username={this.props.match.params.username}
              // methods
              handleModalClose={this.handleModalClose}
              // stripe stuff
              elements={elements}
              stripe={stripe}
            />
          )}
        </ElementsConsumer>
      );
    } else if (this.state.modalIsOpen && this.state.activeModal === 'ask-a-question') {
      // need to wrap the class component BookingDetailsModal in ElementsConsumer and pass the elements and stripe props
      return (
        <ElementsConsumer>
          {({elements, stripe}) => (
            <QuestionModal
              profile={this.state.profile}
              username={this.props.match.params.username}
              // methods
              handleModalClose={this.handleModalClose}
              // stripe stuff
              elements={elements}
              stripe={stripe}
            />
          )}
        </ElementsConsumer>
      );
    }
  }

  renderProducts() {
    const {
      products,
      isProductsLoading,
      isProductsError,
      productsError
    } = this.state;

    if (isProductsLoading) {
      return <LoadingIcon />;
    } else if (isProductsError) {
      if (productsError === 'user-unavailable') {
        return <p className="has-text-weight-semibold has-text-danger">Sorry, this page isn't available.</p>;
      } else {
        return <p className="has-text-weight-semibold has-text-danger">Something went wrong: {productsError}</p>;
      }
    }
    const productsJSX = products && products.length > 0 ? products.map((product) => {
      return (
        <button key={product._id} className="button is-link" onClick={() => this.handleProductSelected(product)}>{product.title}</button>
      );
    }) : (
      <p className="has-text-grey is-italic">No times to book</p>
    );

    return (
      <div className="buttons">
        {productsJSX}
      </div>
    );
  }

  renderQuestions() {
    const {
      questions,
      isQuestionsLoading,
      isQuestionsError,
      questionsError
    } = this.state;

    if (isQuestionsLoading) {
      return null;
      // return <LoadingIcon />;
    } else if (isQuestionsError) {
      return <p className="is-size-7 has-text-centered has-text-danger">Something went wrong.</p>;
    } else if (questions && questions.length > 0) {
      const questionsJSX = questions.map((question) => {
        return <QuestionAnswer question={question} />;
      });
      return (
        <div className="columns is-centered is-multiline">
          {questionsJSX}
        </div>
      );
    }

    return null;
  }

  renderProfile() {
    const {
      currentUser,
      isProfileLoading,
      isProfileError,
      profileError,
      profile
    } = this.state;

    if (isProfileLoading) {
      return <LoadingIcon />;
    } else if (isProfileError) {
      if (profileError === 'user-unavailable') {
        return (
          <div className="columns is-centered">
            <div className="column is-half">
              <p className="title is-4">Sorry, this page isn't available.</p>
              <p className="subtitle is-6">The link you followed may be broken, or the page may have been removed. {!!currentUser ? <Link to="/accounts/home">Go back to Wombo</Link> : <Link to="/">Go back to Wombo</Link>}</p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="columns is-centered">
            <div className="column is-half">
              <p className="title is-4">Something went wrong</p>
              <p className="subtitle is-6">{profileError} {!!currentUser ? <Link to="/accounts/home">Go back to Wombo</Link> : <Link to="/">Go back to Wombo</Link>}</p>
            </div>
          </div>
        );
      }
    }

    // logan paul image src: https://scontent-bos3-1.cdninstagram.com/v/t51.2885-19/s320x320/97868812_1200785930252701_1064265223474511872_n.jpg?_nc_ht=scontent-bos3-1.cdninstagram.com&_nc_ohc=3DxATVjoJvMAX_OwekP&oh=b4ca56913ccf1c3e1706ec9712ee4c3a&oe=5FAEF461
    const editProfileButton = this.state.currentUser && this.state.currentUser.username === this.props.match.params.username ? (
      <div className="level-item ml-3">
        <Link to='/accounts/edit' className="button is-small has-text-weight-semibold">Edit Profile</Link>
      </div>
    ) : null;

    // grab the social links from profile and display them.
    // can build array of jsx
    const linksJSX = [];
    for (const link of ['youtube', 'instagram', 'tiktok', 'twitter', 'personal', 'shopping']) {
      if (link in profile && profile[link]) {
        const linkToIconMap = {
          'youtube': 'fab fa-youtube',
          'instagram': 'fab fa-instagram',
          'tiktok': 'fab fa-tiktok',
          'twitter': 'fab fa-twitter',
          'personal': 'fas fa-link',
          'shopping': 'fas fa-shopping-bag'
        };
        linksJSX.push((
          <a key={link} href={profile[link]} target="_blank">
            <span className="icon has-text-dark">
              <i className={linkToIconMap[link]}></i>
            </span>
          </a>
        ));
      }
    }
    return (
      <div className="columns is-centered">
        <div className="column is-two-fifths">
          <div style={{margin: '1rem auto'}}>
            <div className="image is-96x96">
              <img className="is-rounded image-not-draggable" style={{ border: '1px solid lightgray' }} src={profile.profilePictureImageUrl ? profile.profilePictureImageUrl : 'https://bulma.io/images/placeholders/128x128.png'} />
            </div>
          </div>
          <div className="box">
            <div className="level is-mobile mb-2">
              <div className="level-left">
                <div className="level-item">
                  <p className="subtitle is-4">
                    <span>{profile.username}</span>
                    {profile.verified ? (
                      <span className="icon ml-1">
                        <img className="image-not-draggable" style={{height: '16px', width: '16px'}} src="/images/verified.svg" title="Verified" />
                      </span>
                    ) : null}
                  </p>
                </div>
                {/* {editProfileButton} */}
              </div>
              <div className="level-right">
                <div className="level-item">
                  {linksJSX}
                </div>
              </div>
            </div>
            <p className="has-text-weight-semibold is-size-5">{profile.name}</p>
            <p className="is-size-6 overflow-y-scroll" style={{ maxHeight: '15rem'}}>{profile.bio}</p>
            <br />
            <button className="button is-link is-fullwidth" onClick={this.handleAskQuestionSelected}>Ask me a question</button>
            {/* {this.renderProducts()} */}
            {/* <button className="button is-link is-fullwidth">Ask me anything</button> */}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <section className="hero has-background-white is-fullheight">
          {this.state.currentUser ? <LoggedInNavbar currentUser={this.state.currentUser} /> : <SimpleNavbar />}
          <div className="hero-body">
            <div className="container">
              {this.renderProfile()}
              <div className="columns is-centered">
                <div className="column is-two-fifths">
                  {this.renderQuestions()}
                </div>
              </div>
            </div>
            <div className={this.state.modalIsOpen ? 'modal is-active' : 'modal'}>
              <div className="modal-background"></div>
              {/* <div className="modal-background" onClick={this.handleModalClose}></div> */}
              <div className="modal-content">
                {this.renderModal()}
              </div>
              {/* <button className="modal-close is-large" aria-label="close" onClick={this.handleModalClose}></button> */}
            </div>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}


export default PublicProfile;
