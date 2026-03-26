import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../Redux/Reducers/authSlice";

import Loader from "../components/Loader";

const OtpSchema = Yup.object().shape({
  token: Yup.string()
    .required("OTP is required")
    .min(4, "OTP must be at least 4 digits"),
});

const VerifyCodeForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, forgetEmail } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

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
          <h2>Verify Code</h2>
          <p>Verify code which is sent to your email address</p>

          <Formik
            initialValues={{
              token: "",
            }}
            validationSchema={OtpSchema}
            onSubmit={(values) => {
              const payload = {
                email: forgetEmail,
                token: values.token,
              };

              dispatch(verifyToken(payload))
                .unwrap()
                .then(() => {
                  navigate("/reset-password");
                })
                .catch(() => {});
            }}
          >
            {() => (
              <Form>
                <div className="input-field">
                  <Field
                    className="input"
                    type="text"
                    name="token"
                    placeholder="Enter OTP"
                  />

                  <small className="text-danger">
                    <ErrorMessage name="token" />
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
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="auth-link">
          <p>
            Don’t get a code <a href="#">Send Again</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default VerifyCodeForm;