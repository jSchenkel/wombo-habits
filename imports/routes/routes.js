import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// route components
// Public routes
import LandingPage from '../ui/LandingPage.js';
import Login from '../ui/Login.js';
import RequestInvite from '../ui/RequestInvite.js';
import Signup from '../ui/Signup.js';
import ForgotPassword from './../ui/ForgotPassword.js';
import ResetPassword from './../ui/ResetPassword.js';
// Private routes
import Home from '../ui/Home.js';
import AccountContainer from '../ui/Account/AccountContainer.js';
import ProductsContainer from '../ui/Products/ProductsContainer.js';
import PrivateQuestionContainer from '../ui/PrivateQuestionContainer.js';
// Open routes
import PublicProfile from '../ui/Profile/PublicProfile.js';
import RoomContainer from '../ui/Room/RoomContainer.js';
import Feedback from '../ui/Feedback.js';
import PublicQuestionContainer from '../ui/PublicQuestionContainer.js';
// Legal
import Terms from '../ui/legal/Terms.js';
import Privacy from '../ui/legal/Privacy.js';

// Helpers
import { isAuthenticated } from './../helpers/auth.js';

const unauthenticatedPages = ['/', '/accounts/login', '/accounts/signup', '/accounts/forgot-password', '/accounts/reset-password', '/accounts/request-invite'];
const authenticatedPages = ['/accounts/home', '/accounts/edit'];

export const onAuthChange = (isAuthenticated) => {
  // const location = useLocation();
  // const pathname = location.pathname;
  // console.log('pathname: ', pathname)
  const pathname = '/';
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isUnauthenticatedPage && isAuthenticated) {
    return <Redirect to='/accounts/home' />
    // console.log('logged in => home');
  } else if (isAuthenticatedPage && !isAuthenticated) {
    return <Redirect to='/' />
    // console.log('not logged in => landing page');
  }
};

export const routes = (
  <BrowserRouter>
    <Switch>
      {/* Public Routes */}
      <PubliceRoute exact path="/">
        <LandingPage />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/request-invite">
        <RequestInvite />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/login">
        <Login />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/signup">
        <Signup />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/forgot-password">
        <ForgotPassword />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/reset-password/:token" component={ResetPassword} />
      {/* Private Routes */}
      {/* TODO: PrivateQuestionContainer isn't safe guarded right now. Need to wrap in PrivateRoute container, but dont have a way to pass props to children (cant access url param) */}
      <PrivateRoute exact path="/pq/:questionId" component={PrivateQuestionContainer} />
      <PrivateRoute exact path="/accounts/home">
        <Home />
      </PrivateRoute>
      <PrivateRoute exact path="/accounts/edit">
        <AccountContainer />
      </PrivateRoute>
      {/* Open Routes */}
      <Route exact path="/:username" component={PublicProfile} />
      <Route exact path="/q/:questionId" component={PublicQuestionContainer} />
      <Route exact path="/s/:id" component={RoomContainer} />
      <Route exact path="/contact/feedback" component={Feedback} />
      <Route exact path="/legal/terms" component={Terms} />
      <Route exact path="/legal/privacy" component={Privacy} />
      {/* catch all (404) */}
      <PubliceRoute>
        <LandingPage />
      </PubliceRoute>
      {/* <Route component={LandingPage} /> */}
    </Switch>
  </BrowserRouter>
);

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated() ? (
          children
        ) : (
          <Redirect to='/accounts/login' />
        )
      }
    />
  );
};

// A wrapper for <Route> that redirects to the home
// screen if you're authenticated.
function PubliceRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() =>
        !isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to='/accounts/home'
          />
        )
      }
    />
  );
};
