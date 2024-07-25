# Codaez

Codaez is a comprehensive platform for DSA enthusiasts and competitive programmers, integrating with LeetCode, CodeForces, and CodeChef. It provides users with personalized dashboards, leaderboards, and profile pages to track and compare their progress across these platforms.


## Live Link
https://codaez.onrender.com

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [API Endpoints](#api-endpoints)
4. [Setup Instructions](#setup-instructions)



## Features

### Scheduled Profile and Contest update
Utilizing Github Actions, Automated scheduled tasks such as data refresh and contest refresh. This ensures that the data presented to the user is always up-to-date. GitHub Actions workflows are configured to run at specific intervals (24 hours for User data and 48 hours for Contest Data Refresh) to refresh user data and contest data respectively. These workflows help in maintaining the accuracy and timeliness of the information displayed on the dashboard and leaderboards, providing a seamless and efficient user experience without manual intervention.


### User Registration and Login
- Users can register either by Google Auth or verfying their email via OTP. OTP is sent using Node Mailer package. After successful verification the user is asked to provide usernames for LeetCode, CodeForces, and CodeChef if available.
- Secure authentication using JWT.

### Dashboard

- **Graphs:** Informative and visually appealing line graph displays contest ratings for all contests participated in on each platform.
- **Pie Charts:** Visual representation of the distribution of problems solved based on various difficulty levels available on platforms.
- **Profile Details:** Shows total questions solved, rank, rating, global rank, max rank, etc., for each platform.
- **Upcoming Contests:** Lists all upcoming contests on the three platforms with direct links to the contest pages.
- **Filters:** Allows filtering of upcoming contests based on the platform.

### Leaderboard

- Displays a leaderboard of all users followed.
- Aggregate rating calculated based on the ratings of all three platforms using min-max normalization.
- Sort feature to arrange the leaderboard based on aggregate rating or individual platform ratings.

### Profile Page
- **Own Profile:** Users can update their details, platform usernames, social links via the Edit form.
- **Other Profiles:** Users can visit other registered users' profiles, send follow requests, and see the ratings if the follow request is accepted.

### Follow System
- Users can follow other registered users and see their ratings on the respective platforms if the follow request is accepted.

## Technologies Used

- **Frontend:** React.js, Framer Motion for animations, Chart.js for graphs and charts
- **Backend:** Node.js, Express.js, MongoDB for database, JWT for authentication, Passport.js for Google OAuth, Cloudinary for Image storage.
- **Deployment:** Render.com


## API Endpoints

All API endpoints start with http://localhost:3000/api/v1/

### Authentication and User Management

- **GET /auth/google**
  - Endpoint to initiate Google OAuth authentication.

- **GET /auth/google/callback**
  - Callback URL for Google OAuth.

- **POST /register**
  - Endpoint to register a new user.

- **POST /send-otp**
  - Endpoint to send an OTP for verification.

- **POST /login**
  - Endpoint to authenticate users and generate JWT.

- **PUT /complete-profile**
  - Endpoint to complete the user profile (requires login).

- **GET /logout**
  - Endpoint to log out the user.

### User Details and Follow System

- **GET /userdetails**
  - Endpoint to retrieve details of users based on query passed

- **GET /get-requests**
  - Endpoint to retrieve follow requests for the logged-in user.

- **POST /sendfrequest**
  - Endpoint to send a follow request (requires login).

- **POST /withdraw-request**
  - Endpoint to withdraw a follow request (requires login).

- **POST /acceptfrequest**
  - Endpoint to accept a follow request (requires login).

- **POST /rejectfrequest**
  - Endpoint to reject a follow request (requires login).

- **POST /unfollow**
  - Endpoint to unfollow a user (requires login).

### Profile and Settings

- **GET /profile/:username**
  - Endpoint to retrieve the profile of a user (requires login).

- **PUT /update-profile**
  - Endpoint to update the profile of the logged-in user.

- **PUT /update-avatar**
  - Endpoint to update the avatar of the logged-in user.

- **PUT /changepw**
  - Endpoint to change the password of the logged-in user.

- **PUT /change-username**
  - Endpoint to change the username of the logged-in user.

- **GET /get-follow**
  - Endpoint to retrieve follow details for the logged-in user.

### Dashboard and Leaderboard

- **GET /dashboard**
  - Endpoint to retrieve dashboard data for the logged-in user.

- **GET /details/leaderboard**
  - Endpoint to retrieve leaderboard details for the logged-in user.


## Setup Instructions
  Clone the repository:
  
  ```
  git clone https://github.com/vanshulagarwal/Codaez.git
  ```

### Client (React)

1. Navigate to the `client` directory:
    ```
    cd client
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. **Environment Variables**: Create a `.env` file in the `client` directory with the following variables:
    ```
    VITE_API_URL=http://localhost:3000/api/v1/
    VITE_YOUR_STREAM_ID=google_analytics_stream_id
    VITE_YOUR_MEASUREMENT_ID=google_analytics_measurement_id
    ```


3. Start the client server:
    ```
    npm run dev
    ```

4. Access the client application at [http://localhost:5173](http://localhost:5173).

### Server (Node.js)


1. Navigate to the `server` directory:
    ```
    cd server
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. **Environment Variables**: Create a `.env` file in the `server` directory with the following variables:
    ```
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=your_jwt_expire_time (e.g., 7d)
    ATLAS_URL=your_mongodb_atlas_connection_string(optional if local machine has mongodb installed)
    CLOUDINARY_KEY=your_cloudinary_api_key
    CLOUDINARY_SECRET=your_cloudinary_api_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLIENT_ID=your_google_cloud_console_auth_id
    CLIENT_SECRET=your_google_cloud_console_auth_secret
    CLIENT_URL=http://localhost:5173
    SERVER_URL=http://localhost:3000
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_SECURE=true
    SMTP_USER=your_email_id
    SMTP_PASS=your_email_id_password_for_this_app
    OTP_EXPIRY=300 (5 min)
    ```

4. Start the server:
    ```
    node app.js
    ```

5. The server will be running at [http://localhost:3000](http://localhost:3000).

### Database Setup

- MongoDB Atlas is used for storing user information.
- Cloudinary is used for storing images.
- Node Mailer for sending mails during OTP verification.
