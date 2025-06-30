import express from "express"; // Importing express for creating the server
import Razorpay from "razorpay";// Importing Razorpay for payment processing
import crypto from "crypto";// Importing crypto for signature verification
import cors from "cors";// Importing cors for handling cross-origin requests
import Stripe from "stripe";// Importing Stripe for payment processing
import dotenv from "dotenv"// Importing dotenv for environment variable management

dotenv.config({ path: "../.env" });// Load environment variables from .env file

const app = express();// Create an instance of express
app.use(cors());// Use CORS to allow cross-origin requests
app.use(express.json());// Use express.json() to parse JSON request bodies

const razorpay = new Razorpay({
  // Initialize Razorpay with key ID and secret from environment variables
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});
// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_ID);

// Endpoint to create a Razorpay order
app.post("/api/order", async (req, res) => {
  try {
    // Extract amount from request body and convert it to a number
    let { amount } = req.body;
    amount = parseFloat(amount);

    // Validate the amount
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    // Create an order with Razorpay
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);// Create a new order in Razorpay
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

// Endpoint to verify Razorpay payment signature
app.post("/api/verify", (req, res) => {
  // Verify the payment signature using Razorpay's HMAC
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
  // Create a signature string by concatenating order ID and payment ID
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_ID)
      .update(sign)
      .digest("hex");
// Compare the expected signature with the received signature
    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Endpoint to create a Stripe payment intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = Math.round(parseFloat(amount));

    if (!parsedAmount || isNaN(parsedAmount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parsedAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
// Return the client secret to the client
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
