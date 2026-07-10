import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { submitContactUs } from "../Redux/Reducers/authSlice";

const ContactSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
});

const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const ContactSection = () => {
  const dispatch = useDispatch();
  const { contactLoading, contactError } = useSelector((state) => state.auth);

  return (
    <section className="contact-wrapper" data-aos="fade-up">
      <div className="container text-center">
        <h2>HAVE QUESTIONS? LET’S CONNECT.</h2>

        <p>
          Need help
          keeping your wedding party in sync? Our support team is here for everything
          from event setup and party management to suit sizing, ordering, and delivery
          questions.
        </p>

        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            message: "",
          }}
          validationSchema={ContactSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await dispatch(submitContactUs(values)).unwrap();
              resetForm();
              Swal.fire("Success", "Your message has been sent successfully.", "success");
            } catch (error) {
              Swal.fire("Error", error?.message || "Unable to send your message.", "error");
            }
          }}
        >
          {({ setFieldValue }) => (
          <Form className="contact-form">
            <div className="input-row">
              <div className="input-column">
                <Field type="text" name="first_name" placeholder="First Name" style={{ width: "100%" }} />
                <small className="text-danger"><ErrorMessage name="first_name" /></small>
              </div>
              <div className="input-column">
                <Field type="text" name="last_name" placeholder="Last Name" style={{ width: "100%" }} />
                <small className="text-danger"><ErrorMessage name="last_name" /></small>
              </div>
              <div className="input-column">
                <Field
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  inputMode="numeric"
                  maxLength={14}
                  style={{ width: "100%" }}
                  onChange={(event) => setFieldValue("phone", formatPhoneNumber(event.target.value))}
                />
                <small className="text-danger"><ErrorMessage name="phone" /></small>
              </div>
              <div className="input-column">
                <Field type="email" name="email" placeholder="Email" style={{ width: "100%" }} />
                <small className="text-danger"><ErrorMessage name="email" /></small>
              </div>
            </div>

            <Field as="textarea" name="message" placeholder="Write message here..." />
            <small className="text-danger"><ErrorMessage name="message" /></small>

            {contactError?.message && (
              <div className="text-danger">{contactError.message}</div>
            )}

            <button type="submit" className="designBtn" disabled={contactLoading}>
              {contactLoading ? "Submitting..." : "Submit"}
            </button>
          </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default ContactSection;
