# 🏨 **Hotel Booking API – Backend**

**A modular, scalable RESTful API built for hotel management, room allocation, user authentication, and booking workflows.**

<p align="left">
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" />
  <img src="https://img.shields.io/badge/Version-v1.0.0-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

## 📌 **Overview**

The **Hotel Booking API** provides a complete backend foundation for building a real-world hotel booking platform. The system supports:

- Full authentication using **JWT access + refresh token rotation**
- **Role-based access control** (User/Admin)
- Modular CRUD operations for **Hotels**, **Rooms**, **Bookings**
- Clean, versioned REST architecture following industry standards
- Scalable folder structure suitable for production environments
- Consistent response patterns with detailed error handling

This project is created with developers in mind — easy to extend, readable, maintainable, and API-first.

## 🧱 **Core Features (Developer-Oriented)**

### 🔐 Authentication & Security

- Stateless JWT authentication
- Refresh token rotation (secure token lifecycle)
- Logout + token invalidation
- Protected routes via middleware
- Supports Admin/User RBAC via JWT claims

### 🧑‍💼 User Management

- Self-profile retrieval (`/me`)
- Update own profile
- Access hotel & room listings
- Create & manage bookings

### 🛠 Admin Control Panel APIs

- Create new admins
- Delete any user
- Downgrade admin → user
- Full hotel & room CRUD operations

### 🏨 Hotels & Rooms

- Hotel creation, updates, deletion
- Create multiple rooms inside a hotel
- Price, capacity, type-based room structure
- Public access for viewing hotels & rooms

### 📅 Booking Engine

- Create a booking
- Cancel booking
- User-level access control
- Room association & availability logic

## 🗂 **API Group Structure (Postman)**

```
├── Auth
├── User
├── Admin
├── Test
```

This modular grouping keeps endpoints isolated and easy to test.

## 🌐 **Base URLs**

```bash
{{url}}
http://localhost:3000/api
```

## 🛠 **Tech Stack**

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| Runtime      | Node.js                                    |
| Framework    | Express.js                                 |
| Database     | MongoDB / PostgreSQL (your implementation) |
| Auth         | JWT Access & Refresh Tokens                |
| API Spec     | OpenAPI / Postman                          |
| Deploy Ready | Docker / Railway / Render / AWS            |

## 📁 **Recommended Folder Structure**

(Developer-friendly, scalable for large projects)

```
/src
  /routes
    auth.routes.js
    admin.routes.js
    user.routes.js
    hotel.routes.js
    room.routes.js
    booking.routes.js
  /controllers
  /services
  /models
  /middlewares
  /utils
  app.js
  server.js
.env
README.md
```

## 🔌 **Primary API Endpoints**

### **Auth Routes**

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/v1/auth/register`     | Register new user               |
| POST   | `/v1/auth/login`        | Login (access + refresh tokens) |
| POST   | `/v1/auth/logout`       | Logout                          |
| POST   | `/v1/auth/rotate-token` | Refresh access token            |

### **User Routes**

| Method | Endpoint                         | Description                        |
| ------ | -------------------------------- | ---------------------------------- |
| GET    | `/v1/user/me`                    | Fetch authenticated user's profile |
| PUT    | `/v1/user/update`                | Update user profile                |
| GET    | `/v1/hotels`                     | List all hotels                    |
| GET    | `/v1/hotels/:hotelId/rooms`      | Rooms of a hotel                   |
| GET    | `/v1/rooms/:roomId`              | Room details                       |
| POST   | `/v1/bookings`                   | Create booking                     |
| PATCH  | `/v1/bookings/:bookingId/cancel` | Cancel booking                     |

### **Admin Routes**

| Method | Endpoint                    | Description     |
| ------ | --------------------------- | --------------- |
| POST   | `/v1/admin`                 | Create admin    |
| DELETE | `/v1/admin/:userId`         | Delete user     |
| PATCH  | `/v1/admin/:adminId`        | Downgrade admin |
| POST   | `/v1/hotels`                | Create hotel    |
| PUT    | `/v1/hotels/:hotelId`       | Update hotel    |
| DELETE | `/v1/hotels/:hotelId`       | Delete hotel    |
| POST   | `/v1/hotels/:hotelId/rooms` | Create room     |
| PUT    | `/v1/rooms/:roomId`         | Update room     |
| DELETE | `/v1/rooms/:roomId`         | Delete room     |

### **Test Route**

```
GET /
```

Used to verify server health.

## 🔐 **Authentication Workflow (Technical)**

1. **User logs in**
   - Server returns `accessToken` (short-lived) and `refreshToken` (long-lived)

2. **Protected API calls**
   - Include header:

     ```
     Authorization: Bearer <accessToken>
     ```

3. **When access token expires**
   - Client hits `/v1/auth/rotate-token` with the refresh token
   - Server issues a new access token

4. **Logout**
   - Refresh token is invalidated (DB/store)

This ensures maximum API security.

## 🧪 **Running Locally**

### 📥 Install Dependencies

```bash
npm install
```

### ⚙️ Environment Variables

Create `.env`:

```
PORT=3000
NODE_ENV=development
DB=mysql
DB_HOST=localhost
DB_USER=root
DB_PASS=""
DB_NAME=your_db #defaultdb
JWT_SECRET=your_secret
LOG_LEVEL=debug
CLIENT_ORIGIN=client_url
ACCESS_TOKEN_EXPIRY=1d
ACCESS_TOKEN_SECRET=access_jwt_secret
REFRESH_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=refresh_jwt_secret
```

### ▶️ Start Development Server

```bash
npm run dev
```

Server runs on:

```
http://localhost:3000
```

## 🧼 **API Response Structure**

### ✔ Success

```json
{
  "message": "Operation successful",
  "data": {}
}
```

### ❌ Error

```json
{
  "error": "Something went wrong",
  "status": 400
}
```

## 🚀 **Deployment**

This API can be deployed easily to:

- **Render**
- **Railway**
- **AWS EC2 / ECS**
- **Docker Containers**
- **Heroku**
- **Vercel Serverless (with some adaptation)**

## 🤝 **Contributing**

Contributions, issues, and feature requests are welcome.
Feel free to check the issues page or open a new one.

## 📜 **License**

Distributed under the **MIT License**.
