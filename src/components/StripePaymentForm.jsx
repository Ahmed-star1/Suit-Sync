import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const StripePaymentForm = forwardRef((_, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  useImperativeHandle(ref, () => ({
    createPaymentMethod: async (billingDetails) => {
      if (!stripe || !elements) {
        throw new Error("Stripe card form is still loading.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Stripe card form is still loading.");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        throw new Error(error.message || "Unable to create payment method.");
      }

      return paymentMethod;
    },
  }));

  return (
    <div className="stripe-payment-element">
      <div className="stripe-card-heading">
        <span>Card information</span>
        <span className="stripe-card-brand">Stripe</span>
      </div>

      <div className="stripe-card-fields">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: "#1f1f1f",
                fontSize: "16px",
                "::placeholder": {
                  color: "#8a8a8a",
                },
              },
              invalid: {
                color: "#a52828",
              },
            },
          }}
          onChange={(event) => setCardError(event.error?.message || "")}
        />
      </div>

      {cardError && <div className="payment-message error">{cardError}</div>}

    </div>
  );
});

StripePaymentForm.displayName = "StripePaymentForm";

export default StripePaymentForm;
