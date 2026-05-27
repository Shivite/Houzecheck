PROJECT STRUCTURE
root/
│
├── client/                → React frontend
│   ├── src/
│   │   ├── pages/         → Main screens (Dashboard)
│   │   ├── hooks/         → Custom hooks (useSSE)
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│
├── server/                → Node + Express backend
│   ├── server.js
│
├── .gitignore             → Root ignore rules
└── README.md              → Setup + flow + features

---------------------------------------------------

pages/
Dashboard.tsx → Main UI (rating system + live dashboard)
hooks/
useSSE.ts → Handles real-time connection using EventSource
App.tsx
Entry point
Controls start screen + routing logic

---------------------------------------------------

CLIENT (Frontend)

Frontend only:

React code
UI (Dashboard, components)
Toast notifications (react-toastify)
SSE connection (useSSE hook)

---------------------------------------------------


SERVER (Backend)

Backend only:

Node + Express API
REST endpoint /rate
SSE endpoint /events
Real-time score calculation
Broadcasting updates to all clients

---------------------------------------------------

HOW TO RUN PROJECT (AFTER CLONE)
git clone git@github.com:Shivite/Houzecheck.git
cd my-react-app

---------------------------------------------------

FRONTEND SETUP
cd client
npm install
Create .env file inside client/
REACT_APP_API_URL=http://localhost:5000
npm start

Runs on: http://localhost:3000


---------------------------------------------------

BACKEND SETUP
cd server
npm install
Create .env file inside server/
PORT=5000
CLIENT_URL=http://localhost:3000
npm start

---------------------------------------------------


WORKING FLOW
Frontend (React - 3000)
        ↓
POST /rate (user rating / join)
        ↓
Backend (Node - 5000)
        ↓
Updates score + average
        ↓
SSE broadcasts update
        ↓
All connected clients get live updates instantly

Note: When new user join. A notification toast notificaiton will popup for all other users.


