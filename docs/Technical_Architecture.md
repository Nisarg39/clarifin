# Clarifin — Technical Architecture

> **Version:** 1.0 (May 2026)
> **Purpose:** Defines the full technical stack, project structure, API design, database collections, and RAG pipeline for the Clarifin app.

---

## 1. Confirmed Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Mobile App | React Native Expo | Single codebase → Android + iOS. EAS Build → `.aab` for Play Store |
| Backend | Node.js + Express.js | Nash's expertise. Lightweight REST API |
| Database | MongoDB Atlas | Flexible document schema. Built-in Vector Search for RAG |
| Vector Search | MongoDB Atlas Vector Search | Same cluster as DB — no separate service |
| AI | OpenAI / Anthropic Claude API | Via backend proxy only — never called from Expo client |
| Payments | RevenueCat | Handles Play Store + App Store billing |
| Auth | TBD (Clerk or Supabase Auth) | Must be Expo-compatible |
| Backend Hosting | TBD (Railway / Render) | Node.js + Express deployment |

---

## 2. Project Structure

```
clarifin/
├── app/                        # React Native Expo
│   ├── app/                    # Expo Router screens
│   │   ├── (tabs)/
│   │   │   ├── index.tsx       # Home
│   │   │   ├── explore.tsx     # Instrument Explorer
│   │   │   ├── chat.tsx        # AI Chatbot
│   │   │   └── profile.tsx     # User Profile
│   │   └── instrument/
│   │       └── [id].tsx        # Instrument Detail
│   ├── components/
│   ├── hooks/
│   └── constants/
│
├── backend/                    # Node.js + Express.js
│   ├── routes/
│   │   ├── instruments.js
│   │   ├── chat.js
│   │   └── user.js
│   ├── controllers/
│   │   ├── instrumentsController.js
│   │   ├── chatController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js             # Auth token verification
│   │   ├── rateLimit.js        # Chat endpoint rate limiting
│   │   ├── jailbreakDetect.js  # Pre-LLM jailbreak check
│   │   └── outputFilter.js     # Post-LLM moderation
│   ├── services/
│   │   ├── ragService.js       # RAG pipeline
│   │   ├── aiService.js        # OpenAI / Claude API calls
│   │   └── complianceService.js # 3-month lag gate
│   ├── models/
│   │   ├── Instrument.js
│   │   ├── InstrumentPerformance.js
│   │   ├── InstrumentDerived.js
│   │   ├── User.js
│   │   └── ChatHistory.js
│   ├── scripts/
│   │   └── seed.js             # Seeds instruments + performance data
│   └── server.js
│
└── docs/                       # Planning documents
```

---

## 3. MongoDB Collections

Five collections. Schemas defined in referenced docs.

### `instruments`
45 fields per instrument. Identity, returns, risk, liquidity, cost, investment size, tenure, taxation, horizon, goal & profile fields.
Schema reference: `Investment_Data_Schema.md` → Category 1A

### `instrument_performance`
Year-on-year return record per instrument. One document per instrument per FY (e.g. PPF FY2024).
Schema reference: `Investment_Data_Schema.md` → Collection: instrument_performance

### `instrument_derived`
Pre-computed CAGR, volatility, real return, best/worst year per instrument.
Rebuilt every April. Never computed on-the-fly at query time.
Schema reference: `Investment_Data_Schema.md` → Category 1B

### `users`
User profile fields + app state (subscription tier, question counter, consent flag).
Schema reference: `User_Data_Schema.md`

### `chat_history`
One document per message. Retained ≥ 5 years (SEBI IA/RA best practice).

```
{
  user_id: string,
  session_id: string,
  role: "user" | "assistant",
  content: string,
  timestamp: date,
  rag_sources: string[],      // instrument_ids used to answer
  moderation_passed: boolean,
  compliance_footer_appended: boolean
}
```

---

## 4. API Endpoints

### Instruments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/instruments` | List all instruments. Supports query filters: `risk_level`, `goal_tags`, `asset_class`, `lock_in_max_years` |
| GET | `/api/instruments/:id` | Single instrument — all Category 1A fields + `special_features[]` |
| GET | `/api/instruments/compare` | Compare 2–4 instruments by `instrument_id[]`. Returns Category 1A + 1B fields side by side |
| GET | `/api/instruments/:id/performance` | FY-by-FY return history. Enforces 3-month lag gate server-side |

### Chat

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Main chatbot endpoint. Rate limited. Full RAG + moderation pipeline. |
| GET | `/api/chat/history` | Paginated chat history for authenticated user |

### User

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/profile` | Fetch user profile fields |
| PUT | `/api/user/profile` | Update profile fields |
| GET | `/api/user/subscription` | Check tier, questions remaining this month |
| DELETE | `/api/user/data` | Full data erasure (DPDP right to erasure — target ≤ 7 days) |

---

## 5. RAG Pipeline (Chat Endpoint)

Every POST `/api/chat` goes through this pipeline in order:

```
1. Auth check
        ↓
2. Rate limit check (free: 20/month, paid: unlimited)
        ↓
3. Jailbreak detection — regex + keyword scan on user message
   → Block if detected. Return refusal template. Log attempt.
        ↓
4. Embed user question → OpenAI text-embedding-3-small
        ↓
5. Atlas Vector Search on instrument special_features[] embeddings
   → top-k = 5 most semantically relevant sentences
        ↓
6. Fetch structured context from instruments collection
   → instrument_id matches from vector search
   → relevant Category 1A fields + instrument_derived stats
        ↓
7. Assemble full prompt:
   [AI_Agent_System_Prompt] +
   [User profile context — paid tier only] +
   [RAG retrieved text] +
   [Structured instrument stats] +
   [User question]
        ↓
8. Call AI API (OpenAI / Claude)
        ↓
9. Post-generation moderation:
   Step 1 — Regex blocklist (buy/sell/hold/recommend/guaranteed)
   Step 2 — LLM judge: "Does this contain advice or return promise?"
   → Fail either step → return refusal template
        ↓
10. Append mandatory compliance footer (server-side, not from AI)
        ↓
11. Save to chat_history collection
        ↓
12. Return response to client
```

---

## 6. SEBI Compliance Gates (Server-Side)

These must run server-side — never client-side:

| Gate | Where | Rule |
|---|---|---|
| 3-month data lag | `GET /api/instruments/:id/performance` | Check `data_as_of_date`. Block if `lag_months < 3`. |
| Jailbreak detection | `POST /api/chat` — Step 3 | Block before LLM call |
| Output moderation | `POST /api/chat` — Step 9 | Regex + LLM judge after generation |
| System prompt injection | `POST /api/chat` — Step 7 | Full `AI_Agent_System_Prompt.md` prepended on every call — no session caching |
| Compliance footer | `POST /api/chat` — Step 10 | Appended server-side, never from AI output |
| Rate limiting | `POST /api/chat` — Step 2 | Prevents abuse and prompt injection attacks |

---

## 7. Expo App — Key Rules

- **No API keys in Expo client.** All AI/DB calls go through the Express backend.
- **Auth tokens stored in `expo-secure-store`** — never `AsyncStorage`.
- **No PAN/Aadhaar/bank data in any Expo input field** — ever.
- **Report button on every AI message** — required by Google Play AI-Generated Content policy.
- **Compliance footer displayed in UI** — appended to every chat bubble from assistant.
- **EAS Build** produces `.aab` for Play Store. Target API: Android 15 (API 35).

---

## 8. Environment Variables (Backend)

All secrets live in server-side environment variables only.

```
# AI
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Database
MONGODB_URI=
MONGODB_DB_NAME=clarifin

# Auth
AUTH_PROVIDER_SECRET=

# App
NODE_ENV=
PORT=3000
ALLOWED_ORIGINS=https://clarifin.app
```

None of these are ever sent to or accessible from the Expo client.

---

## 9. Data Seeding

Seed script at `backend/scripts/seed.js`. Runs once before launch and every April (new FY data).

Seed order:
1. Insert / upsert `instruments` collection (19 documents — all Category 1A fields)
2. Insert `instrument_performance` rows (FY2016–FY2025 per instrument)
3. Compute and insert `instrument_derived` (CAGR, volatility, real return etc.)
4. Generate vector embeddings for each `special_features[]` sentence → store in Atlas Vector Search index

NPS seed data: marked `is_estimated: true` — replace approximate values with exact figures from npstrust.org.in before running seed in production.
G-Sec seed data: marked `is_estimated: true` — verify CRISIL Gilt Fund Index values at crisil.com before seeding.

---

## 10. Key Decisions — Pending

| Decision | Options | Status |
|---|---|---|
| Auth provider | Clerk / Supabase Auth | TBD |
| Backend hosting | Railway / Render | TBD |
| AI provider | OpenAI / Anthropic Claude | TBD — may use both |
| Embedding model | OpenAI text-embedding-3-small | Likely — confirm before seed |
