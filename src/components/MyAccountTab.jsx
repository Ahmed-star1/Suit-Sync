import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import {
  updateUserProfile,
  getUserProfile,
} from "../Redux/Reducers/authSlice";

import Loader from "../components/Loader";

const MyAccountTab = () => {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      profile_image: null,
    },

    onSubmit: async (values) => {
      if (!isEdited) return;

      const formData = new FormData();

      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);

      if (values.password) {
        formData.append("password", values.password);
        formData.append("password_confirmation", values.password);
      }

      if (values.profile_image) {
        formData.append("image", values.profile_image);
      }

      try {
        const result = await dispatch(updateUserProfile(formData)).unwrap();

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
          confirmButtonColor: "#000",
        });

        setIsEdited(false);
        setImageError(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text:
            typeof error === "string"
              ? error
              : "Something went wrong. Please try again.",
          confirmButtonColor: "#000",
        });
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        profile_image: null,
      });

      // ✅ Image URL set karo, error flag reset karo
      if (user.image_url) {
        setImagePreview(user.image_url);
        setImageError(false);
      }
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    formik.setFieldValue("profile_image", file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setIsEdited(true);
    setImageError(false);
  };

  const handleInputChange = (e) => {
    formik.handleChange(e);
    setIsEdited(true);
  };

  // ✅ Image error handle karne ka function
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      {loading && <Loader />}

      <div className="col-md-9 right-column my-account">
        <div className="right-column-content">
          <h2>My Profile</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="profile-info">
              <div className="profile-image">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <div
                  className="placeholder-box"
                  onClick={() => fileInputRef.current.click()}
                >
                  {/* ✅ Image show karne ke liye img tag use karo */}
                  {imagePreview && !imageError ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "inherit",
                      }}
                      onError={handleImageError}
                    />
                  ) : (
                    <FaPlus />
                  )}
                </div>
              </div>

              <div className="profile-form">
                <div className="row">
                  <div className="input-group">
                    <label>First Name</label>
                    <input
                      className="input"
                      name="first_name"
                      value={formik.values.first_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Last Name</label>
                    <input
                      className="input"
                      name="last_name"
                      value={formik.values.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="input-group">
                    <label>Email Address</label>
                    <input
                      className="input"
                      name="email"
                      value={formik.values.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="input-group password-field">
                    <label>Password</label>
                    <input
                      className="input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={handleInputChange}
                    />
                    <span
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="designBtn2"
              disabled={!isEdited || loading}
              style={{
                backgroundColor: !isEdited || loading ? "#666" : undefined,
                opacity: !isEdited || loading ? 0.9 : 1,
                cursor: !isEdited || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MyAccountTab;