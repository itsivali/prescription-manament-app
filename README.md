# Prescription Management App

## Overview

This application provides seamless prescription and inventory management for healthcare providers, pharmacists, and administrators. It combines advanced features like Role-Based Access Control (RBAC), Audit Logging, Notification Systems, Analytics Dashboards, Offline Functionality, and an Inventory Monitoring System. The app leverages modern technologies to enhance operational efficiency, ensure compliance with regulations, and improve user and patient experiences.

## Technologies Used

- **Frontend:** React
- **Backend:** Python
- **Database:** MySQL
- **API Layer:** GraphQL

## Features

### 1. Role-Based Access Control (RBAC)

**Purpose:** Ensure secure access to application features by assigning specific permissions to user roles.

**Implementation:**
- **Roles:**
  - Administrator: Manage users, monitor inventory, and view analytics.
  - Healthcare Providers: Create and manage prescriptions.
  - Pharmacists: Fulfill prescriptions and update inventory.
  - Patients: View prescriptions and receive notifications.
- **Permissions:**
  - Define granular actions for each role (e.g., only admins can edit user roles, pharmacists can adjust stock).
- **Security:**
  - Sensitive operations are restricted to authorized users.
  - Dynamic role-checking on both the frontend and backend.

### 2. Audit Logging

**Purpose:** Maintain accountability by tracking all critical user actions.

**Implementation:**
- **Tracked Actions:**
  - Logins, logouts, prescription creations, stock updates, and user management actions.
- **Log Details:**
  - User ID, timestamp, action performed, and related data.
- **Storage:**
  - Logs stored securely in the database for auditing and compliance.
- **Access:**
  - Only administrators can view and analyze logs via the dashboard.

### 3. Notification System

**Purpose:** Enhance user engagement and ensure timely actions through email or SMS notifications.

**Implementation:**
- **Types of Notifications:**
  - Patients: Alerts for prescription refills and follow-up appointments.
  - Suppliers: Alerts for low stock levels in inventory.
- **Delivery Methods:**
  - Email: Integrated with an SMTP service like SendGrid.
  - SMS: Powered by Twilio for instant communication.
- **Customizable Preferences:**
  - Users can opt in or out of specific notification types.

### 4. Analytics Dashboard

**Purpose:** Provide actionable insights into prescription trends, user activity, and operational efficiency.

**Implementation:**
- **Data Visualizations:**
  - Prescription trends by time period.
  - Inventory usage and restocking trends.
  - User activity metrics.
- **Interactive Features:**
  - Filters to refine data by time, user role, or medication.
  - Export options for reporting.
- **Technologies Used:**
  - React charting libraries like Chart.js or Recharts for dynamic visualizations.

### 5. Offline Functionality

**Purpose:** Ensure application usability in low-connectivity environments.

**Implementation:**
- **Local Storage:**
  - Store data locally for offline usage.
- **Data Synchronization:**
  - Automatically sync with the server when the connection is restored.
- **Use Cases:**
  - Healthcare providers can create prescriptions offline.
  - Pharmacists can update inventory offline.

### 6. Inventory Monitoring System

**Purpose:** Prevent medication stockouts by tracking inventory levels and notifying suppliers when thresholds are breached.

**Implementation:**
- **Threshold Management:**
  - Administrators define minimum stock levels for medications.
- **Real-Time Updates:**
  - Inventory levels are adjusted dynamically based on prescription fulfillment.
- **Supplier Integration:**
  - Notifications sent to suppliers via email or SMS with stock details.
- **Data Tracking:**
  - Logs of stock adjustments stored for analysis.
- **Dashboard Integration:**
  - Visual indicators for low-stock medications and reorder recommendations.

## Technical Details

### Frontend (React)

- **Components:**
  - RBAC Integration: Dynamic rendering of features based on user role.
  - Inventory Management: User-friendly interface for viewing and updating stock.
  - Notifications: Real-time updates using GraphQL subscriptions.
  - Analytics Dashboard: Interactive charts displaying trends and metrics.

### Backend (Python)

- **RBAC Middleware:**
  - Check user roles and permissions for every API call.
- **Notification Service:**
  - Handle email and SMS notifications using libraries like smtplib and Twilio.
- **Audit Logging Service:**
  - Capture and store critical user actions with metadata.
- **Inventory Management Service:**
  - Monitor stock levels and trigger alerts for low stock.

### Database (MySQL)

- **Schema:**
  - Users Table: User roles, permissions, and authentication details.
  - Prescriptions Table: Prescription details linked to patients and medications.
  - Medications Table: Stock levels, thresholds, and supplier details.
  - Suppliers Table: Contact details and associated medications.
  - Audit Logs Table: Records of user actions with timestamps.
  - Notification Logs Table: History of sent alerts.

### GraphQL API

- **Endpoints:**
  - **Queries:**
    - Fetch prescriptions, users, stock levels, and notifications.
  - **Mutations:**
    - Create prescriptions, update inventory, and manage user roles.
  - **Subscriptions:**
    - Real-time notifications for low stock and critical actions.

## Workflow

1. **Role-Based Access Control:**
   - A user logs in, and their role is verified.
   - The app restricts access to features based on their permissions.
2. **Prescription Management:**
   - Healthcare providers create prescriptions, triggering inventory updates.
   - Patients are notified about their prescriptions.
3. **Inventory Monitoring:**
   - Inventory levels decrease as prescriptions are fulfilled.
   - When stock drops below thresholds, suppliers are alerted.
4. **Audit Logging:**
   - Actions like stock updates and prescription creation are logged.
5. **Analytics Dashboard:**
   - Administrators analyze trends to optimize inventory and improve operational efficiency.

## Security Considerations

1. **Authentication:**
   - Use JWT tokens for secure user authentication.
2. **Data Encryption:**
   - Encrypt sensitive data (e.g., user credentials, supplier details).
3. **Access Control:**
   - Enforce strict RBAC to prevent unauthorized actions.
4. **Audit Trails:**
   - Logs ensure accountability and compliance with regulations.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)