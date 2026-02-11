import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../components/Loader";
import { useNavigate, Link } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearAuthState,
} from "../Redux/Reducers/authSlice";

const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
  acceptTerms: Yup.boolean().oneOf([true], "Please accept terms & conditions"),
});

const RightColumn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (registerSuccess) {
      dispatch(clearAuthState());
      navigate("/verify-otp");
    }
  }, [registerSuccess, navigate, dispatch]);

  const renderApiError = () => {
    if (!error) return null;

    if (error.errors) {
      return Object.values(error.errors).map((errArr, index) => (
        <div key={index}>{errArr[0]}</div>
      ));
    }

    if (error.message) {
      return <div>{error.message}</div>;
    }

    return null;
  };

  return (
    <>
      {loading && <Loader />}

      <div className="right-form-column col-md-6" data-aos="fade-left">
        <div className="logo">
          <img src="/Images/blackLogo.png" alt="Logo" />
        </div>

        <div className="box">
          <h2>Register Now</h2>

          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              email: "",
              password: "",
              password_confirmation: "",
              acceptTerms: false,
            }}
            validationSchema={RegisterSchema}
            onSubmit={(values) => {
              const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                password: values.password,
                password_confirmation: values.password_confirmation,
              };

              dispatch(registerUser(payload));
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="input-group">
                  <div className="input-field">
                    <label>First Name</label>
                    <Field
                      className="input"
                      type="text"
                      name="first_name"
                      placeholder="Enter first name"
                    />
                    <small className="text-danger">
                      <ErrorMessage name="first_name" />
                    </small>
                  </div>

                  <div className="input-field">
                    <label>Last Name</label>
                    <Field
                      className="input"
                      type="text"
                      name="last_name"
                      placeholder="Enter last name"
                    />
                    <small className="text-danger">
                      <ErrorMessage name="last_name" />
                    </small>
                  </div>
                </div>

                <div className="input-field">
                  <label>Email Address</label>
                  <Field
                    className="input"
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                  />
                  <small className="text-danger">
                    <ErrorMessage name="email" />
                  </small>
                </div>

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

                <div className="checkbox">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={values.acceptTerms}
                    onChange={(e) =>
                      setFieldValue("acceptTerms", e.target.checked)
                    }
                  />
                  <label htmlFor="acceptTerms">
                    By creating an account on SuitSync, you agree to the Terms &
                    Conditions and Privacy Policy
                  </label>
                </div>

                <small className="text-danger">
                  <ErrorMessage name="acceptTerms" />
                </small>

                {error && (
                  <div className="mt-2 text-danger">{renderApiError()}</div>
                )}

                <button type="submit" className="designBtn2" disabled={loading}>
                  {loading ? "Loading..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="auth-link">
          <p>
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RightColumn;