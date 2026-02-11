import React, { useState } from "react";

const MeasurementForm = ({ title, fields, options }) => {
  const optionsData = {
    shirt: {
      "Shirt Size": ["S", "M", "L", "XL", "2XL", "3XL"],
    },
    pant: {
      "Pant Size": ["Short", "Regular", "Long"],
      "Pant Length": {
        Short: ["34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52",],
        Regular: ["28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60",],
        Long: ["28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60",],
      },
    },
    coat: {
      "Coat Size": ["Short", "Regular", "Long", "XL"],
      "Coat Length": {
        Short: ["34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50",],
        Regular: ["34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66",],
        Long: ["34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66",],
        XL: ["38","39","40","41","42","43","44","45","46","47","48","49","50","51","52",],
      },
    },
    shoes: {
      "Shoes Size": ["7", "8", "9", "10", "11", "12", "13", "14"],
    },
  };

  const [selectedValues, setSelectedValues] = useState({});

  const handleFieldChange = (fieldName, value) => {
    const newValues = { ...selectedValues, [fieldName]: value };

    if (fieldName === "Pant Size" || fieldName === "Coat Size") {
      const lengthField =
        fieldName === "Pant Size" ? "Pant Length" : "Coat Length";
      newValues[lengthField] = "";
    }

    setSelectedValues(newValues);
  };

  return (
    <div className="measurement-form">
      <h3>{title}</h3>

      <div className="row">
        {fields.map((field, i) => {
          const isLengthField =
            field === "Pant Length" || field === "Coat Length";
          const sizeField =
            field === "Pant Length"
              ? "Pant Size"
              : field === "Coat Length"
                ? "Coat Size"
                : "";

          return (
            <div
              key={i}
              className= "input-group"
            >
              <label>{field}</label>
              <div className="select-field">
                <select
                  value={selectedValues[field] || ""}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  disabled={isLengthField && !selectedValues[sizeField]}
                >
                  <option value="" disabled>
                    {isLengthField && !selectedValues[sizeField]
                      ? "Select Length"
                      : `Select ${field}`}
                  </option>

                  {isLengthField &&
                    selectedValues[sizeField] &&
                    optionsData[options]?.[field]?.[
                      selectedValues[sizeField]
                    ]?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}

                  {!isLengthField &&
                    optionsData[options]?.[field]?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeasurementForm;
