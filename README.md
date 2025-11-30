# Personal Todo Manager (MVC + EJS + JWT)

Modern personal todo application with a clean UI, MVC separation, and secure API using JWT and Joi validation. Server-side rendered with EJS and wired to the API via `fetch`.

## Features

- ✅ User signup and login (JWT)
- 🧭 MVC structure: controllers, routes, middleware, views
- 📝 Todos: create, read, update, delete, clear
- 🔐 Authorization via `Authorization: Bearer <token>`
- 🧪 Robust input validation with Joi
- 🎨 EJS-based modern UI (dark theme)
- 📁 JSON file storage in `data/`

## Tech Stack

- `express` for the server
- `ejs` for server-side rendering
- `jsonwebtoken` for JWT
- `bcryptjs` for password hashing
- `joi` for validation
- `uuid` for IDs

## Project Structure

```
personal-todo-manager/
├── app.js
├── controller/
│   ├── authController.js
│   └── todoController.js
├── route/
│   ├── auth.js
│   ├── todo.js
│   └── web.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── validation/
│   └── schemas.js
├── views/
│   ├── pages/
│   │   ├── home.ejs
│   │   ├── login.ejs
│   │   ├── signup.ejs
│   │   ├── dashboard.ejs
│   │   └── profile.ejs
│   └── partials/
│       ├── head.ejs
│       └── foot.ejs
├── public/
│   ├── css/styles.css
│   └── js/app.js
├── data/
│   ├── user.json
│   └── todo.json
└── utils/fileUtils.js
```

## Setup

1. Install dependencies:
   
   ```bash
   npm install
   ```

2. Environment variables (optional but recommended):
   - Create `.env` and set `JWT_SECRET`:
   
   ```bash
   JWT_SECRET=your-strong-secret
   ```

3. Run the server:
   
   ```bash
   npm start
   # or for auto-reload (if available)
   npm run dev
   ```

4. Open the app:
   - Web UI: `http://localhost:3000/`
   - API docs: `http://localhost:3000/api`

## Web Pages (EJS)

- `GET /` — Home
- `GET /login` — Login page
- `GET /signup` — Signup page
- `GET /dashboard` — Todos UI (requires token in localStorage)
- `GET /profile` — Profile UI (requires token in localStorage)

Client-side logic is in `public/js/app.js` and uses `localStorage` to store the JWT token.

## API Endpoints

- Auth
  - `POST /api/auth/signup` → `{ username, password }`
  - `POST /api/auth/login` → `{ username, password }`
  - `GET /api/auth/profile` → requires `Authorization: Bearer <token>`
  - `POST /api/auth/logout` → requires `Authorization: Bearer <token>`

- Todos (all require `Authorization: Bearer <token>`) 
  - `GET /api/todos`
  - `POST /api/todos` → `{ text }`
  - `PUT /api/todos/:id` → `{ text? , completed? }`
  - `DELETE /api/todos/:id`
  - `DELETE /api/todos` (clear all user todos)

## Validation (Joi)

- `validation/schemas.js` defines:
  - `userSignupSchema`, `userLoginSchema`
  - `todoCreateSchema`, `todoUpdateSchema`
  - `idParamSchema`
- `middleware/validation.js` provides:
  - `validateBody(schema)`, `validateParams(schema)`

## MVC Overview

- Controllers in `controller/` contain business logic
- Routes in `route/` register endpoints and attach middleware
- Middleware in `middleware/` handles auth and validation
- Views in `views/` render EJS pages and include partials
- Static assets in `public/` serve CSS and JS

## Data Storage

- `data/user.json` — users
- `data/todo.json` — todos

