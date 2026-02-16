import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/Reducers/authSlice";
import Loader from "../components/Loader";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

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

      <div className="right-form-column col-md-6 login" data-aos="fade-left">
        <div className="logo">
          <img src="/Images/blackLogo.png" alt="Logo" />
        </div>

        <div className="box">
          <h2>Login to Your Account</h2>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              dispatch(loginUser(values))
                .unwrap()
                .then(() => {
                  navigate("/my-account");
                })
                .catch(() => {});
            }}
          >
            {() => (
              <Form>
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
                  {error && (
                    <div className="mt-2 text-danger">{renderApiError()}</div>
                  )}
                </div>

                <div className="row">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="rememberMe">Remember Me</label>
                  </div>
                  <div className="forget">
                    <Link to="/forget-password">Forgot Password</Link>
                  </div>
                </div>

                <button type="submit" className="designBtn2" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="auth-link">
          <p>
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
