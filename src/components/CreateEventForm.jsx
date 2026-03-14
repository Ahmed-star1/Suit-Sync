import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getEventData, setEventData, clearEventData } from "../Redux/Utils/localStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreateEventForm = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    type: "",
    date: "",
    location: "",
    description: "",
    image: ""
  });

  const eventTypes = [
    { value: "Wedding Ceremony", label: "Wedding Ceremony" },
    { value: "Wedding Reception", label: "Wedding Reception" },
    { value: "Bachelor Party", label: "Bachelor Party" },
    { value: "Rehearsal Dinner", label: "Rehearsal Dinner" },
  ];

  useEffect(() => {
    const savedEvents = getEventData();
    if (savedEvents?.length) {
      const latest = savedEvents[savedEvents.length - 1];
      
      setCurrentEventId(latest.id);
      
      if (latest.image) setImagePreview(latest.image);
      if (latest.imageFile) setImageFile(latest.imageFile);
      
      setFormValues({
        name: latest.name || "",
        type: latest.type || "",
        date: latest.date || "",
        location: latest.location || "",
        description: latest.description || "",
        image: latest.imageFile || ""
      });
    }
  }, []);

  useEffect(() => {
    const eventPaths = ["/create-event", "/add-event-member", "/edit-event", "/edit-event-members"];
    const isEventRoute = eventPaths.some(path => location.pathname.startsWith(path));
    
    if (!isEventRoute) {
      clearEventData();
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleImageSelect = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFieldValue("image", file);
    };
    reader.readAsDataURL(file);
  };

  const handleDropdownClick = (dropdownName, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleEventTypeSelect = (value, setFieldValue) => {
    setFieldValue("type", value);
    setActiveDropdown(null);
  };

  const saveEventToLocalStorage = (values) => {
    const events = getEventData() || [];
    
    if (currentEventId) {
      const eventIndex = events.findIndex(event => event.id === currentEventId);
      if (eventIndex !== -1) {
        events[eventIndex] = {
          ...events[eventIndex],
          name: values.name,
          type: values.type,
          date: values.date,
          location: values.location,
          description: values.description,
          image: imagePreview,
          imageFile: imageFile
        };
      }
    } else {
      const eventData = {
        id: Date.now().toString(),
        name: values.name,
        type: values.type,
        date: values.date,
        location: values.location,
        description: values.description,
        image: imagePreview,
        imageFile: imageFile,
        event_member: []
      };
      events.push(eventData);
    }
    
    setEventData(events);
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Event name is required")
      .max(255, "Max 255 characters"),

    type: Yup.string()
      .required("Event type is required")
      .oneOf(
        [
          "Bachelor Party",
          "Wedding Ceremony",
          "Rehearsal Dinner",
          "Wedding Reception",
        ],
        "Invalid event type"
      ),

    date: Yup.date()
      .required("Event date is required"),

    location: Yup.string()
      .required("Event location is required"),

    description: Yup.string()
      .required("Description is required")
      .min(10, "Minimum 10 characters")
      .max(2000, "Maximum 2000 characters"),

    image: Yup.mixed()
      .required("Image is required")
      .test(
        "fileType",
        "Image must be PNG, JPG or JPEG format",
        (value) => {
          if (value && value instanceof File) {
            return ["image/png", "image/jpeg", "image/jpg"].includes(value.type);
          }
          return !!value;
        }
      )
      .test(
        "fileSize",
        "Image size must be less than 5MB",
        (value) => {
          if (value && value instanceof File) {
            return value.size <= 5 * 1024 * 1024;
          }
          return !!value;
        }
      ),
  });

  return (
    <div className="col-md-9 right-column create-event">
      <div className="right-column-content">
        <h2>Create An Event</h2>

        <Formik
          initialValues={formValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            saveEventToLocalStorage(values);
            navigate("/add-event-member");
          }}
        >
          {({ setFieldError, setFieldValue, values }) => (
            <Form className="create-event-form">

              <div className="row">
                <div className="input-group">
                  <label>Event Name *</label>
                  <Field
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Enter Event Name"
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </div>

                <div className="input-group select-field product-detail-page">
                  <label>Select Event Type *</label>
                  <div className="custom-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={(e) => handleDropdownClick('eventType', e)}
                    >
                      <span className="selected-value">
                        {values.type || "Select Event Type"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {activeDropdown === 'eventType' && (
                      <ul className="custom-select-dropdown">
                        {eventTypes.map((type, index) => (
                          <li
                            key={index}
                            className={values.type === type.value ? 'active' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventTypeSelect(type.value, setFieldValue);
                            }}
                          >
                            {type.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <ErrorMessage name="type" component="div" className="text-danger" />
                </div>
              </div>

              <div className="row">
                <div className="input-group">
                  <label>Event Date *</label>
                  <Field
                    className="input"
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <ErrorMessage name="date" component="div" className="text-danger" />
                </div>

                <div className="input-group">
                  <label>Event Location *</label>
                  <Field
                    className="input"
                    type="text"
                    name="location"
                    placeholder="Enter Location"
                  />
                  <ErrorMessage name="location" component="div" className="text-danger" />
                </div>
              </div>

              <div className="text-field">
                <label>Event Description</label>
                <Field
                  as="textarea"
                  className="textarea-input"
                  name="description"
                  placeholder="Write Event Description Here..."
                  rows="4"
                />
                <ErrorMessage name="description" component="div" className="text-danger" />
              </div>

              <div className="profile-image">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleImageSelect(e, setFieldValue)
                  }
                />

                {imagePreview ? (
                  <div className="image-container" style={{ position: "relative" }}>
                    <img src={imagePreview} alt="Event" />
                    <button
                      type="button"
                      className="image-edit-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <FaPen size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="placeholder-box" onClick={() => fileInputRef.current.click()}>
                    <FaPlus />
                  </div>
                )}

                <ErrorMessage name="image" component="div" className="text-danger" />
              </div>

              <div className="buttons-row">
                <button
                  className="designBtn2"
                  type="button"
                  onClick={() => {
                    clearEventData();
                    navigate(-1);
                  }}
                >
                  Back
                </button>
                <button className="designBtn2" type="submit">
                  Next
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateEventForm;