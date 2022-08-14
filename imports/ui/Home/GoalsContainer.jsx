import React from 'react';
import { Meteor } from 'meteor/meteor';

import LoadingIcon from '../LoadingIcon';

const GoalsContainer = (props) => {

  return (
    <div>
      <nav className="panel mb-4">
        <p className="panel-block">
          Goals
        </p>
        <label className="panel-block">
          <input type="checkbox" />
          goal 1
        </label>
        <div className="panel-block">
          <div class="field has-addons">
            <div class="control">
              <input class="input is-expanded" type="text" placeholder="Find a repository" />
            </div>
            <div class="control">
              <a class="button is-link">
                Add
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default GoalsContainer;
