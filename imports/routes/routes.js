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
// ...
// Open routes
import Feedback from '../ui/Feedback.js';
// Legal
import Terms from '../ui/legal/Terms.js';
import Privacy from '../ui/legal/Privacy.js';

// Helpers
import { isAuthenticated } from './../helpers/auth.js';

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
      {/* <PubliceRoute exact path="/accounts/login">
        <Login />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/signup">
        <Signup />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/forgot-password">
        <ForgotPassword />
      </PubliceRoute>
      <PubliceRoute exact path="/accounts/reset-password/:token" component={ResetPassword} /> */}
      {/* Private Routes */}
      {/* Open Routes */}
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
