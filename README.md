# ElderShield AI 🛡️

> **Explainable scam-risk detection platform designed to protect elderly users from fraudulent messages, phishing URLs, and deceptive phone calls.**

---

## ✨ Features

- 🔍 **Message Scanner** — Paste any SMS/WhatsApp text for instant risk analysis
- 🔗 **Link Scanner** — Detect typosquatting, phishing URLs, unsafe domains
- 📞 **Call Transcript Scanner** — Analyze suspicious call scripts (digital arrest, courier scams)
- 🎙️ **Voice Assistant** — Hands-free scanning using Web Speech API
- 📊 **Explainable Risk Engine** — 10 signal types with plain-language evidence
- 👨‍👩‍👧 **Trusted Contacts** — Auto-alert family/caregivers on HIGH-risk detections
- 🔐 **Admin Portal** — User management, analytics, audit logs
- ♿ **Elder Accessibility** — Large fonts, high contrast, focus rings

---

## 🚀 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@eldershield.ai | `Admin@12345` |
| **Demo Elder User** | mahalakshmi@example.com | `ElderShield@2026` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (via Node.js built-in `node:sqlite`) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | Sonner |

---

## 🏃 Run Locally

### Prerequisites
- Node.js 22 or higher
- npm

### Backend
```bash
cd backend
npm install
npm run seed      # Creates DB + demo data
npm run dev       # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## ☁️ Deploy

### Backend → Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo: `Mahalakshmi60-creator/ElderShield`
3. Set **Root Directory** → `backend`
4. **Build Command**: `npm install && npm run build && npm run seed-prod`
5. **Start Command**: `npm start`
6. Add a **Disk** (mount path: `/opt/render/project/src/backend/data`, size: 1 GB)
7. Set **Environment Variables**:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = _(generate a random string)_
   - `DATABASE_PATH` = `./data/eldershield.db`
   - `FRONTEND_URL` = _(your Vercel URL, e.g. https://eldershield-ai.vercel.app)_
8. Deploy → note your backend URL (e.g. `https://eldershield-backend.onrender.com`)

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import repo: `Mahalakshmi60-creator/ElderShield`
3. Set **Root Directory** → `frontend`
4. **Framework Preset**: Vite
5. Add **Environment Variable**:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
6. Deploy → get your public URL (e.g. `https://eldershield-ai.vercel.app`)

---

## 📁 Project Structure

```
ElderShield/
├── backend/
│   ├── src/
│   │   ├── config/database.ts       # SQLite schema (node:sqlite)
│   │   ├── controllers/             # auth, scan, contact, admin
│   │   ├── middleware/              # auth, admin, rate-limit, error
│   │   ├── routes/                  # REST API routes
│   │   ├── services/
│   │   │   ├── risk.service.ts      # Explainable scam risk engine
│   │   │   └── link.service.ts      # URL / phishing analysis
│   │   ├── utils/                   # jwt, password, logger
│   │   └── scripts/seed.ts          # Demo data seeder
│   └── data/                        # SQLite DB (gitignored, auto-created)
└── frontend/
    └── src/
        ├── pages/                   # 19 pages (Landing, Auth, Dashboard, etc.)
        ├── components/layout/       # AppLayout, AdminLayout, ProtectedRoute
        ├── components/scanner/      # RiskResult card
        ├── context/                 # AuthContext, AppContext
        └── services/                # api.ts, auth/scan/contact/admin services
```

---

## 🧠 Risk Engine Signals

| Signal | Severity | Example |
|--------|----------|---------|
| Urgency / Account Suspension | 🔴 High | "Your account will be BLOCKED today" |
| Credential Harvesting | 🔴 High | "Share your OTP / PIN / CVV" |
| Financial Demand | 🔴 High | "Transfer ₹50,000 immediately" |
| Authority Impersonation | 🔴 High | "Inspector from CBI / TRAI / RBI" |
| Remote Access Request | 🔴 High | "Install AnyDesk / TeamViewer" |
| Typosquatting Domain | 🔴 High | `sbi-kyc-update-portal.xyz` |
| Bank Impersonation | 🟡 Medium | "SBI Customer / HDFC Alert" |
| Suspicious Link | 🟡 Medium | `bit.ly/...` or `.top` / `.click` domains |
| Urgency Deadline | 🟡 Medium | "Before 9:30 PM tonight" |
| Fake Prize / Reward | 🟡 Medium | "You have won ₹10 lakh lottery" |

**Risk Levels:**
- ✅ **LOW** (0–29): No significant threats detected
- ⚠️ **SUSPICIOUS** (30–59): Review carefully before acting
- 🚨 **HIGH** (60–100): Do NOT proceed — trusted contacts alerted

---

## 📄 License

MIT — Built for the ElderShield AI Hackathon 2026.
