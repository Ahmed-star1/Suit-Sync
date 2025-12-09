import React from "react";

const MeasurementForm = ({ title, fields }) => {
  return (
    <div className="measurement-form">
      <h3>{title}</h3>

      <div className="row">
        {fields.map((field, i) => (
          <div key={i} className="col-md-4 input-group">
            <label>{field}</label>
            <input className="input" placeholder="Enter Size" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementForm;