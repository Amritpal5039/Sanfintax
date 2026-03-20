##### References:- Chatgpt sanfintax chat folder


Need to fix the add/remove/edit FD and make the fronted of the landing page.
i want red effect from the right top corner to the left bottom corner. color - red black  

##### navbar design #####
links- https://www.navbar.gallery/navbar/coda

#### Folder structure to be followed
src
│
├── app
│   ├── api
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── route.ts
│   │   │   ├── register
│   │   │   │   └── route.ts
│   │   │   └── logout
│   │   │       └── route.ts
│   │   │
│   │   ├── me
│   │   │   └── route.ts
│   │   │
│   │   └── fds
│   │       └── route.ts
│   │
│   ├── dashboard
│   │   └── page.tsx
│   │
│   ├── login
│   │   └── page.tsx
│   │
│   └── register
│       └── page.tsx
│
├── lib
│   ├── db.ts
│   ├── jwt.ts
│   ├── auth.ts
│   └── cookies.ts
│
├── models
│   └── User.ts
│
├── middleware.ts
│
└── types
    └── user.ts
    This structure keeps:

auth logic
database
JWT utilities
separated from UI.

#### Authentication Flow
User Login
   │
   ▼
POST /api/auth/login
   │
   ▼
Password verified
   │
   ▼
JWT generated
   │
   ▼
Stored in HttpOnly cookie
   │
   ▼
Browser sends cookie automatically
   │
   ▼
Middleware checks token
   │
   ▼
API verifies JWT
   │
   ▼
Database query using userId


#### Why This Architecture Is Professional

This structure is used because it provides:
Security

HttpOnly cookies
JWT verification on every API
Scalability

Auth logic separated from API routes
Clean Code

Reusable utilities

Production Ready

Works with microservices and serverless

#### Navbar design 

LOGO        Products   Solutions   Knowledge Center   Company       Flag   Contact   Button
            <----32px gap-8--->                           <---24px--->

Dropdown Columns
Column1    Column2    Column3    Card
   <-------40px gap-10------->

Mobile Menu
Products
   20px space-y-5
Solutions
   20px space-y-5
Knowledge Center
   20px space-y-5
Company
   20px space-y-5