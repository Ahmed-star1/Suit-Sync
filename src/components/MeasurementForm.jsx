import React, { useState, useEffect, useRef } from "react";

const MeasurementForm = ({ 
  title, 
  fields, 
  categoryData,
  onMeasurementChange, 
  selectedValues = {} 
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // Parse category data based on type
  const getOptionsForField = (field) => {
    if (!categoryData) return [];
    const { type, data } = categoryData.size_options || {};
    switch (type) {
      case "size_type":
        return data?.size_types || [];
        
      case "measurement":
        return data?.measurements || [];
        
      case "standard":
        return ["Standard"];
        
      case "complex":
        if (field === "coat_size" || field === "pant_size") {
          const category = field === "coat_size" ? "coat" : "pants";
          const categoryData = data?.categories?.find(c => c.name === category);
          return categoryData?.types?.map(t => t.name) || [];
        } else if (field === "coat_fit" || field === "pant_fit") {
          const category = field === "coat_fit" ? "coat" : "pants";
          const sizeField = field === "coat_fit" ? "coat_size" : "pant_size";
          const selectedSize = selectedValues[sizeField];
          if (!selectedSize) return [];
          const categoryData = data?.categories?.find(c => c.name === category);
          const sizeType = categoryData?.types?.find(t => t.name === selectedSize);
          return sizeType?.measurements || [];
        }
        return [];
        
      default:
        return [];
    }
  };

  const handleFieldChange = (fieldName, value) => {
    onMeasurementChange(fieldName, value);
    setActiveDropdown(null);
  };

  const handleDropdownClick = (fieldName, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === fieldName ? null : fieldName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !dropdownRefs.current[activeDropdown]?.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  // Get display label for field
  const getFieldLabel = (field) => {
    const labels = {
      shirt_size: "Shirt Size",
      pant_fit: "Pant Fit",
      pant_size: "Pant Size",
      coat_fit: "Coat Fit",
      coat_size: "Coat Size",
      shoe_size: "Shoes Size",
      belt_size: "Belt Size",
      tie_size: "Tie Size"
    };
    return labels[field] || field;
  };

  // Check if field is dependent on another field (for complex categories)
  const isDependentField = (field) => {
    return field === "coat_fit" || field === "pant_fit";
  };

  const getParentField = (field) => {
    if (field === "coat_fit") return "coat_size";
    if (field === "pant_fit") return "pant_size";
    return "";
  };

  return (
    <div className="measurement-form product-detail-page checkout-page">
      <h3>{title}</h3>

      <div className="row">
        {fields.map((field, i) => {
          const selectedValue = selectedValues[field] || "";
          const fieldLabel = getFieldLabel(field);
          const isDependent = isDependentField(field);
          const parentField = getParentField(field);
          const isDisabled = isDependent && !selectedValues[parentField];
          
          // Get options dynamically
          let optionsList = getOptionsForField(field);

          return (
            <div
              key={i}
              className="input-group"
              ref={(el) => (dropdownRefs.current[field] = el)}
            >
              <label>{fieldLabel}</label>
              <div className="select-field">
                <div className="custom-select-wrapper">
                  <div
                    className={`custom-select ${isDisabled ? "disabled" : ""}`}
                    onClick={(e) => !isDisabled && handleDropdownClick(field, e)}
                  >
                    <span className="selected-value">
                      {selectedValue || (isDisabled ? `Select ${fieldLabel} First` : `Select ${fieldLabel}`)}
                    </span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>

                  {activeDropdown === field && !isDisabled && (
                    <ul className="custom-select-dropdown">
                      {optionsList.length > 0 ? (
                        optionsList.map((option, index) => (
                          <li
                            key={index}
                            className={selectedValue === option ? "active" : ""}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFieldChange(field, option);
                            }}
                          >
                            {option}
                          </li>
                        ))
                      ) : (
                        <li className="dropdown-item no-results">
                          No options available
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeasurementForm;