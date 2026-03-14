import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { addNewMember } from "../Redux/Reducers/eventSlice";

const AddNewMember = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const { loading } = useSelector((state) => state.events);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const roleOptions = [
    { value: "groomsmen", label: "Groomsmen" },
    { value: "best_man", label: "Best Man" },
  ];

  useEffect(() => {
    if (!eventId) {
      Swal.fire(
        "Error",
        "Event ID missing. Please select an event first.",
        "error"
      );
      navigate(-1);
    }
  }, [eventId, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    role: Yup.string().required("Role is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    image: Yup.mixed()
      .required("Image is required")
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

  const handleDropdownClick = (dropdownName, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleRoleSelect = (value, setFieldValue) => {
    setFieldValue("role", value);
    setActiveDropdown(null);
  };

  return (
    <div className="col-md-9 right-column add-new-member">
      <div className="right-column-content">
        <h2>Add New Member</h2>

        <Formik
          initialValues={{
            name: "",
            role: "",
            email: "",
            phone: "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const result = await dispatch(
              addNewMember({
                eventId, 
                memberData: values,
              })
            );

            if (addNewMember.fulfilled.match(result)) {
              Swal.fire("Success", "Member added successfully", "success");
              resetForm();
              setImagePreview(null);
            } else {
              Swal.fire(
                "Error",
                result.payload || "Failed to add member",
                "error"
              );
            }
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="profile-info">
                <div className="profile-image">
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

                  <div
                    className="placeholder-box"
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      border: "none",
                      cursor: "pointer",
                      backgroundImage: imagePreview
                        ? `url(${imagePreview})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!imagePreview && <FaPlus />}
                  </div>

                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="profile-form">
                  <div className="row">
                    <div className="input-group">
                      <label>Name</label>
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

                    <div className="input-group select-field product-detail-page">
                      <label>Role</label>
                      <div className="custom-select-wrapper">
                        <div
                          className="custom-select"
                          onClick={(e) => handleDropdownClick('role', e)}
                        >
                          <span className="selected-value">
                            {values.role 
                              ? roleOptions.find(r => r.value === values.role)?.label || values.role 
                              : "Select Role"}
                          </span>
                          <i className="fa-solid fa-chevron-down"></i>
                        </div>

                        {activeDropdown === 'role' && (
                          <ul className="custom-select-dropdown">
                            {roleOptions.map((role, index) => (
                              <li
                                key={index}
                                className={values.role === role.value ? 'active' : ''}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRoleSelect(role.value, setFieldValue);
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
                  </div>

                  <div className="row">
                    <div className="input-group">
                      <label>Email Address</label>
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

                    <div className="input-group">
                      <label>Phone Number</label>
                      <Field
                        className="input"
                        type="tel"
                        name="phone"
                        placeholder="000-000-0000"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="buttons-row">
                <button
                  className="designBtn2"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>

                <button
                  className="designBtn2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddNewMember;