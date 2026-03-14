import React, { useEffect } from "react";
import Loader from "../components/Loader";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../Redux/Reducers/authSlice";

const OtpSchema = Yup.object().shape({
  otp: Yup.number()
    .typeError("OTP must be a number")
    .required("OTP is required"),
});

const VerifyOtpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, registeredEmail } = useSelector((state) => state.auth);
  
  const emailFromStorage = localStorage.getItem("registeredEmail");
  const emailToUse = registeredEmail || emailFromStorage;

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

  useEffect(() => {
    if (!emailToUse) {
      navigate("/register");
    }
  }, [emailToUse, navigate]);

  const handleVerifySuccess = () => {
    localStorage.removeItem("registeredEmail");
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } else {
      navigate("/my-account");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="right-form-column col-md-6" data-aos="fade-left">
        <div className="logo">
          <img src="/Images/blackLogo.png" alt="Logo" />
        </div>

        <div className="box">
          <h2>Verify Code</h2>
          <p>Verify code which is sent to your email address</p>
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={OtpSchema}
            onSubmit={(values) => {
              const payload = {
                email: emailToUse, 
                otp: Number(values.otp),
              };

              dispatch(verifyOtp(payload))
                .unwrap()
                .then(() => {
                  localStorage.removeItem("registeredEmail");
                  handleVerifySuccess();
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
                    name="otp"
                    placeholder="Enter OTP"
                  />

                  <small className="text-danger">
                    <ErrorMessage name="otp" />
                  </small>
                </div>

                {error && (
                  <div className="mt-2 text-danger">{renderApiError()}</div>
                )}

                <button type="submit" className="designBtn2" disabled={loading}>
                  {loading ? "Loading..." : "Verify"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default VerifyOtpForm;