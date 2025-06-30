const RazorpayCheckout = ({ amount, setClear }) => {
  // Function to load Razorpay SDK and create an order
  const loadRazorpay = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }
// Convert amount to a number and ensure it's in the correct format
    const res = await fetch("http://localhost:5000/api/order", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },// Set the content type to JSON
      body: JSON.stringify({ amount }),// Send the amount to the server
    });

    const orderData = await res.json();// Parse the response from the server

    if (!orderData?.id) {// Check if the order ID is present in the response
      alert("Failed to create Razorpay order");
      return;
    }
// Dynamically load the Razorpay SDK script
    const script = document.createElement("script");// Create a script element
    script.src = "https://checkout.razorpay.com/v1/checkout.js";// Set the source of the script to Razorpay's checkout script
    script.onerror = () => alert("Razorpay SDK failed to load.");// Handle script loading errors
    script.onload = () => openRazorpay(orderData);// Call openRazorpay when the script is loaded successfully
    document.body.appendChild(script);// Append the script to the document body to load it
  };
// Function to open the Razorpay payment modal
  const openRazorpay = (orderData) => {
    // Create options for Razorpay payment
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,// Use the Razorpay key ID from environment variables
      amount: orderData.amount, // Set the amount from the order data
      currency: "INR",// Set the currency 
      name: "Redsky Advance Solution",// Set the name of the business
      description: "Test Transaction",// Set the description of the transaction
      image:"Image",// Set the image URL for the business 
      order_id: orderData.id,// Use the order ID from the server response
      handler: async function (response) {// Handle the payment response
        const verifyRes = await fetch("http://localhost:5000/api/verify", {// Send the payment details to the server for verification
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({// Send the payment details to the server
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
// Parse the response from the server
        const verifyData = await verifyRes.json()
// Check if the payment verification was successful
        if (verifyData.success) {
          setClear("")
          alert("Payment verified successfully!")
        } else {
          alert("Payment verification failed.");
        }
      },
      // Pre-fill customer details Optional
      theme: {// Set the theme for the Razorpay payment modal
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);// Create a new Razorpay instance with the options
    rzp.open();
  };

  return (
    // Render the Razorpay checkout button
    <button
      onClick={loadRazorpay}
      style={{
        padding: "10px 20px",
        fontSize: 18,
        backgroundColor: "#3399cc",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      Pay ₹{amount || 0} via Razorpay
    </button>
  );
};

export default RazorpayCheckout;
