# 📁 Project Structure

## Root
```
root/
│
├── client/                # React frontend
├── server/                # Node + Express backend
├── .gitignore
└── README.md
```

---

## Frontend (client)

### Structure
```
client/src/
├── pages/        # Main screens (Dashboard)
├── hooks/        # Custom hooks (useSSE)
├── App.tsx       # App entry logic
├── main.tsx      # React entry point
└── index.css
```

### Responsibilities
- UI rendering (Dashboard, components)
- Toast notifications (react-toastify)
- SSE connection via `useSSE`

---

## Backend (server)

### Structure
```
server/
└── server.js
```

### Responsibilities
- REST API (`/rate`)
- SSE endpoint (`/events`)
- Score calculation
- Broadcasting updates to clients

---

## How to Run

### Clone repo
```bash
git clone git@github.com:Shivite/Houzecheck.git
cd my-react-app
```

---

### Frontend
```bash
cd client
npm install
npm start
```

Runs on: http://localhost:3000

---

### Backend
```bash
cd server
npm install
npm start
```

Runs on: http://localhost:5000

---

## Working Flow

```
Frontend (React :3000)
        ↓
POST /rate
        ↓
Backend (Node :5000)
        ↓
Update score + average
        ↓
SSE broadcast update
        ↓
All clients receive live updates
```

---

## Feature Note

When a new user joins, a toast notification is broadcast to all connected users in real-time.