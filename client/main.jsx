import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import ReactDOM from 'react-dom';

import { routes } from './../imports/routes/routes.js';
import '../imports/startup/simple-schema-configuration.js';

Meteor.startup(() => {
  ReactDOM.render(routes, document.getElementById('app'));
});
