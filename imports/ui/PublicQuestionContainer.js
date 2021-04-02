import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Link } from 'react-router-dom';
import moment from 'moment';

import SimpleNavbar from './Navbar/SimpleNavbar.js';
import LoggedInNavbar from './Navbar/LoggedInNavbar.js';
import QuestionAnswer from './QuestionAnswers/QuestionAnswer.js';
import LoadingIcon from './LoadingIcon.js';
import Footer from './Footer.js';

export default class PublicQuestionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      question: null,
      isQuestionLoading: true,
      questionError: '',
    };
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
    Meteor.call('questionsGetPublicQuestion', questionId, (err, res) => {
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

  renderBody() {
    const questionId = this.props.match.params.questionId;
    if (this.state.isQuestionLoading) {
      return <LoadingIcon />;
    } else if (!this.state.isQuestionLoading && this.state.question) {
      const question = this.state.question;
      return (
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <QuestionAnswer question={question} />
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
          {this.state.currentUser ? <LoggedInNavbar currentUser={this.state.currentUser} /> : <SimpleNavbar />}
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
