import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  getUserProfile,
  updateUserProfile,
} from "../Redux/Reducers/authSlice";
import Loader from "../components/Loader";

const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  const renderApiError = () => {
    if (!error) return null;

    if (error.errors) {
      return Object.values(error.errors).map((errArr, index) => (
        <div key={index}>{errArr[0]}</div>
      ));
    }

    return <div>{error.message || "Something went wrong. Please try again."}</div>;
  };

  return (
    <>
      {loading && <Loader />}

      <div className="col-md-9 right-column my-account change-password-page">
        <div className="right-column-content">
          <h2>Change Password</h2>

          <Formik
            initialValues={{
              password: "",
              password_confirmation: "",
            }}
            validationSchema={ChangePasswordSchema}
            onSubmit={async (values, { resetForm }) => {
              const formData = new FormData();
              formData.append("password", values.password);
              formData.append(
                "password_confirmation",
                values.password_confirmation
              );

              try {
                await dispatch(updateUserProfile(formData)).unwrap();

                Swal.fire({
                  icon: "success",
                  title: "Password Updated",
                  text: "Your password has been updated successfully.",
                  confirmButtonColor: "#000",
                });

                resetForm();
                navigate("/my-account");
              } catch (submitError) {
                Swal.fire({
                  icon: "error",
                  title: "Update Failed",
                  text:
                    submitError?.message ||
                    submitError?.error ||
                    "Something went wrong. Please try again.",
                  confirmButtonColor: "#000",
                });
              }
            }}
          >
            {() => (
              <Form className="change-password-form">
                <div className="change-password-fields row">
                  <div className="input-group password-field">
                    <label>Password</label>
                    <Field
                      className="input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                    />
                    <span
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    <small className="text-danger">
                      <ErrorMessage name="password" />
                    </small>
                  </div>
                  <div className="input-group password-field">
                    <label>Confirm Password</label>
                    <Field
                      className="input"
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      placeholder="Confirm password"
                    />
                    <span
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    <small className="text-danger">
                      <ErrorMessage name="password_confirmation" />
                    </small>
                  </div>
                </div>

                {error && (
                  <div className="change-password-error text-danger">
                    {renderApiError()}
                  </div>
                )}

                <button
                  type="submit"
                  className="designBtn2"
                  disabled={loading || !user}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
