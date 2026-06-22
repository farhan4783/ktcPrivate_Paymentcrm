# Setup & Environment Configuration Guide

This guide provides detailed, step-by-step instructions on how to get the required keys and configure the `.env` files for both the **Frontend** and **Backend** to run the PaymentCRM application locally.

---

## Part 1: Setting up Environment Files

1. Go to the `backend/` directory, copy `.env.example` and rename it to `.env`.
2. Go to the `frontend/` directory, copy `.env.example` and rename it to `.env`.

Let's populate the variables in these files.

---

## Part 2: Retrieving API Keys & Credentials

### 1. MongoDB Connection String (`MONGODB_URI`)
You need a MongoDB database to store students, payments, and receipts. You have two options:

#### Option A: Local MongoDB (Easiest for local-only testing)
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) on your machine.
2. Install [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional, a GUI to view data).
3. Set your connection string to:
   ```env
   MONGODB_URI=mongodb://localhost:27017/paymentcrm
   ```

#### Option B: MongoDB Atlas (Cloud Database - Free Tier)
1. Sign up/Log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Database Cluster** (choose the free Shared tier).
3. Create a database user:
   * Go to **Database Access** under Security.
   * Add a new user with password authentication, and assign them the **Read and Write to any database** privilege.
   
4. Allow connection access:
   * Go to **Network Access** under Security.
   * Click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`) or whitelist your current IP.

5. Get the connection string:
   * Go to **Database** (clusters) and click **Connect**.
   * Choose **Drivers** (Node.js).
   * Copy the connection string format (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).
6. Paste it into your backend `.env` as `MONGODB_URI`, replacing `<username>` and `<password>` with the credentials of the database user you created in Step 3. Provide a database name before the query parameters (e.g. `...mongodb.net/paymentcrm?retryWrites...`).

---

### 2. JWT Secret Key (`JWT_SECRET`)
The JWT (JSON Web Token) secret is used to sign credentials. It should be a long, random secure string.
* You can generate one on your terminal by running:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
* Copy the printed long string and paste it into your backend `.env`:
  ```env
  JWT_SECRET=your_copied_random_hex_string
  ```

---

### 3. Gmail Nodemailer Credentials (`EMAIL_USER` & `EMAIL_PASS`)
The system uses Nodemailer to send password reset links. If you are using Gmail, you cannot use your regular Gmail password due to security restrictions. You must generate a **Google App Password**.

1. Go to your [Google Account Dashboard](https://myaccount.google.com/).
2. On the left menu, select **Security**.
3. Under **How you sign in to Google**, make sure **2-Step Verification** is turned **ON** (this is required to generate App Passwords).
4. Click on **2-Step Verification**, scroll down to the bottom, and click on **App passwords**.
5. Enter a custom name for your app (e.g., `Payment CRM`).
6. Click **Create**.
7. Google will show you a **16-character code** inside a yellow box (e.g., `abcd efgh ijkl mnop`).
8. Copy this code.
9. Open your backend `.env` and fill in:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_PASS=abcdefghijklmnop (paste the 16-character code without spaces)
   ```

---

## Part 3: Running the Application Locally

Once your `.env` files are configured, run the projects:

### 1. Initialize the Backend
```bash
cd backend
npm install
# Create an admin user automatically (using credentials defined in backend/createAdmin.js)
node createAdmin.js
# Start backend in development mode
npm run dev
```

### 2. Initialize the Frontend
```bash
cd ../frontend
npm install
# Start React frontend locally
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

*Note: Use the Super Admin credentials in `backend/createAdmin.js` (Email: `digital.marketing7982@gmail.com`, Password: `@2004`) to log in and approve any new user signups!*
