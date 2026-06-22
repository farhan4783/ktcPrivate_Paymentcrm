# Production Deployment Guide

This guide describes how to deploy the PaymentCRM application to production for free using **Render** (for the Express/Node.js backend) and **Vercel** (for the React frontend).

---

## Architecture Overview

```
                  ┌──────────────────────┐
                  │    React Frontend    │ (Vercel)
                  │ (payment-crm.vercel) │
                  └──────────┬───────────┘
                             │
                      API Requests (HTTPS)
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Express Backend    │ (Render)
                  │ (payment-crm.render) │
                  └──────────┬───────────┘
                             │
                      Database Queries
                             │
                             ▼
                  ┌──────────────────────┐
                  │    MongoDB Atlas     │ (Cloud Database)
                  │    (cluster0.xxx)    │
                  └──────────────────────┘
```

---

## Part 1: Deploying the Backend on Render

Render offers a free tier for hosting Node.js web services.

### Step 1: Push your Code to GitHub
Ensure your code is uploaded to a private or public GitHub repository.

### Step 2: Set up a MongoDB Atlas Instance
Ensure you have configured MongoDB Atlas as described in `steps.md`.
> [!IMPORTANT]
> Under MongoDB Atlas **Network Access**, ensure you have whitelisted the IP `0.0.0.0/0` (Allow Access from Anywhere). Because Render's free tier uses dynamic outgoing IP addresses, your database must allow incoming connections from any IP.

### Step 3: Create a Web Service on Render
1. Log in to [Render](https://render.com/).
2. Click **New** (top right) -> **Web Service**.
3. Connect your GitHub account and select your `PaymentRecept` repository.
4. Set the following configurations:
   * **Name**: `payment-crm-backend` (or similar)
   * **Language**: `Node`
   * **Branch**: `main` (or whichever branch you are using)
   * **Root Directory**: `backend` (This is critical since the backend is in a subfolder!)
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
   * **Instance Type**: `Free`

### Step 4: Configure Environment Variables on Render
Under the **Environment** tab of your Render Web Service, add the following variables:
* `MONGODB_URI`: *Your MongoDB Atlas connection string*
* `JWT_SECRET`: *A secure random string*
* `PORT`: `10000` (Render binds to a custom port automatically, but setting this ensures it aligns)
* `FRONTEND_URL`: *Your Vercel app URL (e.g. `https://your-app-name.vercel.app` - you can update this after deploying the frontend)*
* `EMAIL_SERVICE`: `gmail`
* `EMAIL_USER`: *Your gmail email*
* `EMAIL_PASS`: *Your Google App Password (16 characters)*

Click **Save Changes** and deploy the web service. Once deployed, Render will provide you with a public URL (e.g., `https://payment-crm-backend.onrender.com`).
**Copy this URL.** You will need it to configure the frontend.

---

## Part 2: Deploying the Frontend on Vercel

Vercel is the easiest and most robust platform for hosting Vite React projects.

### Step 1: Create a Project on Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Select the same GitHub repository.
4. Set the following configurations:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend` (This is critical since the frontend is in a subfolder!)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`

### Step 2: Configure Environment Variables on Vercel
Under the **Environment Variables** section, add:
* Key: `VITE_API_URL`
* Value: `https://your-render-backend-url.onrender.com/api` (Replace this with the Render URL you copied in Part 1)

### Step 3: Deploy
Click **Deploy**. Vercel will build the frontend and provide you with a live URL (e.g., `https://payment-recept.vercel.app`).

---

## Part 3: Connecting the Frontend to the Backend (CORS check)

After deploying the frontend on Vercel, copy the live frontend URL:
1. Go back to your **Render Dashboard** -> Select your Backend Web Service.
2. Go to **Environment**.
3. Update the `FRONTEND_URL` variable to your new Vercel URL (e.g., `https://payment-recept.vercel.app`).
4. Save the changes. Render will automatically trigger a redeploy of your backend.

This ensures that the backend CORS configuration allows secure requests from your Vercel frontend.

---

## Production Maintenance Notes

* **Cold Starts**: Render's free tier services will automatically spin down (sleep) after 15 minutes of inactivity. When a new request arrives, it may take 50–90 seconds to wake up (cold start). Once awake, it runs normally.
* **Vite Environment Variables**: In Vite, environment variables *must* be prefixed with `VITE_` to be exposed to the client-side code. This is why we use `VITE_API_URL`.
