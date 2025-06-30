# 🧾 Stripe Integration in React JS (Test + Production)

## 📝 Step 1: Create a Stripe Account
- Go to: https://dashboard.stripe.com/register
- Fill in your email, full name, and set password.
- Click Create Account.
- Verify your email using the verification link sent to your inbox.
- Once logged in, you’ll be in Test Mode : (https://dashboard.stripe.com/test/dashboard)

**You’re now in Test Mode by default .**

## 🧪 Step 2: Test Mode Setup (No real money)
### A. Get your Test API Keys
- In your Stripe dashboard, click Developers from the left menu.
- Go to API Keys.
- Copy the both following:
  - Publishable key (starts with pk_test_)
  - Secret key (starts with sk_test_)

### B. Create a `.env` file
Create a .env file in the root of your backend project folder and paste:

```
STRIPE_SECRET_ID=sk_test_XXXXXXXXXXXXXXXX
REACT_APP_STRIPE_PUBLIC_ID=pk_test_XXXXXXXXXXXXXXXX
```
**Replace with your actual test keys.**

## 🚀 Step 3: Run the Server
Steps:
  - Install Node.js and npm
  - Install dependencies:
  ```
  npm install express cors stripe dotenv
  ```
  - Create a file server.js and write your backend code: For  Example :- [server.js](/server/server.js)
  - add correct .env path if you used
  - The backend has important route:
   - POST /api/create-payment-intent → creates Stripe payment
  - Run the server:
```
node server.js
```

**You’ll see: Server running on http://localhost:PORT**

## 💻 Step 4: Setup Frontend (React JS)
**A. Load Stripe in Frontend**
Install the packages:
```
npm install @stripe/react-stripe-js @stripe/stripe-js
```

App.js
```
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./StripeCheckout";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_ID);  //We can also mannually add the API without .env

function App() {
  const [amount, setAmount] = useState("");

  return (
    <>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={createPaymentIntent}>Create Stripe Intent</button>

      {clientSecret && (
        <Elements stripe={stripePromise} >
          <CheckoutForm setAmount={setAmount} />
        </Elements>
      )}
    </>
  );
}

export default App;
```

- StripeCheckout.js and write your frontend code.
- For Reference:
[StripeCheckout.js](/paymentintegration/src/StripeCheckout.js)

## 💳 Step 5: Test Payments in Frontend

- Run the React frontend 
- Go to: http://localhost:3000
- Enter any test amount 
- Click Create Stripe Intent
- Fill in the card form using this test card:
```
Card Number: 4242 4242 4242 4242
MM/YY: Any future date
CVC: Any 3 digits
```
**View more test cards: https://stripe.com/docs/testing**
- Click Pay Now
- You’ll see a success message and be redirected

## 💼 Step 6: Switch to Live Mode (Real Payments)
**Only do this when you're ready to accept real money from customers.**
### A. Activate Stripe Account
- Go to: https://dashboard.stripe.com/settings/account
- Click Activate Account
- Fill in:
    - Business details (can be individual or business)
    - Bank account for payouts
    - Phone and email verification
    - Website or product/service description

**Once completed, your Stripe account will be reviewed. After approval, you can process real payments.**

### B. Get Live API Keys
- Go to Developers → API Keys
- Toggle Test Mode OFF(top-left corner of dashboard)
- Copy:
    - Live Publishable key (pk_live_...)
    - Live Secret key (sk_live_...)

### C. Update .env Files
In your backend .env, replace test keys with live ones:
```
STRIPE_SECRET_ID=sk_live_XXXXXXXXXXXXXXXX
REACT_APP_STRIPE_PUBLIC_ID=pk_live_XXXXXXXXXXXXXXXX
```
**⚠️ After making changes to .env, restart your backend server and frontend app.**

**⚠️ Security Notes**
- Never expose `sk_test_` or `sk_live_` keys in frontend code.
- These secret keys must only exist in the backend.
- Always store .env in .gitignore to avoid uploading them to GitHub or any public repo.
- Always use HTTPS when deploying to production.