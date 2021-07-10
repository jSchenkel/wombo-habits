import React from 'react';

const InfoTooltip = (props) => {

  const text = props.text;
  const minWidth = props.minWidth ? props.minWidth : '12rem';
  // expected iconSize values: is-small, is-medium, is-large
  const iconSize = props.iconSize ? props.iconSize : '';

  return (
    <div className="dropdown is-hoverable is-right is-up">
      <div className="dropdown-trigger">
        <span className={`icon ${iconSize} has-text-grey-light has-pointer`} aria-haspopup="true" aria-controls="dropdown-menu">
          <i className="fas fa-info-circle" aria-hidden="true"></i>
        </span>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{minWidth}}>
        <div className="dropdown-content">
          <div className="dropdown-item">
            <p className="has-text-weight-normal is-family-primary is-size-7">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
