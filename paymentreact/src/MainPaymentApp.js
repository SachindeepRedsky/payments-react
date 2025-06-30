import React, { useState } from "react";
import RazorpayCheckout from "./RazorpayCheckout";
import CheckoutForm from "./StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";// Import Elements from Stripe to wrap the checkout form
import { loadStripe } from "@stripe/stripe-js";// Import loadStripe to initialize Stripe with the public 

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_ID)// Load Stripe with the public key from environment variables

function MainPaymentApp() {// Main component for the payment application
    const [amount,   setClear] = useState("");// State to hold the amount entered by the user
    const [clientSecret, setClientSecret] = useState(null);// State to hold the client secret for Stripe payment intent
    const [loadingIntent, setLoadingIntent] = useState(false);// State to manage loading state while creating the payment intent

    const createPaymentIntent = async () => { // Function to create a payment intent with Stripe
        const validAmount = parseFloat(amount)
        // Validate the amount entered by the user
        if (!validAmount || validAmount <= 0) {
            alert("Please enter a valid amount")
            return;
        }

        setLoadingIntent(true);
// Make a POST request to the backend to create a payment intent
        try {
            const res = await fetch("http://localhost:5000/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Math.round(validAmount * 100) }),
            });

            const data = await res.json()
            // Check if the response contains a clientSecret
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                alert("Failed to get clientSecret from backend.");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating payment intent.");
        }

        setLoadingIntent(false);
    };

    const appearance = { theme: "stripe" };// Define the appearance options for Stripe Elements
    const options = { clientSecret, appearance };// Options to pass to the Elements provider

    return (
        <div className="App" style={{ textAlign: "center", marginTop: 50 }}>
            <h2>Enter Amount</h2>
            {/* Input field for the user to enter the amount they want to pay */}
            <input
                type="numeric"
                value={amount}
                onChange={(e) => {
                      setClear(e.target.value);
                    setClientSecret(null);
                }}
                placeholder="Enter amount"
                style={{ padding: 10, fontSize: 16, marginBottom: 10, width: 200 }}
            />
            <br />
            
            <h2>Razorpay Payment</h2>
            <RazorpayCheckout amount={amount}   setClear={  setClear} />

            <h2>Stripe Payment</h2>
            {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm   setClear={setClear} />
                </Elements>
            ) : (
                <button
                    onClick={createPaymentIntent}
                    style={{

                        padding: "10px 20px",
                        backgroundColor: "#6772e5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        width: "25%",
                        fontSize: 16,
                    }}
                >
                    {loadingIntent ? "Creating PaymentIntent..." : "Create Stripe Intent"}
                </button>
            )}
        </div>
    );
}

export default MainPaymentApp;
