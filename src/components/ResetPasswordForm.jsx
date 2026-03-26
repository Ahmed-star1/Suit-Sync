import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../Redux/Reducers/authSlice";

import Loader from "../components/Loader";

const ResetSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, forgetEmail } = useSelector(
    (state) => state.auth
  );

  const renderApiError = () => {
    if (!error) return null;

    if (error.errors) {
      return Object.values(error.errors).map((errArr, index) => (
        <div key={index}>{errArr[0]}</div>
      ));
    }

    return <div>{error.message}</div>;
  };

  return (
    <>
      {loading && <Loader />}

      <div className="right-form-column col-md-6" data-aos="fade-left">
        <div className="logo">
          <Link to="/">
            <img src="/Images/blackLogo.png" alt="Logo" />
          </Link>
        </div>

        <div className="box">
          <h2>New Password</h2>

          <Formik
            initialValues={{
              password: "",
              password_confirmation: "",
            }}
            validationSchema={ResetSchema}
            onSubmit={(values) => {
              const payload = {
                email: forgetEmail,
                password: values.password,
                password_confirmation: values.password_confirmation,
              };

              dispatch(resetPassword(payload))
                .unwrap()
                .then(() => {
                  navigate("/login");
                })
                .catch(() => {});
            }}
          >
            {() => (
              <Form>
                <div className="input-field password-field">
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

                <div className="input-field password-field">
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

                {error && (
                  <div className="mt-2 text-danger">
                    {renderApiError()}
                  </div>
                )}

                <button
                  type="submit"
                  className="designBtn2"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordForm;