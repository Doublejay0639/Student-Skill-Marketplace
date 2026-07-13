# Student Skill Marketplace API

A RESTful API that connects students who want to offer skills with students who want to learn them, enabling users to discover services, create listings and manage bookings securely through role-based access.

## Live API

**Base URL:** `https://student-skill-marketplace-production.up.railway.app`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Authentication | JWT + bcrypt |
| Validation | Zod |
| Security | Helmet + express-rate-limit |
| Testing | Jest + Supertest |
| Deployment | Railway |

---

## Features

- JWT-based authentication (register and login)
- Role-based access control (Student and Admin roles)
- Full CRUD for skill listings
- Category management (admin only)
- Booking system with status lifecycle (Pending → Confirmed → Completed/Cancelled)
- Reviews for completed bookings
- Input validation on all endpoints
- Rate limiting (100 requests per 15 minutes)
- Security headers via Helmet
- Global error handling
- Automated API tests

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Doublejay0639/student-skill-marketplace.git
cd student-skill-marketplace

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ssm_db"
PORT=8080
JWT_SECRET=your_super_secret_key_here
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

### Running Tests

```bash
npm test
```

---

## Database Schema

The API is built around five core entities:

```
User          → offers many SkillListings (as provider)
User          → makes many Bookings (as seeker)
Category      → groups many SkillListings
SkillListing  → receives many Bookings
Booking       → has one Review (optional)
```

---
## Business Rules

- A user cannot book their own listing
- A booking must be `COMPLETED` before a review can be left
- Only one review per booking
- Only the seeker (person who booked) can leave a review
- Only admins can create categories
- Listings marked as `available: false` are excluded from public listing results

---

## Project Structure

```
SSM/
├── config/
│   └── db.js              # Prisma client setup
├── controller/
│   ├── authController.js
│   ├── listingController.js
│   ├── categoryController.js
│   ├── bookingController.js
│   └── reviewController.js
├── middlewares/
│   ├── authMiddleware.js   # protect + restrictTo
│   └── errorMiddleware.js  # global error handler
├── routes/
│   ├── authRoute.js
│   ├── listingRoute.js
│   ├── categoryRoute.js
│   ├── bookingroute.js
│   └── reviewRoute.js
├── services/
│   ├── authService.js
│   ├── listingService.js
│   ├── categoryService.js
│   ├── bookingService.js
│   └── reviewService.js
├── tests/
│   ├── auth.test.js
│   ├── listings.test.js
│   ├── categories.test.js
│   ├── bookings.test.js
│   └── reviews.test.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── .gitignore
├── package.json
├── prisma.config.ts
└── server.js
```

---

## Running Tests

```bash
npm test
```

Current test coverage:
- Auth: Register, Login
- Listings: Create, Get All, Get by ID
- Categories: Create, Get All
- Bookings: Create, Confirm
- Reviews: Get listing reviews

---

## What I Learned Building This

- Designing relational database schemas before writing any code
- Prisma new version, Prisma 7 broke every existing tutorial (driver adapters, generated client)
- Why separation of concerns (Route → Controller → Service) makes code maintainable
- JWT authentication flow from scratch
- The difference between 401 (not authenticated) and 403 (not authorized)
- Why tests matter and how to write them

---

## Author

Built by [Jolaoso Jephthah] — documenting the journey to becoming a backend engineer.

- GitHub: [@Doublejay0639](https://github.com/Doublejay0639)
- LinkedIn: [Oluwaseun Jolaoso](https://linkedin.com/in/oluwaseun-jolaoso)
