import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaPen } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createEvent, addMemberToInProgressEvent, removeMemberFromInProgressEvent, clearInProgressEvent, setInProgressEvent } from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";

const AddEventMember = () => {
  const PHONE_NUMBER_LENGTH = 10;
  const [event_member, setMembersList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeRoleDropdown, setActiveRoleDropdown] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [editingInitialValues, setEditingInitialValues] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, events } = useSelector((state) => state.events);
  const inProgressEvent = useSelector((state) => state.events.inProgressEvent);

  const roleOptions = [
    { value: "Groomsman", label: "Groomsman" },
    { value: "Father of Groom", label: "Father of Groom" },
    { value: "Father of Bride", label: "Father of Bride" },
    { value: "Best Man", label: "Best Man" },
    { value: "Best Person", label: "Best Person" },
  ];

  useEffect(() => {
    if (inProgressEvent) {
      setMembersList(inProgressEvent.event_member || []);
    }
  }, [inProgressEvent]);

  // If page reloaded and no inProgressEvent, redirect based on events existence
  useEffect(() => {
    if (!inProgressEvent && location.pathname === "/add-event-member") {
      if (events && events.length > 0) {
        navigate("/events");
      } else {
        navigate("/create-event");
      }
    }
  }, [inProgressEvent, location.pathname, navigate, events]);

  // Cleanup on unmount - clear all event data
  useEffect(() => {
    return () => {
      dispatch(clearInProgressEvent());
    };
  }, [dispatch]);

  // Clear event data when navigating away from event-related pages
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
      dispatch(clearInProgressEvent());
    }
  }, [location.pathname, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setActiveRoleDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, PHONE_NUMBER_LENGTH);

    if (digits.length <= 3) {
      return digits.length ? `(${digits}` : "";
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const validationSchema = Yup.object({
    role: Yup.string().required("Role is required"),

    name: Yup.string()
      .required("Member name is required")
      .max(255, "Max 255 characters"),

    phone: Yup.string()
      .required("Phone is required")
      .matches(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        "Phone number must be in (123) 456-7890 format",
      ),

    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .max(255, "Max 255 characters"),

    image: Yup.mixed()
      .nullable()
      .test("fileType", "Only PNG, JPG or JPEG allowed", (value) => {
        if (!value || !(value instanceof File)) return true; 
        return ["image/png", "image/jpeg", "image/jpg"].includes(value.type);
      })
      .test("fileSize", "Image must be less than 100MB", (value) => {
        if (!value || !(value instanceof File)) return true; 
        return value.size <= 100 * 1024 * 1024;
      }),
  });

  const handleSaveMember = async (values, { resetForm }) => {
    if (editingMemberIndex !== null) {
      const updatedMembers = [...event_member];
      const currentMember = updatedMembers[editingMemberIndex];
      const image =
        values.image instanceof File
          ? await convertToBase64(values.image)
          : currentMember.image || currentMember.image_url || "/Images/camera.png";

      updatedMembers[editingMemberIndex] = {
        ...currentMember,
        role: values.role,
        name: values.name,
        phone: values.phone,
        email: values.email,
        image,
        image_url: image,
      };

      setMembersList(updatedMembers);
      dispatch(setInProgressEvent({ ...inProgressEvent, event_member: updatedMembers }));
      setImagePreview(null);
      setImageBase64(null);
      setEditingMemberIndex(null);
      setEditingInitialValues(null);
      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const base64 =
      values.image instanceof File
        ? await convertToBase64(values.image)
        : "/Images/camera.png";

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

    dispatch(addMemberToInProgressEvent(newMember));

    setImagePreview(null);
    setImageBase64(null);
    resetForm();
     if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditMember = (index) => {
    const member = event_member[index];
    const image = member.image || member.image_url || null;

    setEditingMemberIndex(index);
    setEditingInitialValues({
      role: member.role || "",
      name: member.name || "",
      phone: formatPhoneNumber(member.phone || ""),
      email: member.email || "",
      image,
    });
    setImagePreview(image);
    setActiveDropdown(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelEdit = (resetForm) => {
    setEditingMemberIndex(null);
    setEditingInitialValues(null);
    setImagePreview(null);
    setImageBase64(null);
    resetForm();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveMember = (id) => {
    const updatedMembers = event_member.filter((m) => m.id !== id);
    setMembersList(updatedMembers);

    dispatch(removeMemberFromInProgressEvent(id));
    if (editingMemberIndex !== null) {
      setEditingMemberIndex(null);
      setEditingInitialValues(null);
      setImagePreview(null);
    }
    setActiveDropdown(null);
  };

  const handleCreateEvent = async () => {
    if (!inProgressEvent) return;

    const eventPayload = {
      ...inProgressEvent,
      event_member,
    };

    if (inProgressEvent.image || inProgressEvent.imageFile) {
      eventPayload.image = inProgressEvent.image || inProgressEvent.imageFile;
    }

    const result = await dispatch(
      createEvent(eventPayload),
    );

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(clearInProgressEvent());
      navigate("/events");
    }
  };

  const handleRoleSelect = (value, setFieldValue) => {
    setFieldValue("role", value);
    setActiveRoleDropdown(null);
  };
   const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFieldValue("image", file);
    setImagePreview(URL.createObjectURL(file));
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
                <h3>{editingMemberIndex !== null ? "Edit Member" : "Add Member"}</h3>

                <Formik
                  enableReinitialize
                  initialValues={
                    editingInitialValues || {
                      role: "",
                      name: "",
                      phone: "",
                      email: "",
                      image: null,
                    }
                  }
                  validationSchema={validationSchema}
                  onSubmit={handleSaveMember}
                >
                  {({ setFieldValue, values, resetForm }) => (
                    <Form>
                      <div className="upload-photo-box">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />

                        {imagePreview ? (
                          <div
                            className="image-container"
                            style={{ position: "relative" }}
                          >
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
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="member-form-fields product-detail-page">
                        <div className="field select-field">
                          <label>Select Role</label>
                          <div className="custom-select-wrapper">
                            <div
                              className="custom-select"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRoleDropdown(
                                  activeRoleDropdown === "role" ? null : "role",
                                );
                              }}
                            >
                              <span className="selected-value">
                                {values.role
                                  ? roleOptions.find(
                                      (r) => r.value === values.role,
                                    )?.label || values.role
                                  : "Select Role"}
                              </span>
                              <i className="fa-solid fa-chevron-down"></i>
                            </div>

                            {activeRoleDropdown === "role" && (
                              <ul className="custom-select-dropdown">
                                {roleOptions.map((role, index) => (
                                  <li
                                    key={index}
                                    className={
                                      values.role === role.value ? "active" : ""
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRoleSelect(
                                        role.value,
                                        setFieldValue,
                                      );
                                    }}
                                  >
                                    {role.label}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <ErrorMessage
                            name="role"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="field">
                          <label>Member Name</label>
                          <Field
                            className="input"
                            type="text"
                            name="name"
                            placeholder="Enter member name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="field">
                          <label>Phone</label>
                          <Field
                            className="input"
                            type="tel"
                            name="phone"
                            placeholder="000-000-0000"
                            inputMode="numeric"
                            maxLength={14}
                            value={values.phone}
                            onChange={(e) =>
                              setFieldValue(
                                "phone",
                                formatPhoneNumber(e.target.value),
                              )
                            }
                          />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="field">
                          <label>Email</label>
                          <Field
                            className="input"
                            type="email"
                            name="email"
                            placeholder="abc@example.com"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="buttons-row">
                          {editingMemberIndex !== null && (
                            <button
                              type="button"
                              className="designBtn2"
                              onClick={() => handleCancelEdit(resetForm)}
                            >
                              Cancel
                            </button>
                          )}
                          <button type="submit" className="add-button designBtn2">
                            {editingMemberIndex !== null ? "Update" : "Add Member"}
                          </button>
                        </div>
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
                      <h3>
                        You Don't Have Any
                        <br />
                        Members Yet
                      </h3>
                      <p>
                        Please add the member to the form with the complete
                        details.
                      </p>
                    </div>
                  ) : (
                    <div className="members-list">
                      <h3>Members List ({event_member.length})</h3>
                      <div className="members-wrapper">
                        {event_member.map((member, index) => (
                          <div
                            key={member.id}
                            className="member-row"
                            onClick={() => handleEditMember(index)}
                          >
                            <div className="member-left">
                              <img
                                src={
                                  member.image ||
                                  member.image_url ||
                                  "/Images/suit1.png"
                                }
                                className="member-thumb"
                                alt={member.name}
                                onError={(e) => {
                                  e.target.src = "/Images/suit1.png";
                                }}
                              />
                            </div>
                            <div className="member-center">
                              <h4>{member.name}</h4>
                              <p>{member.role}</p>
                            </div>
                            <div className="member-right">
                              <button
                                className="dots-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(
                                    activeDropdown === member.id
                                      ? null
                                      : member.id,
                                  );
                                }}
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              {activeDropdown === member.id && (
                                <div className="dropdown-menu">
                                  <button
                                    className="remove-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveMember(member.id);
                                    }}
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

                <div className="buttons-row d-flex justify-content-end">
                  {/* <button
                    className="designBtn2"
                    onClick={() => {
                      clearEventData();
                      navigate("/create-event");
                    }}
                  >
                    Back
                  </button> */}
                  <button
                    className="designBtn2"
                    onClick={handleCreateEvent}
                    disabled={event_member.length === 0}
                    style={{
                      opacity: event_member.length === 0 ? 0.5 : 1,
                      cursor:
                        event_member.length === 0 ? "not-allowed" : "pointer",
                    }}
                  >
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
