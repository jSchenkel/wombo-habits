import React from 'react';

const NavbarBrandImage = (props) => {
  const height = props.height ? props.height : '3.2rem';
  return (
    <img src="/images/brand1.png" className="image-not-draggable navbar-brand-image" style={{height}} />
  );
}

export default NavbarBrandImage;
