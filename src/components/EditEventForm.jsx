import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { getEventData, clearEventData } from "../Redux/Utils/localStore";
import { setEvents } from "../Redux/Reducers/eventSlice";
import { fileToBase64 } from "../Redux/Utils/helper";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];

const EditEventForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [currentEventId, setCurrentEventId] = useState(null);

  const [name, setEventName] = useState("");
  const [type, setEventType] = useState("");
  const [date, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [description, setEventDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [eventImageFile, setEventImageFile] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("Event name is required"),
    type: Yup.string().required("Event type is required"),
    date: Yup.string().required("Event date is required"),
    location: Yup.string().required("Event location is required"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Minimum 10 characters")
      .max(2000, "Maximum 2000 characters"),
    image: Yup.mixed(),
  });

  useEffect(() => {
    const eventFromState = location?.state?.event;

    if (eventFromState) {
      const ev = eventFromState;
      setCurrentEventId(ev.id || null);
      setEventName(ev.name || "");
      setEventType(ev.type || "");
      setEventDate(formatDateForInput(ev.date) || "");
      setEventLocation(ev.location || "");
      setEventDescription(ev.description || "");
      setImagePreview(ev.image_url || ev.image || "");
      return;
    }

    const events = getEventData() || [];
    const event = events.find(
      (e) => e.id === id || String(e.id) === String(id),
    );

    if (!event) {
      navigate("/events");
      return;
    }

    setCurrentEventId(event.id || null);
    setEventName(event.name || "");
    setEventType(event.type || "");
    setEventDate(formatDateForInput(event.date) || "");
    setEventLocation(event.location || "");
    setEventDescription(event.description || "");
    setImagePreview(event.image_url || event.image || "");
  }, [id, location, navigate]);

  useEffect(() => {
    const eventPaths = [
      "/create-event",
      "/add-event-member",
      "/edit-event",
      "/edit-event-members",
    ];
    const isEventRoute = eventPaths.some((path) =>
      location.pathname.startsWith(path),
    );

    if (!isEventRoute) {
      clearEventData();
    }
  }, [location.pathname]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split("T")[0];
  };

  const handleImageSelect = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!(file instanceof File)) {
      return;
    }

    setEventImageFile(file);
    setFieldValue("image", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = async (values, { setSubmitting, setErrors }) => {

    // imge validation start
    const hasExistingImage = Boolean(imagePreview);
    const hasNewImageFile = eventImageFile instanceof File;
    
    if (!hasExistingImage && !hasNewImageFile) {
      setErrors({ image: "Event image is required" });
      setSubmitting(false);
      return;
    }
    
    if (hasNewImageFile) {
      if (eventImageFile.size > MAX_IMAGE_SIZE) {
        setErrors({ image: "Image size must be less than 5MB" });
        setSubmitting(false);
        return;
      }
      
      if (!SUPPORTED_FORMATS.includes(eventImageFile.type)) {
        setErrors({ image: "Only png, jpg, jpeg formats are allowed" });
        setSubmitting(false);
        return;
      }
    }
    // imge validation end

    let eventImageFile_base64 = null;
    if (eventImageFile instanceof File) {
      eventImageFile_base64 = await fileToBase64(eventImageFile);
    }

    const updatedEvent = {
      id: currentEventId || id,
      name: values.name || "",
      type: values.type || "",
      date: values.date || "",
      location: values.location || "",
      description: values.description || "",
      image: eventImageFile_base64 || imagePreview || "",
      event_member: [],
    };

    const events = getEventData() || [];
    const idx = events.findIndex(
      (e) => String(e.id) === String(updatedEvent.id),
    );
    let updatedEvents;
    if (idx !== -1) {
      updatedEvent.event_member = events[idx].event_member || [];
      updatedEvents = [...events];
      updatedEvents[idx] = { ...events[idx], ...updatedEvent };
    } else {
      updatedEvents = [...events, updatedEvent];
    }
    await dispatch(setEvents(updatedEvents));

    navigate(`/edit-event-members/${updatedEvent.id}`);

    setSubmitting(false);
  };

  return (
    <div className="col-md-9 right-column create-event">
      <div className="right-column-content">
        <h2>Edit An Event</h2>
        <Formik
          initialValues={{
            name,
            type,
            date,
            location: eventLocation,
            description,
            image: imagePreview ? "existing-image" : null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleNext}
          enableReinitialize
        >
          {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
            <Form className="create-event-form">
              <div className="row">
                <div className="input-group">
                  <label>Event Name</label>
                  <input
                    className="input"
                    type="text"
                    value={values.name}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    onBlur={() => setFieldTouched("name", true)}
                  />
                  {touched.name && errors.name && (
                    <div className="text-danger">{errors.name}</div>
                  )}
                </div>

                <div className="input-group">
                  <label>Select Event Type</label>
                  <div className="select-field">
                    <select
                      value={values.type}
                      onChange={(e) => setFieldValue("type", e.target.value)}
                      onBlur={() => setFieldTouched("type", true)}
                    >
                      <option value="Wedding Ceremony">Wedding Ceremony</option>
                      <option value="Wedding Reception">
                        Wedding Reception
                      </option>
                      <option value="Bachelor Party">Bachelor Party</option>
                      <option value="Rehearsal Dinner">Rehearsal Dinner</option>
                    </select>
                    {touched.type && errors.type && (
                      <div className="text-danger">{errors.type}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="input-group">
                  <label>Event Date</label>
                  <input
                    className="input"
                    type="date"
                    value={values.date}
                    onChange={(e) => setFieldValue("date", e.target.value)}
                    onBlur={() => setFieldTouched("date", true)}
                  />
                  {touched.date && errors.date && (
                    <div className="text-danger">{errors.date}</div>
                  )}
                </div>

                <div className="input-group">
                  <label>Event Location</label>
                  <input
                    className="input"
                    type="text"
                    value={values.location}
                    onChange={(e) => setFieldValue("location", e.target.value)}
                    onBlur={() => setFieldTouched("location", true)}
                  />
                  <i className="fa-solid fa-location-crosshairs"></i>
                  {touched.location && errors.location && (
                    <div className="text-danger">{errors.location}</div>
                  )}
                </div>
              </div>

              <div className="text-field">
                <label>Event Description</label>
                <textarea
                  className="textarea-input"
                  rows="4"
                  value={values.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  onBlur={() => setFieldTouched("description", true)}
                />
                {touched.description && errors.description && (
                  <div className="text-danger">{errors.description}</div>
                )}
              </div>

              <div className="profile-image">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleImageSelect(e, setFieldValue);
                    setFieldTouched("image", true);
                  }}
                />

                {imagePreview ? (
                  <div
                    className="image-container"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={imagePreview}
                      alt="Event"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="image-edit-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <FaPen size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="placeholder-box"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaPlus />
                  </div>
                )}
                {touched.image && errors.image && (
                  <div className="text-danger">{errors.image}</div>
                )}
              </div>

              <div className="buttons-row">
                <button
                  className="designBtn2"
                  type="button"
                  onClick={() => {
                    clearEventData();
                    navigate("/events");
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

export default EditEventForm;
