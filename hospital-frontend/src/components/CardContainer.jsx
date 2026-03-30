import React from 'react';

const CardContainer = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
