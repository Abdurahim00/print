# Stripe Payment Setup

## Current Issue
The application is showing "Payment service not configured" because Stripe environment variables are missing.

## How to Fix

### 1. Get Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign up or log in to your Stripe account
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

### 2. Add to Environment File
Add these lines to your `.env.local` file:

```bash
# Stripe configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
```

### 3. Restart Development Server
After adding the keys, restart your development server:
```bash
npm run dev
```

## Test Mode
- Use test keys (starting with `pk_test_` and `sk_test_`) for development
- Test card numbers: `4242 4242 4242 4242`
- Any future expiry date and any 3-digit CVC

## Production
- Replace test keys with live keys for production
- Update `NEXTAUTH_URL` to your production domain

## Current Status
✅ Stripe initialization error fixed
✅ Payment modal shows proper error message when not configured
✅ Ready to work once environment variables are added