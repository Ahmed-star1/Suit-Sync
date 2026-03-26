import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../Redux/Reducers/authSlice";

import Loader from "../components/Loader";

const ForgetSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

const ForgetPasswordForm = () => {
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

      <div className="right-form-column col-md-6" data-aos="fade-left">
        <div className="logo">
          <Link to="/">
            <img src="/Images/blackLogo.png" alt="Logo" />
          </Link>
        </div>

        <div className="box">
          <h2>Forget Password</h2>

          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={ForgetSchema}
            onSubmit={(values) => {
              dispatch(forgetPassword(values))
                .unwrap()
                .then(() => {
                  navigate("/verify-code");
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
                  {loading ? "Sending..." : "Send"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordForm;