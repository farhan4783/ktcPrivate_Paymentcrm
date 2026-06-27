# CRM Upgrade Tasks

## Component 1: Add Python Course Everywhere
- [x] Create `frontend/src/utils/constants.js` with centralized COURSES array
- [x] Update ReceiptGenerator.jsx to use COURSES
- [x] Update Students.jsx to use COURSES
- [x] Update StudentProfile.jsx to use COURSES
- [x] Update Payments (already dynamic via enrollment, no change needed)

## Component 2: Edit/Delete Capabilities
- [x] Backend: Add update/delete endpoints to studentController
- [x] Backend: Add updateEnrollment/deleteEnrollment to studentController
- [x] Backend: Add updatePayment/deletePayment to paymentController  
- [x] Backend: Register new routes in studentRoutes, paymentRoutes
- [x] Frontend API: Add update/delete methods to api.js
- [x] Frontend: Add edit/delete modals to StudentProfile.jsx (student info, enrollments, payments)
- [x] Frontend: Add edit/delete to Students.jsx table rows

## Component 3: Admin User Creation
- [x] Backend: Add viewer role to User model
- [x] Backend: Add viewerAccess middleware
- [x] Backend: Add createUser, updateUser, deleteUser, resetPassword to adminController
- [x] Backend: Add new admin routes
- [x] Backend: Protect write routes with staffAccess, read routes with viewerAccess
- [x] Frontend: Upgrade AdminUserManagement.jsx with create/edit/delete/reset-password modals

## Component 4: Advanced CRM Features
- [x] 4a. Activity Log / Notes on Student Profiles
  - [x] Backend: Create Activity model
  - [x] Backend: Create activityController and routes (addNote, getActivities)
  - [x] Backend: Register activity routes in server.js
  - [x] Frontend: Add Activity/Timeline component on StudentProfile.jsx
- [x] 4b. Student Tags / Labels / Address / Source
  - [x] Backend: Update Student model (tags, address, source)
  - [x] Frontend: Add fields to student forms (add/edit modal) and display on Students.jsx/StudentProfile.jsx
- [x] 4c. Course-wise Analytics on Dashboard
  - [x] Backend: Add course-wise breakdown aggregation in dashboardController.js
  - [x] Frontend: Add course revenue chart / statistics on Dashboard.jsx
- [x] 4d. Bulk Actions & CSV Export
  - [x] Backend: Add exportController.js and routes for exporting students/payments/receipts
  - [x] Frontend: Add CSV Export trigger to Students.jsx and Reports.jsx
  - [x] Frontend: Add bulk delete / tag update on Students.jsx table
- [x] 4e. Advanced Search & Filters
  - [x] Frontend: Add search state and status, course, tag filters to Students.jsx and Reports.jsx
- [x] 4f. Settings Page (Functional)
  - [x] Backend: Create Settings model, controller, and routes
  - [x] Frontend: Update Settings.jsx to load/save from API
