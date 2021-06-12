import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// route components
// Public routes
import LandingPage from '../ui/LandingPage.js';
import StartContainer from '../ui/Start/StartContainer.js';
import PlansContainer from '../ui/Plans/PlansContainer.js';
import CheckoutContainer from '../ui/CheckoutContainer.js';
import Login from '../ui/Accounts/Login.js';
import Signup from '../ui/Accounts/Signup.js';
import ForgotPassword from './../ui/Accounts/ForgotPassword.js';
import ResetPassword from './../ui/Accounts/ResetPassword.js';
// Private routes
import HomeContainer from './../ui/Home/HomeContainer.js';
import SchedulesContainer from '../ui/Schedules/SchedulesContainer.js';
import AccountContainer from './../ui/Accounts/AccountContainer.js';
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
      <PubliceRoute exact path="/start">
        <StartContainer />
      </PubliceRoute>
      <PubliceRoute exact path="/plans">
        <PlansContainer />
      </PubliceRoute>
      <PubliceRoute exact path="/trial/:plan">
        <CheckoutContainer />
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
      <PrivateRoute exact path="/home">
        <HomeContainer />
      </PrivateRoute>
      <PrivateRoute exact path="/accounts/edit">
        <AccountContainer />
      </PrivateRoute>
      <PrivateRoute exact path="/system">
        <SchedulesContainer />
      </PrivateRoute>
      {/* Open Routes */}
      <Route exact path="/contact" component={Feedback} />
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
            to='/home'
          />
        )
      }
    />
  );
};
