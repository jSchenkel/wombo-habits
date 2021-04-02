import React from 'react';

const LoadingIcon = () => {
  return (
    <div className="columns is-centered">
      <div className="column">
        <p className="has-text-centered">
          <span className="icon is-medium has-text-link">
            <i className="fas fa-spinner fa-pulse"></i>
          </span>
          <span>Loading...</span>
        </p>
      </div>
    </div>
  );
}

export default LoadingIcon;
