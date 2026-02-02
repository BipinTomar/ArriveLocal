# ArriveLocal Backend API

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   cd ArriveLocal-BE
   npm install
   ```

2. **Create Environment File**
   Create a `.env` file in the root directory with:
   ```env
   PORT=3000
   ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Run the Server**
   
   **Development Mode (with auto-reload):**
   ```bash
   npm run dev
   ```
   
   **Production Mode:**
   ```bash
   npm run build
   npm start
   ```

4. **Verify Server is Running**
   - Server should start on `http://localhost:3000`
   - You should see: `Server is running on port 3000`

---

## 📋 Project Progress Summary

### ✅ Completed Features

#### **Phase 1: Authentication System (COMPLETE)**
- ✅ User Registration (`POST /auth/register`)
  - Email validation with regex
  - Password hashing with bcrypt
  - Role-based user creation (user, seller, delivery_partner)
  - Duplicate email prevention

- ✅ User Login (`POST /auth/login`)
  - Email/password authentication
  - JWT access token (15min expiry)
  - JWT refresh token (1day expiry)
  - Refresh token stored in httpOnly cookie
  - Token rotation on refresh

- ✅ Token Refresh (`POST /auth/refresh`)
  - Refresh token validation
  - New access token generation
  - Token rotation for security

- ✅ User Logout (`POST /auth/logout`)
  - Refresh token invalidation
  - Cookie clearing

- ✅ Get Current User (`GET /auth/me`)
  - Protected route with JWT verification
  - Returns user profile

#### **Phase 2: Validation & Security (COMPLETE)**
- ✅ **Zod Validation System**
  - Request body validation for all auth endpoints
  - Email normalization (lowercase)
  - Password strength validation
  - Mobile number validation
  - Role enum validation
  - Strict mode (rejects unknown fields)

- ✅ **CORS Configuration**
  - Whitelist-based origin control
  - Credentials support for cookies
  - Authorization header support
  - Proper preflight handling

- ✅ **JWT Middleware**
  - `verifyAccessToken` - Validates access tokens
  - `verifyRefreshToken` - Validates refresh tokens
  - `requireRole` - Role-based access control
  - `optionalAuth` - Optional authentication

- ✅ **Error Handling**
  - Centralized error handler
  - Consistent error response format
  - 404 handler for unknown routes

#### **Phase 3: Project Structure (COMPLETE)**
- ✅ Modular architecture:
  - Controllers (business logic)
  - Routes (endpoint definitions)
  - Middleware (authentication, validation)
  - Models (data structures)
  - Validators (Zod schemas)
  - Config (CORS, allowed origins)

---

## 📁 Project Structure

```
ArriveLocal-BE/
├── config/
│   ├── allowedOrigins.ts      # CORS whitelist
│   └── corsOptions.ts         # CORS configuration
├── controllers/
│   └── auth/
│       ├── loginController.ts
│       ├── registerController.ts
│       ├── refreshController.ts
│       ├── logoutController.ts
│       └── meController.ts
├── middleware/
│   ├── authMiddleware.ts      # JWT verification
│   └── validateRequest.ts    # Zod validation
├── models/
│   ├── UserInterface.ts       # TypeScript interfaces
│   └── UserRegister.ts        # User model (file-based)
├── routes/
│   └── auth/
│       ├── login.ts
│       ├── register.ts
│       ├── refresh.ts
│       ├── logout.ts
│       └── me.ts
├── validators/
│   └── authSchemas.ts         # Zod validation schemas
├── data/
│   └── users.json             # User storage (file-based)
├── index.ts                   # Main server file
└── package.json
```

---

## 🔌 API Endpoints

### Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/refresh` | Refresh access token | No (cookie) |
| POST | `/auth/logout` | User logout | No (cookie) |
| GET | `/auth/me` | Get current user profile | Yes (Bearer) |

### Example Requests

**Register:**
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "1234567890",
  "role": "user"
}
```

**Login:**
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Profile:**
```bash
GET http://localhost:3000/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 🧪 Testing

### Using Postman
1. Import the API endpoints
2. Test registration → login → get profile flow
3. Verify refresh token cookie is set
4. Test token refresh endpoint

### Using Browser Console
```javascript
// Login
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(console.log);

// Get Profile (use accessToken from login response)
fetch('http://localhost:3000/auth/me', {
  headers: { 
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  credentials: 'include'
})
.then(r => r.json())
.then(console.log);
```

---

## 🔐 Security Features

- ✅ Password hashing (bcrypt with 6 salt rounds)
- ✅ JWT token-based authentication
- ✅ Refresh token rotation
- ✅ HttpOnly cookies for refresh tokens
- ✅ CORS whitelist protection
- ✅ Input validation (Zod)
- ✅ Role-based access control ready

---

## 📝 Next Steps (TODO)

### Phase 4: Database Migration
- [ ] Choose database (PostgreSQL + PostGIS or MongoDB)
- [ ] Migrate from file-based storage to database
- [ ] Add geospatial indexes for location queries

### Phase 5: Hyperlocal Features
- [ ] Outlet model with lat/long
- [ ] Nearby outlets search API
- [ ] Routing integration (OSRM/Valhalla)
- [ ] ETA calculation
- [ ] Delivery route visualization

### Phase 6: Additional Features
- [ ] User profile update
- [ ] Address management
- [ ] Product/Inventory APIs
- [ ] Order management
- [ ] Payment integration

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file or kill process
lsof -ti:3000 | xargs kill
```

**Missing environment variables:**
- Ensure `.env` file exists with all required variables

**CORS errors:**
- Check `config/allowedOrigins.ts` includes your frontend URL
- Verify `credentials: true` in CORS config

**Token errors:**
- Ensure `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are set
- Check token expiry times

---

## 📚 Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing
- **cookie-parser** - Cookie handling

---

## 📄 License

ISC

