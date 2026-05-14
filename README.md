# KlassRep — Smart Class Attendance for Students

> GPS-powered attendance built around the person already doing the job — your course rep.

[![Live Demo](https://img.shields.io/badge/Live-klassrep.vercel.app-blue?style=flat-square)](https://klassrep.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-green?style=flat-square)](https://geoattend-backend-0tjn.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Built by](https://img.shields.io/badge/Built%20by-Velux%20Corporation-purple?style=flat-square)](https://github.com/veluxcorp)

---

## What is KlassRep?

KlassRep is a GPS-verified attendance tracking system designed around how attendance actually works in Ghanaian universities — through the **course rep**.

Instead of building another lecturer-first system, KlassRep puts the course rep in charge. They create the class, share a class code, start sessions from their phone, and students mark attendance with one tap. GPS verification ensures students are physically present.

---

## Screenshots

> Dashboard · Sessions · Attendance · Members

_(Add screenshots here)_

---

## Features

### For Course Reps

- Create a class space and get a unique class code (e.g. `CS-300-2025-X7K2`)
- Share code with classmates via WhatsApp — they join instantly
- Start GPS-verified attendance sessions with one tap
- Automatically marked present when starting a session
- Manage all courses for the class
- Promote up to 2 assistant reps
- View live attendance during sessions
- Full member management

### For Assistant Reps

- Start and close sessions when the main rep is unavailable
- Automatically marked present when starting a session
- View all sessions and courses
- Same session management access as the main rep

### For Students

- Join a class using the course rep's class code
- Mark attendance with one tap (GPS verified)
- See live attendance percentage per course
- Get alerted when attendance drops below 75%
- Full attendance history across all courses
- See active sessions in real time

### System Features

- GPS Haversine formula — checks distance between student and classroom
- Fraud prevention — each student marks once per session
- Role-based access — Course Rep, Assistant Rep, Student
- JWT authentication with secure token storage
- Rate limiting, CORS, helmet security headers
- Real-time session monitoring (15-second polling)
- Dark and light mode support
- Fully responsive — works on mobile, tablet, and desktop

---

## Tech Stack

### Frontend

| Technology              | Purpose                   |
| ----------------------- | ------------------------- |
| Next.js 14 (App Router) | React framework           |
| Tailwind CSS            | Styling                   |
| shadcn/ui               | Component library         |
| Framer Motion           | Animations                |
| TanStack React Query    | Data fetching and caching |
| Zustand                 | Global state management   |
| React Hook Form         | Form handling             |
| Axios                   | HTTP client               |
| Sonner                  | Toast notifications       |

### Backend

| Technology         | Purpose              |
| ------------------ | -------------------- |
| Node.js v20 LTS    | Runtime              |
| Express.js v5      | Web framework        |
| Prisma ORM v5.16   | Database ORM         |
| PostgreSQL         | Database             |
| JWT                | Authentication       |
| bcrypt             | Password hashing     |
| helmet             | Security headers     |
| express-rate-limit | Rate limiting        |
| morgan             | HTTP logging         |
| compression        | Response compression |

### Infrastructure

| Service  | Purpose             |
| -------- | ------------------- |
| Vercel   | Frontend hosting    |
| Render   | Backend hosting     |
| Supabase | PostgreSQL database |

---

## Database Schema

```
User
  id, name, email, studentId, password, role (STUDENT | COURSE_REP)

ClassSpace
  id, name, department, level, academicYear, classCode (unique)
  → belongs to CourseRep

CourseRep
  id, department, level
  → belongs to User, has one ClassSpace

Student
  id, department, level
  → belongs to User, belongs to ClassSpace
  → may have one AssistantRep

AssistantRep
  id, createdAt
  → belongs to Student, belongs to ClassSpace
  → unique per (studentId, classSpaceId)

Course
  id, code, name, lecturerName
  → belongs to ClassSpace

Session
  id, date, startTime, endTime, latitude, longitude
  radiusMeters (default 100), isOpen (default true)
  → belongs to Course, belongs to ClassSpace

Attendance
  id, status (PRESENT | ABSENT | LATE), latitude, longitude, markedAt
  → belongs to Student, belongs to Session
  → unique per (studentId, sessionId)
```

---

## API Reference

### Auth Routes — `/api/v1/auth`

| Method | Endpoint            | Description                       | Auth     |
| ------ | ------------------- | --------------------------------- | -------- |
| POST   | `/register`         | Register as course rep or student | Public   |
| POST   | `/login`            | Login and receive JWT             | Public   |
| GET    | `/me`               | Get current user profile          | Required |
| GET    | `/class/:classCode` | Look up a class by code           | Public   |

### Class Routes — `/api/v1/class`

| Method | Endpoint   | Description                | Auth         |
| ------ | ---------- | -------------------------- | ------------ |
| GET    | `/me`      | Get rep's full class space | Rep only     |
| GET    | `/student` | Get student's class space  | Student only |

### Course Routes — `/api/v1/courses`

| Method | Endpoint | Description              | Auth     |
| ------ | -------- | ------------------------ | -------- |
| GET    | `/`      | Get all courses in class | Required |
| POST   | `/`      | Create a course          | Rep only |
| GET    | `/:id`   | Get course with sessions | Required |
| PUT    | `/:id`   | Update a course          | Rep only |
| DELETE | `/:id`   | Delete a course          | Rep only |

### Session Routes — `/api/v1/sessions`

| Method | Endpoint     | Description                                  | Auth             |
| ------ | ------------ | -------------------------------------------- | ---------------- |
| GET    | `/`          | Get all sessions in class                    | Required         |
| GET    | `/:id`       | Get session with attendance                  | Required         |
| POST   | `/`          | Start a session (auto-marks starter present) | Rep or Assistant |
| PATCH  | `/:id/close` | Close a session                              | Rep or Assistant |
| DELETE | `/:id`       | Delete a session                             | Rep only         |

### Attendance Routes — `/api/v1/attendance`

| Method | Endpoint                               | Description                    | Auth     |
| ------ | -------------------------------------- | ------------------------------ | -------- |
| POST   | `/mark`                                | Mark attendance (GPS check)    | Student  |
| GET    | `/me`                                  | Get my full attendance history | Student  |
| GET    | `/session/:sessionId`                  | Get all records for a session  | Required |
| GET    | `/student/:studentId/course/:courseId` | Get student stats per course   | Required |

### Assistant Routes — `/api/v1/assistants`

| Method | Endpoint        | Description                        | Auth     |
| ------ | --------------- | ---------------------------------- | -------- |
| GET    | `/`             | Get all assistant reps             | Rep only |
| POST   | `/promote`      | Promote a student to assistant rep | Rep only |
| DELETE | `/:assistantId` | Remove an assistant rep            | Rep only |

---

## Getting Started

### Prerequisites

- Node.js v20 LTS
- PostgreSQL database (Supabase, Neon, or local)
- npm or yarn

### Clone the Repository

```bash
# Clone backend
git clone https://github.com/veluxcorp/klassrep-backend
cd klassrep-backend

# Clone frontend
git clone https://github.com/veluxcorp/klassrep-frontend
cd klassrep-frontend
```

### Backend Setup

```bash
cd klassrep-backend
npm install
```

Create `.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname"
DIRECT_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

Push the database schema:

```bash
npx prisma db push
npx prisma generate
```

Start the server:

```bash
node app.js
# Server running on port 3001
```

### Frontend Setup

```bash
cd klassrep-frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
# App running on http://localhost:3000
```

---

## How It Works

### Course Rep Flow

```
1. Register as Course Rep
   → Enter name, email, student ID, department, level, academic year
   → Class space created automatically
   → Receive unique class code (e.g. CS-300-2025-X7K2)

2. Share class code
   → Drop code in class WhatsApp group
   → Students register and enter the code to join

3. Start a session
   → Open Sessions tab
   → Tap Start Session
   → Select course, capture GPS location
   → Session goes live — students can now mark in
   → You are automatically marked PRESENT

4. Monitor attendance
   → See who's marking in live
   → Close session when class ends
   → Attendance report generated automatically
```

### Student Flow

```
1. Register as Student
   → Enter name, email, student ID
   → Enter class code from course rep
   → Preview class info → confirm → join

2. Mark attendance
   → See active session alert on dashboard
   → Tap Mark Attendance
   → App checks your GPS vs classroom GPS
   → Within 100m → PRESENT
   → Outside 100m → ABSENT

3. Track progress
   → See attendance % per course on dashboard
   → Get warned when below 75%
   → Full history in History tab
```

### GPS Verification — Haversine Formula

```
Distance = 2R × arcsin(√(sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)))

Where R = 6371km (Earth's radius)

If distance ≤ radiusMeters → PRESENT
If distance > radiusMeters → ABSENT
```

---

## Assistant Rep System

The main course rep can promote up to **2 students** as assistant reps. This solves the real problem of the course rep being unavailable for a class.

```
Main Rep promotes Ama as Assistant Rep
         ↓
Ama logs in as a student
         ↓
She sees Sessions tab in her navigation
         ↓
She can start and close sessions
         ↓
She is auto-marked PRESENT on session start
         ↓
Main rep sees the session on their dashboard
```

**Assistant Reps can:**

- Start attendance sessions
- Close attendance sessions
- View all courses and members

**Assistant Reps cannot:**

- Create or delete courses
- Add or remove members
- Promote other students
- Change class settings

---

## Project Structure

### Backend

```
klassrep-backend/
├── app.js                    # Express app setup
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── client.js             # Prisma singleton
├── controllers/
│   ├── authController.js     # Register, login, getMe
│   ├── classController.js    # Class space queries
│   ├── courseController.js   # Course CRUD
│   ├── sessionController.js  # Session management
│   ├── attendanceController.js # GPS attendance marking
│   └── assistantController.js  # Assistant rep management
├── middleware/
│   ├── authenticate.js       # JWT verification
│   ├── authorize.js          # Role checking
│   └── errorHandler.js       # Global error handling
├── routes/
│   ├── authRoutes.js
│   ├── classRoutes.js
│   ├── courseRoutes.js
│   ├── sessionRoutes.js
│   ├── attendanceRoutes.js
│   └── assistantRoutes.js
└── utils/
    ├── classCode.js          # Class code generator
    ├── haversine.js          # GPS distance calculation
    └── response.js           # Consistent API responses
```

### Frontend

```
klassrep-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.jsx
│   │   └── register/page.jsx   # 3-step registration
│   ├── (app)/
│   │   ├── layout.jsx           # Protected layout + sidebar
│   │   ├── dashboard/page.jsx   # Role-aware dashboard
│   │   ├── courses/page.jsx
│   │   ├── sessions/page.jsx
│   │   ├── members/page.jsx     # Assistant rep management
│   │   ├── attendance/page.jsx  # GPS attendance marking
│   │   ├── history/page.jsx
│   │   └── profile/page.jsx
│   ├── layout.jsx               # Root layout + SEO metadata
│   ├── page.jsx                 # Landing page
│   ├── sitemap.js
│   └── robots.js
├── components/
│   └── layout/
│       ├── BottomTabBar.jsx     # Role-aware mobile navigation
│       ├── DesktopSidebar.jsx
│       └── ProtectedRoute.jsx
├── hooks/
│   └── useAuth.js              # Auth state + role helpers
├── store/
│   └── authStore.js            # Zustand persist store
└── lib/
    └── axios.js                # Axios instance + interceptors
```

---

## Security

- All passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- Rate limiting on all routes (100 requests per 15 minutes)
- Helmet sets secure HTTP headers
- CORS restricted to frontend origin
- GPS coordinates never trusted from client for session start
- `organizationId` (classSpaceId) always determined server-side from token
- Students cannot mark attendance outside session's GPS radius
- Each student can only mark attendance once per session

---

## Deployment

### Frontend (Vercel)

```bash
# Connect your GitHub repo to Vercel
# Add environment variable:
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
```

### Backend (Render)

```bash
# Connect your GitHub repo to Render
# Set environment variables:
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://klassrep.vercel.app
```

---

## Roadmap

- [ ] Real-time attendance updates with Socket.io
- [ ] Email notifications when sessions start
- [ ] Password reset flow
- [ ] Refresh token system
- [ ] Export attendance reports to PDF
- [ ] WhatsApp integration for session alerts
- [ ] React Native mobile app
- [ ] Multiple class spaces per rep (different semesters)
- [ ] QR code as alternative to GPS for indoor venues

---

## Built By

**Fosu Yaw Humphrey** — Full-stack Developer  
**Velux Corporation (codeHumps)** — Kumasi Technical University, Ghana

> _"Built around how attendance actually works — through your course rep."_

---

## License

MIT License — see [LICENSE](LICENSE) for details.
