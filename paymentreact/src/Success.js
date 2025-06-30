import React, { useEffect} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainPaymentApp from "./MainPaymentApp"

const Success = () => {
  const [searchParams] = useSearchParams()// Use useSearchParams to get the query parameters from the URL
  
  const navigate = useNavigate()// Use useNavigate to programmatically navigate to different routes

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");// Get the redirect status from the query parameters
    if (redirectStatus === "succeeded") {// Check if the redirect status is "succeeded"
      alert("Payment succeeded!");
    } else if (redirectStatus === "failed") {
      alert("Payment failed.");
    } else {
      alert("Unknown payment status.")
    }

    const timeout = setTimeout(() => {
      navigate("/");
    }, 10);

    return () => clearTimeout(timeout)
  }, [searchParams, navigate]);

  return (
    <div>
      <MainPaymentApp/>
    </div>
  );
};

export default Success;
