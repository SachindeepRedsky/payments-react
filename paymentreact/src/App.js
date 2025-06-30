import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPaymentApp from "./MainPaymentApp";
import Success from "./Success";
import { Elements } from "@stripe/react-stripe-js";// Import Elements from Stripe to wrap the checkout form
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_ID)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPaymentApp />} />
        <Route
          path="/success"
          element={
            <Elements stripe={stripePromise}>
              <Success />
            </Elements>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
