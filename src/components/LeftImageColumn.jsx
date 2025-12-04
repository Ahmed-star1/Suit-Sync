import React from 'react';

const LeftColumn = ({ image, title }) => {
  return (
    <div className="left-image-column col-md-6" style={{ backgroundImage: `url(${image})` }}>
      <div className="image-text">
        <img src="/Images/WhiteLogo.png" alt="Logo" className="logo" />
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default LeftColumn;