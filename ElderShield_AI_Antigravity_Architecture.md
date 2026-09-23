# ElderShield AI — Full-Stack Application Architecture
## Antigravity Build Specification

> **Project:** ElderShield AI  
> **Purpose:** An elder-friendly scam-risk detection platform for suspicious messages, URLs, and call transcripts.  
> **Primary goal:** Build a polished, production-style web application with authentication, an elderly-friendly dashboard, explainable scam-risk analysis, history, trusted contacts, and an admin/backend view where authorized administrators can see registered-user information and system activity.

---

# 1. Product Vision

ElderShield AI should help an elderly user answer:

> **“Could this message, link, or call be dangerous?”**

The system must NOT claim that an AI prediction is absolute proof of fraud. It should present a **risk assessment**, the evidence behind it, and safe next steps.

Example:

### HIGH RISK
**Potential Bank/KYC scam**

Reasons:
- Urgent account-blocking language detected
- Sensitive information requested
- Suspicious external link detected
- Claimed organization could not be verified

Recommended action:
- Do not click the link
- Do not share OTP/PIN/password
- Verify using the organization's official app or website

---

# 2. Core User Flow

```text
Landing Page
     |
     v
Create Account / Sign In
     |
     v
Authentication
     |
     v
Onboarding (first login only)
     |
     v
User Dashboard
     |
     +--> Check Message
     |
     +--> Check Link
     |
     +--> Check Call / Transcript
     |
     +--> Voice Assistant
     |
     +--> Scan History
     |
     +--> Trusted Contacts
     |
     +--> Profile / Settings
     |
     +--> Logout
```

---

# 3. Authentication Requirement

The user MUST create an account before accessing the main application.

## Registration

Fields:

- Full name
- Email
- Phone number
- Password
- Confirm password
- Preferred language
- Optional trusted-contact details
- Terms/privacy consent

Validation:
- Required fields
- Valid email
- Valid phone
- Strong password
- Password confirmation
- Duplicate email prevention

## Login

Fields:
- Email
- Password

Features:
- Remember me
- Forgot password
- Show/hide password
- Clear validation messages

After successful login:
- Store authentication state securely
- Redirect to `/dashboard`
- Show user's name/avatar in the application shell

Unauthenticated users must not be able to access protected dashboard routes.

---

# 4. Frontend Technology

Recommended:

- React
- Vite
- JavaScript or TypeScript
- React Router
- Tailwind CSS
- Lucide React icons
- Recharts
- Axios
- React Hook Form
- Zod
- Sonner or equivalent toast system

If TypeScript is used, use it consistently across the frontend.

---

# 5. Frontend UI/UX

The UI must look like a real modern SaaS/security product, NOT a basic college CRUD application.

## Design principles

- Elder-friendly
- Large readable typography
- High contrast
- Large clickable buttons
- Simple language
- Minimal clutter
- Strong visual hierarchy
- Responsive desktop/tablet/mobile
- Accessible keyboard navigation
- Clear focus states
- Avoid tiny text
- Avoid excessive animations
- Use icons with labels
- Use confirmation dialogs for destructive actions

## Visual direction

Use a modern security + healthcare-inspired visual language.

Suggested style:
- Clean white/light background
- Deep navy/blue primary accents
- Green for low risk
- Amber/orange for suspicious
- Red for high risk
- Soft cards
- Rounded corners
- Subtle shadows
- Glass/gradient accents only where useful
- Professional dashboard charts

Do not make every screen overly colorful.

---

# 6. Application Layout

After login, use a persistent application shell.

```text
+--------------------------------------------------------------+
| ElderShield AI        Search        Notifications   Avatar   |
+----------------+---------------------------------------------+
|                |                                             |
| Sidebar        |                Main Content                  |
|                |                                             |
| Dashboard      |                                             |
| Check Message  |                                             |
| Check Link     |                                             |
| Check Call     |                                             |
| Voice Assistant|                                             |
| History        |                                             |
| Contacts       |                                             |
| Profile        |                                             |
| Settings       |                                             |
|                |                                             |
|----------------|                                             |
| Help           |                                             |
| Logout         |                                             |
+----------------+---------------------------------------------+
```

## Sidebar

Desktop:
- Collapsible sidebar
- Icon + label
- Active route indicator

Mobile:
- Hamburger menu
- Slide-out drawer

Sidebar items:

1. Dashboard
2. Check Message
3. Check Link
4. Check Call
5. Voice Assistant
6. Scan History
7. Trusted Contacts
8. Profile
9. Settings
10. Help
11. Logout

---

# 7. Required Frontend Pages

## Public pages

```text
/
 /about
 /how-it-works
 /contact
 /login
 /register
 /forgot-password
 /reset-password
 /privacy
 /terms
```

## Protected user pages

```text
/dashboard
/check-message
/check-link
/check-call
/voice-assistant
/history
/contacts
/profile
/settings
/help
```

## Admin pages

```text
/admin
/admin/users
/admin/users/:id
/admin/scans
/admin/alerts
/admin/analytics
/admin/settings
```

---

# 8. Landing Page

Create a polished landing page.

Hero:

> **Stay One Step Ahead of Scams.**

Subtitle:

> ElderShield AI helps you understand suspicious messages, links, and calls before you act.

Buttons:
- Get Started
- Sign In

Sections:
- How it works
- Why ElderShield
- Scam categories
- Explainable risk assessment
- Trusted contact protection
- Privacy/security
- FAQ
- Footer

Do not claim 100% scam detection.

---

# 9. Registration Page

Use a polished two-column layout on desktop.

Left:
- ElderShield branding
- Illustration/abstract security visual
- Short safety message

Right:
- Registration form

After registration:
- Show success state
- Automatically authenticate if appropriate
- Redirect to onboarding/dashboard

---

# 10. Onboarding

First-time users see a short onboarding wizard.

Step 1:
- Name
- Preferred language

Step 2:
- Trusted contact setup

Step 3:
- Explain Message Scanner

Step 4:
- Explain Risk Levels

Allow:
- Skip
- Back
- Continue
- Finish

Save onboarding completion to user profile.

---

# 11. Dashboard

Dashboard should immediately answer:

> “Am I safe and what can I check?”

Top:

```text
Good evening, Mahalakshmi 👋
We're here to help you stay safe online.
```

Main cards:

- Check a Message
- Check a Link
- Check a Call

Statistics:

- Scans performed
- High-risk alerts
- Suspicious items
- Safe checks

Recent scans table/list:
- Date
- Type
- Risk
- Category
- View details

Risk overview chart:
- Low
- Medium
- High

Trusted contact status:
- Configured / Not configured

Safety tip card:
- One short actionable cyber-safety tip

---

# 12. Message Scanner

Route:

`/check-message`

UI:

```text
Check a Message

Paste the SMS / WhatsApp message here

[ Large textarea ]

[ Analyze Message ]
```

Optional:
- Upload screenshot
- Clear
- Example message

After analysis:

```text
Risk Assessment
----------------
HIGH RISK

Risk score: 86/100

Potential category:
Bank / KYC impersonation

Why?
✓ Urgency detected
✓ Sensitive information requested
✓ External link detected
✓ Organization claim could not be verified

What to do:
1. Do not click the link.
2. Do not share OTP/PIN/password.
3. Verify using the official organization app/site.
```

Use an attractive result card.

---

# 13. Link Scanner

Route:

`/check-link`

Input:

```text
Paste a suspicious URL

[ URL input ]

[ Analyze Link ]
```

Display:

- URL
- Domain
- HTTPS status
- Domain risk indicators
- Organization/domain mismatch
- Known-threat lookup result if available
- Redirect information if supported
- Risk score
- Explanation
- Recommended action

Never automatically open dangerous URLs in the user's browser.

---

# 14. Call / Transcript Scanner

Route:

`/check-call`

For the first version, DO NOT attempt to intercept real phone calls.

Support:
- Paste transcript
- Upload audio if speech-to-text is implemented
- Record short voice sample if supported

Flow:

```text
Call / Transcript
       |
       v
Speech-to-text (optional)
       |
       v
Scam-risk analysis
       |
       v
Explainable result
```

Detect:
- Impersonation
- Threats
- Urgency
- OTP/password requests
- Money transfer requests
- Remote-access requests
- Fake government/bank/support claims

---

# 15. Voice Assistant

Route:

`/voice-assistant`

Large microphone interface.

User can say:

> “Someone called saying they are from my bank and asked for my OTP. What should I do?”

System converts speech to text and analyzes it.

Response should be simple and spoken/displayed:

> “This call contains several high-risk signs. Do not share your OTP. End the call and contact your bank using an official number.”

Support English first.

Design architecture so Tamil/Hindi/etc. can be added later.

---

# 16. Risk Engine

The risk engine is the core backend logic.

It should combine multiple signals rather than relying only on keywords.

Possible signals:

### Message signals
- Urgency
- Threat
- Financial request
- Sensitive-information request
- Credential request
- OTP request
- Impersonation
- Suspicious offer
- Emotional manipulation
- External link
- Grammar/format anomalies
- Scam-pattern similarity

### URL signals
- HTTPS
- Domain age/reputation where available
- Look-alike domain
- Suspicious TLD
- URL shortening
- Excessive redirects
- Domain/claimed-brand mismatch
- Known threat intelligence result

### Call signals
- Impersonation
- Threat
- Urgency
- Payment request
- OTP/PIN/password request
- Remote-access request
- Sensitive-data request

---

# 17. Risk Scoring

Do NOT treat the score as proof of fraud.

Example conceptual score:

```text
0–30    LOW RISK
31–60   SUSPICIOUS
61–100  HIGH RISK
```

The exact weights should be configurable on the backend.

Example:

```text
Urgency                  +15
Threat                   +20
OTP request              +20
Suspicious URL           +20
Financial request        +15
Impersonation            +20
Known malicious indicator+30
```

Cap final score at 100.

The system should store:
- score
- risk level
- category
- detected signals
- explanation
- recommended actions
- model/version metadata

---

# 18. Explainability

Every result must explain WHY the system produced the risk assessment.

Example JSON:

```json
{
  "riskScore": 86,
  "riskLevel": "HIGH",
  "category": "BANK_KYC",
  "signals": [
    {
      "type": "urgency",
      "label": "Urgent deadline detected",
      "severity": "high"
    },
    {
      "type": "credential_request",
      "label": "Sensitive information requested",
      "severity": "high"
    },
    {
      "type": "suspicious_url",
      "label": "Suspicious external link detected",
      "severity": "high"
    }
  ],
  "recommendedActions": [
    "Do not click the link",
    "Do not share OTP, PIN or password",
    "Verify through the official organization website or app"
  ]
}
```

---

# 19. Scam Categories

Create a configurable category system:

```text
BANK_KYC
COURIER
GOVERNMENT_IMPERSONATION
ELECTRICITY_UTILITY
JOB_SCAM
INVESTMENT
SHOPPING
TECH_SUPPORT
FAMILY_EMERGENCY
LOTTERY_PRIZE
LOAN
SOCIAL_MEDIA
ROMANCE
OTHER
```

---

# 20. Backend Technology

Recommended:

- Node.js
- Express.js
- TypeScript
- MySQL
- Sequelize or Prisma
- JWT authentication
- bcrypt/argon2 password hashing
- Helmet
- CORS
- express-rate-limit
- Zod/Joi validation
- Winston/Pino logging

AI analysis can be implemented as:

Option A:
- Node.js calls an AI API

Option B:
- Node.js calls a Python FastAPI AI service

Recommended architecture for the hackathon:

```text
React Frontend
      |
      v
Node.js / Express API
      |
      +-------- MySQL
      |
      +-------- Risk Engine
      |
      +-------- AI Service
      |
      +-------- URL/Threat Intelligence APIs
```

---

# 21. Backend Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── security.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── scan.controller.ts
│   │   ├── message.controller.ts
│   │   ├── link.controller.ts
│   │   ├── call.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── history.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── TrustedContact.ts
│   │   ├── Scan.ts
│   │   ├── ScanSignal.ts
│   │   ├── ScamCategory.ts
│   │   ├── Alert.ts
│   │   └── AuditLog.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── scan.routes.ts
│   │   ├── message.routes.ts
│   │   ├── link.routes.ts
│   │   ├── call.routes.ts
│   │   ├── contact.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── message.service.ts
│   │   ├── link.service.ts
│   │   ├── call.service.ts
│   │   ├── risk.service.ts
│   │   ├── explanation.service.ts
│   │   ├── notification.service.ts
│   │   └── threatIntel.service.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── logger.ts
│   │   └── validators.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/ or migrations/
├── tests/
├── .env.example
├── package.json
└── README.md
```

---

# 22. Frontend Folder Structure

```text
frontend/
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── MobileSidebar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── PasswordField.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── RiskChart.tsx
│   │   │   ├── RecentScans.tsx
│   │   │   └── SafetyTip.tsx
│   │   │
│   │   ├── scanner/
│   │   │   ├── MessageScanner.tsx
│   │   │   ├── LinkScanner.tsx
│   │   │   ├── CallScanner.tsx
│   │   │   ├── RiskResult.tsx
│   │   │   ├── RiskBadge.tsx
│   │   │   └── EvidenceList.tsx
│   │   │
│   │   ├── contacts/
│   │   ├── profile/
│   │   └── common/
│   │
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CheckMessage.tsx
│   │   ├── CheckLink.tsx
│   │   ├── CheckCall.tsx
│   │   ├── VoiceAssistant.tsx
│   │   ├── History.tsx
│   │   ├── Contacts.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── Help.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── scan.service.ts
│   │   ├── contact.service.ts
│   │   └── user.service.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useScan.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validation.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── .env.example
├── package.json
└── README.md
```

---

# 23. Database Design

Use MySQL.

## users

```text
id
full_name
email
phone
password_hash
role
preferred_language
avatar_url
onboarding_completed
is_active
created_at
updated_at
last_login_at
```

Roles:

```text
USER
ADMIN
```

## trusted_contacts

```text
id
user_id
name
email
phone
relationship
is_active
created_at
updated_at
```

## scans

```text
id
user_id
scan_type
input_hash
risk_score
risk_level
category
summary
created_at
```

Never store raw sensitive input longer than necessary. Prefer storing a privacy-safe representation/hash unless the user explicitly chooses history storage.

## scan_signals

```text
id
scan_id
signal_type
label
severity
evidence
created_at
```

## alerts

```text
id
user_id
scan_id
trusted_contact_id
alert_type
status
message
created_at
```

## audit_logs

```text
id
actor_user_id
action
target_type
target_id
metadata
created_at
```

---

# 24. Important User Privacy Requirement

The admin dashboard must NOT expose unnecessary sensitive message contents.

Admin should primarily see:

- User name
- Email
- Phone (with appropriate masking where possible)
- Account creation date
- Last login
- Number of scans
- Risk-level counts
- Account status
- Alerts

Do not automatically expose the user's private message/call content to administrators.

Only authorized administrators should access administrative information.

---

# 25. Admin Dashboard

Route:

`/admin`

Create a separate admin layout.

Sidebar:

```text
Admin Dashboard
Users
Scans
Alerts
Analytics
System Settings
Audit Logs
Logout
```

Dashboard cards:

```text
Total Users
Active Users
Total Scans
High-Risk Alerts
```

Charts:

- Scans over time
- Risk-level distribution
- Scam-category distribution
- Daily/weekly activity

---

# 26. Admin Users Page

Table:

```text
Name
Email
Phone
Role
Joined
Last Login
Total Scans
High-Risk Alerts
Status
Actions
```

Actions:
- View profile
- Disable account
- Enable account
- View activity summary

Admin must NOT see passwords.

Passwords must always be stored as secure hashes.

---

# 27. Admin User Detail Page

Display:

```text
User Profile
-----------------
Name
Email
Phone
Language
Joined
Last login
Account status

Activity
-----------------
Total scans
Low-risk
Suspicious
High-risk

Recent activity
-----------------
Date
Type
Risk
Category
```

Again, minimize exposure of private scan content.

---

# 28. API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

## User

```text
GET   /api/users/me
PUT   /api/users/me
PUT   /api/users/me/password
```

## Message

```text
POST /api/scans/message
```

## Link

```text
POST /api/scans/link
```

## Call

```text
POST /api/scans/call
```

## History

```text
GET /api/scans
GET /api/scans/:id
```

## Trusted Contacts

```text
GET    /api/contacts
POST   /api/contacts
PUT    /api/contacts/:id
DELETE /api/contacts/:id
```

## Admin

```text
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/users/:id
GET /api/admin/scans
GET /api/admin/alerts
GET /api/admin/analytics
GET /api/admin/audit-logs
```

---

# 29. Authentication Security

Implement:

- Password hashing
- JWT access token
- Secure token handling
- Protected routes
- Role-based authorization
- Rate limiting
- Input validation
- SQL injection protection through ORM/parameterized queries
- XSS-safe rendering
- CORS configuration
- Helmet security headers
- No passwords in logs
- No passwords in database
- No sensitive data in frontend local storage unless necessary

---

# 30. AI Service Option

If using a separate Python service:

```text
ai-service/
├── app/
│   ├── main.py
│   ├── models/
│   ├── services/
│   │   ├── text_analyzer.py
│   │   ├── url_analyzer.py
│   │   ├── risk_engine.py
│   │   └── explanation.py
│   ├── schemas/
│   └── utils/
├── tests/
├── requirements.txt
└── README.md
```

Endpoint:

```text
POST /analyze/text
POST /analyze/url
POST /analyze/call
```

The Node backend communicates with this service.

For the first working prototype, a deterministic rule engine + AI-assisted classification is acceptable. Keep the interfaces modular so a trained ML model can replace the classifier later.

---

# 31. Recommended MVP

Build in this order:

### Phase 1 — Foundation
- React/Vite frontend
- Node/Express backend
- MySQL
- Authentication
- Register
- Login
- Logout
- Protected routes
- Sidebar
- User profile

### Phase 2 — Main dashboard
- Dashboard cards
- Recent scans
- Risk chart
- Safety tips

### Phase 3 — Core scanner
- Message scanner
- Risk engine
- Explainable results
- History

### Phase 4 — URL scanner
- URL extraction
- Domain checks
- Risk result

### Phase 5 — Call scanner
- Transcript input
- Optional speech-to-text
- Risk analysis

### Phase 6 — Trusted contacts
- Add/edit/delete contact
- High-risk alert

### Phase 7 — Admin
- Admin login/role
- User list
- User activity
- Analytics
- Alerts
- Audit logs

### Phase 8 — Polish
- Responsive design
- Animations
- Accessibility
- Error handling
- Loading states
- Empty states
- Toast notifications
- Demo data
- Deployment

---

# 32. Error and Loading States

Every asynchronous operation must have:

- Loading spinner/skeleton
- Success state
- Error state
- Retry button
- Empty state

Example:

```text
Analyzing your message...
Please wait.
```

Do not freeze the UI.

---

# 33. Demo Mode

Create a demo section for hackathon presentation.

Include sample inputs:

1. Fake bank KYC message
2. Courier payment scam
3. Fake government call
4. Fake job offer
5. Genuine utility message

This allows the judges to test the system quickly.

---

# 34. Environment Variables

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Backend:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=

JWT_SECRET=

AI_SERVICE_URL=

THREAT_INTEL_API_KEY=

FRONTEND_URL=http://localhost:5173
```

Never commit `.env`.

Provide `.env.example`.

---

# 35. Root Project Structure

```text
eldershield-ai/
│
├── frontend/
├── backend/
├── ai-service/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── demo.md
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

# 36. README Requirements

README must contain:

- Project overview
- Problem statement
- Features
- Architecture diagram
- Technology stack
- Folder structure
- Installation
- Environment variables
- Database setup
- Running frontend
- Running backend
- Running AI service
- API documentation
- Demo credentials
- Screenshots section
- Future enhancements

---

# 37. Antigravity Implementation Instructions

Build the application incrementally but ensure the final result is fully connected.

IMPORTANT:

1. Do not create only static frontend pages.
2. Authentication must actually work.
3. Registration must save users to MySQL.
4. Login must verify the stored password hash.
5. Dashboard must load the logged-in user's data from the backend.
6. The user's name/avatar must appear in the topbar/sidebar.
7. Protected routes must reject unauthenticated users.
8. Admin routes must reject normal users.
9. Scans must be associated with the logged-in user.
10. History must come from the backend/database.
11. Admin dashboard must display registered-user information from the backend.
12. Do not expose passwords.
13. Keep user private scan content protected.
14. Use realistic loading, error and empty states.
15. Make the UI responsive.
16. Use reusable components.
17. Avoid duplicate code.
18. Keep secrets in environment variables.
19. Include seed/demo data only where clearly marked.
20. Ensure the entire project can run locally using documented commands.

---

# 38. Final Expected Experience

A new visitor:

```text
Landing Page
     ↓
Create Account
     ↓
Account successfully created
     ↓
Login / automatic authenticated session
     ↓
Onboarding
     ↓
Dashboard
```

A returning user:

```text
Landing/Login
     ↓
Login
     ↓
Dashboard
     ↓
Check Message
     ↓
AI/Risk Analysis
     ↓
Explainable Result
     ↓
Safety Guidance
     ↓
Optional Trusted Contact Alert
     ↓
Scan saved to History
```

An administrator:

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Registered Users
     ↓
User activity statistics
     ↓
Scans / Alerts / Analytics / Audit Logs
```

---

# 39. Future Enhancements

Possible later additions:

- Tamil/Hindi and other Indian languages
- Real-time voice conversation
- Browser extension
- Mobile application
- WhatsApp share integration where permitted
- OCR for screenshot-based scam detection
- Better threat-intelligence integration
- ML model trained on scam datasets
- Personalized scam education
- Family dashboard
- Emergency assistance workflow
- On-device inference for privacy

---

# 40. Important Product Positioning

Do not describe ElderShield as:

> "An AI that knows whether a message is definitely a scam."

Describe it as:

> **"An explainable AI-powered scam-risk assistant designed to help elderly users recognize suspicious communications and take safer actions before they click, pay, or share sensitive information."**

The system provides **risk assessment + evidence + guidance**, not guaranteed fraud determination.
