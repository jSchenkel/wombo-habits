import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// route components
// Public routes
import LandingPage from '../ui/LandingPage';
import StartContainer from '../ui/Start/StartContainer';
import PlansContainer from '../ui/Plans/PlansContainer';
import CheckoutContainer from '../ui/CheckoutContainer';
import Login from '../ui/Accounts/Login';
import Signup from '../ui/Accounts/Signup';
import ForgotPassword from './../ui/Accounts/ForgotPassword';
import ResetPassword from './../ui/Accounts/ResetPassword';
// Private routes
import HomeContainer from './../ui/Home/HomeContainer';
import SchedulesContainer from '../ui/Schedules/SchedulesContainer';
import AccountContainer from './../ui/Accounts/AccountContainer';
// Open routes
import Feedback from '../ui/Feedback';
// Legal
import Terms from '../ui/legal/Terms';
import Privacy from '../ui/legal/Privacy';

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
