# 🧾Razorpay Integration in React JS (Test + Production)

## 🔐 Step 1: Create Razorpay Account

1. Go to https://razorpay.com/
2. Click on Sign Up
3. Enter Email and Verify your Email by using OTP
4. Set Password
5. Select Your region
6. Enter Your 'Full Name'
7. Enter Your 'Mobile Number' And Verify by OTP 
8. Enter 'Business Type' (like Individual, NGO)

After these steps, you'll land on the Razorpay Dashboard: (https://dashboard.razorpay.com/app/dashboard)

## 🧪 Step 2: Enable Test Mode (For Testing)
You can test payments without real money using test card details.

1. Go to Account & Settings -> Website and App Settings -> API keys
2. Click on Generate keys
3. After Genrating they show two keys (Key_id,secret_key) 
4. Save the Key ID and Secret Key somewhere safe. ***The secret will not be visible again***.

## 💳 Step 3: Switch to Production (Live Mode)
Only do this when you're ready to accept real payments.

1. Go to Dashboard
2. Click on the “Go Live” button
3. Fill in your Business Details, Bank Info, and Documents
4. After approval, your project will switch to Live Mode, and you can start accepting real payments

## Recommended Project Structure

```
your-project/
├── backend/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── RazorpayCheckout.js
│   ├── App.js
│   └── .env
```

## ⚙️ Step 4: Setup Environment Variables
Create a .env file in the backend project folder:
```
REACT_APP_RAZORPAY_KEY_ID= ...
RAZORPAY_SECRET_ID= ...
```

## 🚀 Step 5: Setup Backend (server.js)
This is a simple Express server to create and verify Razorpay orders.

Steps:
  - Install Node.js and npm
  - Install dependencies:
    ``` npm install express razorpay crypto cors stripe dotenv ```
  - Create a file server.js and write your backend code: For Example :- [server.js](/server/server.js)
  - add correct .env path if you used
  - The backend has two important routes:
    - POST /api/order → creates Razorpay order
    - POST /api/verify → verifies the payment signature
  - Run the server:
    `node server.js`
  - Server should run on `http://localhost:PORT` 

## 💻 Step 6: Setup Frontend (React JS)
- In your React app:
- Create a .env file and add:
- `REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx`
- **Note: ⚠️ After creating or updating .env, you must restart the React app:
    `npm start`**

## 🧩 Step 6.1: Create RazorpayCheckout Component

- RazorpayCheckout.js and write your frontend code.
  - For Reference:[RazorpayCheckout.js](/paymentreact/src/RazorpayCheckout.js)

## 💳 Step 6.2: Test Payments in Frontend
- Fill in the card form using this test card:
```
Card Number: 4386 2894 0766 0153
MM/YY: Any future date
CVC: Any 3 digits
```
**View more test cards: https://razorpay.com/docs/payments/payments/test-card-details/**

**View more test UPI: https://razorpay.com/docs/payments/payments/test-upi-details/** 

## 🔁 Step 7: Verify Payment
The backend /api/verify route checks if the payment signature is valid.
- If yes:
    - Shows alert: "Payment verified successfully"
- If not:
    - Shows alert: "Payment verification failed"
- **Note: ⚠️ If verification fails, check if the backend secret key matches the frontend key used in Razorpay script.**

## 📊 Show All Transactions
To view all transactions, go to:
- Dashboard → Transactions → Payments
- Or visit: https://dashboard.razorpay.com/app/payments
`
## 🌐 Step 8: Going Live
When you're ready:
- Replace all test keys with live ones:
- In .env (backend): RAZORPAY_SECRET_ID = rzp_live_...
- In .env (frontend): REACT_APP_RAZORPAY_KEY_ID = rzp_live_...

**Note ⚠️:**
- **Make sure you're using HTTPS in production.**
- **Remind users to replace both frontend & backend keys**

## 🔐 Security Note
- Never expose `RAZORPAY_SECRET_ID` in your frontend code.
- The secret key should only exist on the server (backend).
- Make sure `.env` files are listed in `.gitignore`.