import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaPen } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getEventData,
  setEventData,
  clearEventData,
} from "../Redux/Utils/localStore";
import { createEvent } from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";

const AddEventMember = () => {
  const [event_member, setMembersList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.events);

  useEffect(() => {
    const events = getEventData();
    if (events?.length) {
      const latest = events[events.length - 1];
      setCurrentEventId(latest.id);
      setMembersList(latest.event_member || []);
    }
  }, []);

  // Cleanup on unmount - clear all event data
  useEffect(() => {
    return () => {
      // If user navigates away without completing, clear all event data
      clearEventData();
    };
  }, []);

  // Clear event data when navigating away from event-related pages
  useEffect(() => {
    const eventPaths = ["/create-event", "/add-event-member", "/edit-event", "/edit-event-members"];
    const isEventRoute = eventPaths.some(path => location.pathname.startsWith(path));
    
    if (!isEventRoute) {
      clearEventData();
    }
  }, [location.pathname]);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const validationSchema = Yup.object({
    role: Yup.string()
      .required("Role is required")
      .oneOf(["groomsmen"], "Invalid role"),

    name: Yup.string()
      .required("Member name is required")
      .max(255, "Max 255 characters"),

    phone: Yup.string()
      .required("Phone is required")
      .max(20, "Max 20 characters"),

    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .max(255, "Max 255 characters"),

    image: Yup.mixed()
      .required("Member image is required")
      .test(
        "fileType",
        "Only PNG, JPG or JPEG allowed",
        (value) =>
          value &&
          ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
      )
      .test(
        "fileSize",
        "Image must be less than 5MB",
        (value) => value && value.size <= 5 * 1024 * 1024
      ),
  });

  const handleSaveMember = async (values, { resetForm }) => {
    const base64 = await convertToBase64(values.image);

    const newMember = {
      id: Date.now().toString(),
      role: values.role,
      name: values.name,
      phone: values.phone,
      email: values.email,
      image: base64,
    };

    const updatedMembers = [...event_member, newMember];
    setMembersList(updatedMembers);

    const events = getEventData();
    const updatedEvents = events.map((event) =>
      event.id === currentEventId
        ? { ...event, event_member: updatedMembers }
        : event
    );

    setEventData(updatedEvents);

    setImagePreview(null);
    setImageBase64(null);
    resetForm();
  };

  const handleRemoveMember = (id) => {
    const updatedMembers = event_member.filter((m) => m.id !== id);
    setMembersList(updatedMembers);

    const events = getEventData();
    const updatedEvents = events.map((event) =>
      event.id === currentEventId
        ? { ...event, event_member: updatedMembers }
        : event
    );

    setEventData(updatedEvents);
  };

  const handleCreateEvent = async () => {
    const events = getEventData();
    const latestEvent = events[events.length - 1];

    if (!latestEvent || (!latestEvent.image && !latestEvent.imageFile)) return;

    const result = await dispatch(
      createEvent({
        ...latestEvent,
        image: latestEvent.image || latestEvent.imageFile,
        event_member,
      })
    );

    if (createEvent.fulfilled.match(result)) {
      clearEventData();
      navigate("/events");
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="col-md-9 right-column add-member">
        <div className="right-column-content">
          <h2>Add Event Member</h2>

          <div className="add-member-container container-fluid">
            <div className="row">
              <div className="add-member-form col-md-5">
                <h3>Add Member</h3>

                <Formik
                  initialValues={{
                    role: "",
                    name: "",
                    phone: "",
                    email: "",
                    image: null,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSaveMember}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      <div className="upload-photo-box">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setFieldValue("image", file);
                            setImagePreview(URL.createObjectURL(file));
                          }}
                        />

                        {imagePreview ? (
                          <div className="image-container" style={{ position: "relative" }}>
                            <img
                              src={imagePreview}
                              alt="member"
                              className="member-preview"
                              onClick={() => fileInputRef.current.click()}
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
                            className="camera-box"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <img src="/Images/camera.png" alt="Upload" />
                          </div>
                        )}
                        <ErrorMessage name="image" component="div" className="text-danger" />
                      </div>

                      <div className="member-form-fields">
                        <div className="field">
                          <label>Select Role</label>
                          <div className="select-field">
                            <Field as="select" name="role">
                              <option value="">Select Role</option>
                              <option value="groomsmen">groomsmen</option>
                              <option value="groomsman 2">groomsman 2</option>
                              <option value="groomsman 3">groomsman 3</option>
                            </Field>
                          </div>
                          <ErrorMessage name="role" component="div" className="text-danger" />
                        </div>

                        <div className="field">
                          <label>Member Name</label>
                          <Field
                            className="input"
                            type="text"
                            name="name"
                            placeholder="Enter member name"
                          />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>

                        <div className="field">
                          <label>Phone</label>
                          <Field
                            className="input"
                            type="tel"
                            name="phone"
                            placeholder="000-000-0000"
                          />
                          <ErrorMessage name="phone" component="div" className="text-danger" />
                        </div>

                        <div className="field">
                          <label>Email</label>
                          <Field
                            className="input"
                            type="email"
                            name="email"
                            placeholder="abc@example.com"
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>

                        <button type="submit" className="designBtn2">
                          Add Member
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="member-lists col-md-7">
                <div className="member-box">
                  {event_member.length === 0 ? (
                    <div className="empty-box">
                      <div className="camera-box">
                        <FaUser />
                      </div>
                      <h3>You Don't Have Any<br />Members Yet</h3>
                      <p>Please add the member to the form with the complete details.</p>
                    </div>
                  ) : (
                    <div className="members-list">
                      <h3>Members List ({event_member.length})</h3>
                      <div className="members-wrapper">
                        {event_member.map((member) => (
                          <div key={member.id} className="member-row">
                            <div className="member-left">
                              <img src={member.image || member.image_url} className="member-thumb" alt={member.name} />
                            </div>
                            <div className="member-center">
                              <h4>{member.name}</h4>
                              <p>{member.role}</p>
                            </div>
                            <div className="member-right">
                              <button
                                className="dots-btn"
                                onClick={() => setActiveDropdown(member.id)}
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              {activeDropdown === member.id && (
                                <div className="dropdown-menu">
                                  <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveMember(member.id)}
                                  >
                                    Remove Member
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="buttons-row">
                  <button 
                    className="designBtn2" 
                    onClick={() => {
                      clearEventData();
                      navigate("/create-event");
                    }}
                  >
                    Back
                  </button>
                  <button className="designBtn2" onClick={handleCreateEvent}>
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEventMember;