import React, { useState } from "react";
import { useStripe, useElements, PaymentElement, AddressElement, LinkAuthenticationElement, PaymentRequestButtonElement, ExpressCheckoutElement } from "@stripe/react-stripe-js";// Import necessary hooks and components from Stripe
import { useNavigate } from "react-router-dom";// Import useNavigate from react-router-dom for navigation

const CheckoutForm = ({ setClear }) => {// Define the CheckoutForm component
  const stripe = useStripe()// Get the Stripe instance using useStripe hook
  const elements = useElements();// Get the Elements instance using useElements hook
  const [loading, setLoading] = useState(false);// Initialize loading state to manage the button state during payment processing

  const navigate = useNavigate()// Initialize useNavigate for navigation after payment success
// Function to handle form submission and payment processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return; // Check if Stripe and Elements are loaded before proceeding

    setLoading(true)
    const result = await stripe.confirmPayment({// Call confirmPayment to process the payment
      elements,// Pass the Elements instance to confirmPayment
      confirmParams: {// Set the parameters for confirmation
        return_url:"http://localhost:3000/success"// Set the return URL to redirect after payment confirmation
      }, 
      redirect: "if_required",// Redirect if required
    })
// Handle the result of the payment confirmation
    if (result.error) {
      alert("Payment Failed")
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      setClear("");
      alert("Payment Successfull")
      navigate(0)
    }
    setLoading(false)

  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#fff",
      }}
    >
      <PaymentElement /> {/* Render the PaymentElement component to handle payment details input */}

      {/* Optional payment method used*/}
      {/* <AddressElement options={{ mode: "billing" }} /> 
      <LinkAuthenticationElement /> 
      <ExpressCheckoutElement/> */}

      {/* 
| Element                         |     How to Use                                                         |     Currency                        |     Region                    |     Payment Method                |     Test Mode |      KYC Required        |
| ------------------------------- | ---------------------------------------------------------------------- | ----------------------------------- | ----------------------------- | --------------------------------- | ------------- | ------------------------ |
| `CardElement`                   | `<CardElement />` inside `Elements` provider                           | Most major currencies               | Global                        | `card`                            |    Yes        |   No                     |
| `CardNumberElement`             | `<CardNumberElement />` + separate expiry & CVC                        | Most major currencies               | Global                        | `card`                            |    Yes        |   No                     |
| `CardExpiryElement`             | `<CardExpiryElement />`                                                | Most major currencies               | Global                        | `card`                            |    Yes        |   No                     |
| `CardCvcElement`                | `<CardCvcElement />`                                                   | Most major currencies               | Global                        | `card`                            |    Yes        |   No                     |
| `IdealBankElement`              | `<IdealBankElement />`                                                 | `eur`                               | Netherlands                   | `ideal`                           |    Yes        |   Yes (to go live)       |
| `FpxBankElement`                | `<FpxBankElement />`                                                   | `myr`                               | Malaysia                      | `fpx`                             |    Yes        |   Yes                    |
| `PaymentRequestButtonElement`   | `<PaymentRequestButtonElement />` (requires Payment Request API setup) | Most major currencies               | Global (Apple Pay/Google Pay) | Apple Pay, Google Pay             |    Yes        |   Yes (for some regions) |
| `LinkAuthenticationElement`     | `<LinkAuthenticationElement />` inside form                            | `usd`, `eur`, `gbp`, `cad`          | US, CA, UK, EU                | `link`                            |    Yes        |   Yes (to go live)       |
| `AddressElement`                | `<AddressElement />` (billing or shipping address collection)          | N/A (used for address, not payment) | Global                        | N/A (supporting element)          |    Yes        |   No                     |
| `PaymentMethodMessagingElement` | `<PaymentMethodMessagingElement />`                                    | `usd`, `eur`, etc.                  | US, UK, CA, EU                | Klarna, Affirm, Afterpay          |    Yes        |   Yes                    |
| `ExpressCheckoutElement`        | `<ExpressCheckoutElement />`                                           | Based on available express methods  | Global                        | Apple Pay, Google Pay, Link, etc. |    Yes        |   Yes (region dependent) |
*/}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#6772e5",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          width: "100%",
          fontSize: 16,
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;



