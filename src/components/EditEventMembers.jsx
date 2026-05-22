import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaPen } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  setInProgressEvent,
  clearInProgressEvent,
  getEvents,
  updateEvent,
  addNewMember,
} from "../Redux/Reducers/eventSlice";
import Loader from "../components/Loader";
import { base64ToFile } from "../Redux/Utils/helper";

const EditEventMembers = () => {
  const PHONE_NUMBER_LENGTH = 10;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [event_member, setMembersList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeRoleDropdown, setActiveRoleDropdown] = useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [editingInitialValues, setEditingInitialValues] = useState(null);
  const brokenImageUrlsRef = useRef(new Set());
  const BROKEN_PLACEHOLDER = "/Images/camera.png";

  const fileInputRef = useRef(null);

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
    dispatch(getEvents());
  }, [dispatch]);

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

  useEffect(() => {
    if (events && events.length > 0) {
      const currentEvent = events.find(
        (event) => String(event.id) === String(id),
      );

      if (currentEvent) {
        setCurrentEventId(currentEvent.id);
        const members =
          Array.isArray(inProgressEvent?.event_member) &&
          inProgressEvent.event_member.length > 0
            ? inProgressEvent.event_member
            : currentEvent.members ||
              currentEvent.event_member ||
              [];
        const normalizedMembers = members.map((member) => ({
          ...member,
          image: member.image || member.image_url,
          image_url: member.image_url || member.image,
        }));
        setMembersList(normalizedMembers);

        dispatch(
          setInProgressEvent({
            ...currentEvent,
            ...inProgressEvent,
            event_member: normalizedMembers,
          }),
        );
      }
    }
  }, [events, id, dispatch]);

  // If page reloaded and no inProgressEvent, redirect to edit event
  useEffect(() => {
    if (!inProgressEvent && location.pathname === "/edit-event-members") {
      navigate("/edit-event");
    }
  }, [inProgressEvent, location.pathname, navigate]);

  useEffect(() => {
    const handleDocClick = (e) => {
      const target = e.target;
      if (!target) return;
      if (
        target.closest &&
        (target.closest(".dots-btn") || target.closest(".dropdown-menu"))
      ) {
        return;
      }
      setActiveDropdown(null);
      setActiveRoleDropdown(null);
    };

    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

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
    name: Yup.string().required("Member name is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        "Phone number must be in (123) 456-7890 format",
      ),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    image: Yup.mixed()
      .nullable()
      .test("fileType", "Only PNG, JPG or JPEG allowed", (value) => {
        if (!value || !(value instanceof File)) return true;
        return ["image/png", "image/jpeg", "image/jpg"].includes(value.type);
      }),
  });

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

  const handleSaveMember = async (values, { resetForm, setFieldValue }) => {
    if (editingMemberIndex !== null) {
      const updatedMembers = [...event_member];
      const file = values.image;

      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedMembers[editingMemberIndex] = {
            ...updatedMembers[editingMemberIndex],
            role: values.role,
            name: values.name,
            phone: values.phone,
            email: values.email,
            image: reader.result,
            image_url: reader.result,
            isNewImage: true,
          };

          setMembersList(updatedMembers);
          dispatch(setInProgressEvent({ ...inProgressEvent, event_member: updatedMembers }));
          setImagePreview(null);
          setEditingMemberIndex(null);
          setEditingInitialValues(null);
          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        };
        reader.readAsDataURL(file);
      } else {
        updatedMembers[editingMemberIndex] = {
          ...updatedMembers[editingMemberIndex],
          role: values.role,
          name: values.name,
          phone: values.phone,
          email: values.email,
        };

        setMembersList(updatedMembers);

        dispatch(setInProgressEvent({ ...inProgressEvent, event_member: updatedMembers }));
        setImagePreview(null);
        setEditingMemberIndex(null);
        setEditingInitialValues(null);
        resetForm();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMember = {
          role: values.role,
          name: values.name,
          phone: values.phone,
          email: values.email,
          image: reader.result || "/Images/camera.png",
          isNewMember: true,
        };

        const updatedMembers = [...event_member, newMember];
        setMembersList(updatedMembers);

        dispatch(setInProgressEvent({ ...inProgressEvent, event_member: updatedMembers }));
        setImagePreview(null);
        resetForm();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

      if (values.image instanceof File) {
      reader.readAsDataURL(values.image);
    } else {
      reader.onloadend();
      reader.result = "/Images/camera.png";
      reader.onloadend();
    }
    }
  };

  const handleEditMember = (index) => {
    const member = event_member[index];
    setEditingMemberIndex(index);
    const img = member.image_url || member.image || null;
    setEditingInitialValues({
      role: member.role || "",
      name: member.name || "",
      phone: formatPhoneNumber(member.phone || ""),
      email: member.email || "",
      image: img,
    });
    setImagePreview(img);
  };

  const handleCancelEdit = () => {
    setEditingMemberIndex(null);
    setEditingInitialValues(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveMember = (id, index) => {
    const updatedMembers = event_member.filter((_, i) => i !== index);
    setMembersList(updatedMembers);

    dispatch(setInProgressEvent({ ...inProgressEvent, event_member: updatedMembers }));
    setActiveDropdown(null);
  };

  const handleUpdateEvent = async () => {
    if (!inProgressEvent) return;

    let eventToUpdate = { ...inProgressEvent };

    // Change Event Image base64ToFile
    if (
      eventToUpdate.image &&
      typeof eventToUpdate.image === "string" &&
      eventToUpdate.image.startsWith("data:image/")
    ) {
      eventToUpdate.image = base64ToFile(
        eventToUpdate.image,
        `event-${currentEventId}-image.png`,
      );
    }

    const normalizedMembers = event_member.map((member) => {
      if (
        (member.isNewMember || member.isNewImage) &&
        member.image &&
        typeof member.image === "string" &&
        member.image.startsWith("data:image/")
      ) {
        return {
          ...member,
          image: base64ToFile(
            member.image,
            `member-${member.name}-${Date.now()}.png`,
          ),
        };
      }

      return member;
    });

    const existingMembers = normalizedMembers
      .filter((member) => member.id)
      .map(({ isNewMember, isNewImage, image_url, ...member }) => member);

    const newMembers = normalizedMembers
      .filter((member) => !member.id || member.isNewMember)
      .map(({ id, isNewMember, isNewImage, image_url, ...member }) => {
        const cleanedMember = { ...member };

        // Do not send the local placeholder path as an uploaded image.
        if (
          typeof cleanedMember.image === "string" &&
          cleanedMember.image === "/Images/camera.png"
        ) {
          delete cleanedMember.image;
        }

        return cleanedMember;
      });

    const result = await dispatch(
      updateEvent({
        eventId: currentEventId,
        eventData: {
          ...eventToUpdate,
          event_member: existingMembers,
        },
      }),
    );

    if (!updateEvent.fulfilled.match(result)) {
      Swal.fire("Error", result.payload || "Event update failed", "error");
      return;
    }

    for (const member of newMembers) {
      const addMemberResult = await dispatch(
        addNewMember({
          eventId: currentEventId,
          memberData: member,
        }),
      );

      if (!addNewMember.fulfilled.match(addMemberResult)) {
        Swal.fire(
          "Error",
          addMemberResult.payload || "Member invite could not be sent",
          "error",
        );
        return;
      }
    }

    dispatch(clearInProgressEvent());
    navigate("/events");
  };

  return (
    <>
      {loading && <Loader />}

      <div className="col-md-9 right-column add-member">
        <div className="right-column-content">
          <h2>Edit Event Members</h2>

          <div className="add-member-container container-fluid">
            <div className="row">
              <div className="add-member-form col-md-5">
                <h3>
                  {editingMemberIndex !== null ? "Edit Member" : "Add Member"}
                </h3>

                <Formik
                  key={
                    editingMemberIndex !== null
                      ? `edit-${editingMemberIndex}`
                      : "add"
                  }
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
                  enableReinitialize={true}
                >
                  {({ setFieldValue, values }) => (
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
                          <div className="image-container">
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

                      <div className="member-form-fields">
                        <div className="field">
                          <label>Select Role</label>
                          <div className="select-field product-detail-page">
                            <div className="custom-select-wrapper">
                              <div
                                className="custom-select"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveRoleDropdown(activeRoleDropdown === 'role' ? null : 'role');
                                }}
                              >
                                <span className="selected-value">
                                  {roleOptions.find(opt => opt.value === values.role)?.label || values.role || "Select Role"}
                                </span>
                                <i className="fa-solid fa-chevron-down"></i>
                              </div>

                              {activeRoleDropdown === 'role' && (
                                <ul className="custom-select-dropdown">
                                  {roleOptions.map((option) => (
                                    <li
                                      key={option.value}
                                      className={values.role === option.value ? 'active' : ''}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRoleSelect(option.value, setFieldValue);
                                      }}
                                    >
                                      {option.label}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
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

                        <div style={{ display: "flex", gap: "10px" }}>
                          {editingMemberIndex !== null && (
                            <button
                              type="button"
                              className="designBtn2"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            className="designBtn2"
                            style={{ flex: 1 }}
                          >
                            {editingMemberIndex !== null
                              ? "Update"
                              : "Add Member"}
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
                        <br /> Members Yet
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
                          <div key={index} className="member-row">
                            <div className="member-left">
                              <img
                                src={
                                  brokenImageUrlsRef.current.has(
                                    member.image_url || member.image,
                                  )
                                    ? BROKEN_PLACEHOLDER
                                    : member.image_url ||
                                      member.image ||
                                      BROKEN_PLACEHOLDER
                                }
                                className="member-thumb"
                                alt={member.name}
                                onClick={() => handleEditMember(index)}
                                style={{ cursor: "pointer" }}
                                onError={(e) => {
                                  const failed = e.target.src;
                                  try {
                                    brokenImageUrlsRef.current.add(failed);
                                  } catch (err) {}
                                  e.target.onerror = null;
                                  e.target.src = BROKEN_PLACEHOLDER;
                                }}
                              />
                            </div>

                            <div
                              className="member-center"
                              onClick={() => handleEditMember(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <h4>{member.name}</h4>
                              <p>{member.role}</p>
                            </div>

                            <div className="member-right">
                              <button
                                className="dots-btn"
                                onClick={() =>
                                  setActiveDropdown(
                                    activeDropdown === index ? null : index,
                                  )
                                }
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>

                              {activeDropdown === index && (
                                <div className="dropdown-menu">
                                  <button
                                    className="remove-btn"
                                    onClick={() =>
                                      handleRemoveMember(member.id, index)
                                    }
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
                      navigate(`/edit-event/${currentEventId}`);
                    }}
                  >
                    Back
                  </button>

                  <button className="designBtn2" onClick={handleUpdateEvent}>
                    Update Event
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

export default EditEventMembers;
