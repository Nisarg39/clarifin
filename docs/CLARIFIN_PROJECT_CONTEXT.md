# Clarifin — Project Context & Master Brief
> This document captures the full planning context for the Clarifin app.
> Load this into every AI coding session as the primary context file alongside `AI_Agent_System_Prompt.md` and `App_Build_Compliance.md`.
> Last updated: May 2026

---

## 1. What is Clarifin?

**Clarifin** (clarifin.app) is an Indian **investment education app** with an AI chatbot.

It is NOT:
- An investment advisory app
- A trading app
- A portfolio management app
- A SEBI-regulated financial service

It IS:
- A financial education platform
- A tool that helps users understand what investment instruments exist in India
- A profile-based instrument discovery tool (user inputs their situation → app surfaces relevant instruments to *learn about*)
- An AI chatbot grounded in a curated investment knowledge base

**Tagline concept:** "Clarity in Finance" — the name Clarifin = Clarity + Finance

---

## 2. Why This App Exists (The Origin)

- Nash needs to publish and maintain at least 1 app on Google Play Store before **June 8, 2026** to comply with Google's new developer account policy — failing to do so will result in account deactivation
- Secondary goal: build a freemium product that could eventually generate passive income
- Nash is a salaried developer (₹50K/month) with a contract that prohibits freelancing
- Nash cannot do client work, so a product is the only side-income path

**Hard deadline: App must be submitted to Google Play by May 22-23, 2026** (to allow review buffer before June 8)

---

## 3. The Core Problem Being Solved

Most Indians don't know what investment instruments exist beyond FDs and mutual funds. Apps like Groww, Zerodha, INDmoney focus on execution (buying/selling). Zerodha Varsity does education but is generic.

**The gap:** Nobody helps users understand *which instruments are even worth learning about* given their specific life situation — without giving regulated investment advice.

Clarifin fills this gap with:
1. A comprehensive knowledge base of ALL Indian investment instruments
2. A profile-based filter (user inputs age, income, goals, risk appetite, horizon, liquidity need)
3. An AI chatbot that answers questions about instruments using only the curated knowledge base
4. Clear education on how each instrument works, its risks, taxation, and who typically uses it

---

## 4. Legal & Compliance Framework

### SEBI Compliance
- Clarifin is NOT a SEBI Registered Investment Adviser (RIA) or Research Analyst (RA)
- The app must stay within the "investment education" safe harbour under SEBI IA Regulations 2013, Reg. 4
- Key rule: Never give personalised investment advice. Never say "you should invest in X"
- The AI chatbot answers ONLY from the curated knowledge base — never from its own judgment
- Forbidden language: "recommend", "should invest", "best for you", "buy", "sell", "hold", "guaranteed returns"
- Safe language: "matches your criteria", "relevant to your profile", "here's how this instrument works"
- Every AI response must end with a mandatory disclaimer

### Google Play Compliance
- App described as "investment education" — never "advisory", "tips", "recommendations"
- Financial Features Declaration must be completed in Play Console
- In-app Report button on every AI message (required for AI-generated content policy)
- Privacy policy must be publicly accessible at clarifin.app/privacy
- No misleading claims about returns in store listing or screenshots

### Full compliance rules
See `App_Build_Compliance.md` for complete SEBI, Google Play, and DPDP Act 2023 rules.
See `AI_Agent_System_Prompt.md` for the AI agent's strict compliance behaviour rules.

---

## 5. Freemium Model

| Free Tier | Paid Tier |
|---|---|
| Ask about any instrument (generic) | Profile-aware AI context (AI knows your age, goals, risk) |
| Basic instrument education | Full profile-based filtering across all instruments |
| 5-6 instrument categories | All 15-20 instrument types |
| Generic Q&A | Side-by-side comparison with your profile overlaid |
| 20 questions/month | Unlimited questions |
| | Goal-based planning simulator |

**Important:** Paid tier is a content/usage tier — NOT a "better advice" or "signal service" tier. This distinction is critical for SEBI and Google Play compliance.

---

## 6. Investment Instruments Covered (v1)

The app educates users on the following 19 instrument categories. Full data schema and seed data in `Investment_Data_Schema.md`.

---

## 7. User Profile Input (for instrument filtering)

Users answer profile questions at onboarding — age range, income bracket, financial goals, time horizon, risk appetite, liquidity need, tax regime. App uses these inputs to surface relevant instruments to learn about.

Output is always labelled **"Relevant to your profile"** — never "recommended" or "best for you."

Full user data schema, field definitions, filtering logic, SEBI compliance notes, and DPDP Act constraints are in `User_Data_Schema.md`.

---

## 8. AI Chatbot Behaviour

The AI chatbot is an investment education assistant. It answers questions about Indian financial instruments using only the curated knowledge base. It is not a SEBI-Registered Investment Adviser and must never give personalised investment advice.

Full behaviour rules, response templates, forbidden language, edge cases, and mandatory disclaimers are in `AI_Agent_System_Prompt.md`.

---

## 9. Development Timeline

| Date | Milestone |
|---|---|
| May 9 | Domain purchased, project planning complete |
| May 9–10 | Scaffold project |
| May 10–12 | Seed knowledge base with 10–15 instruments |
| May 12–16 | Build core screens (Home, Instrument Explorer, Profile, Chat) |
| May 16–19 | Build AI chatbot with RAG + compliance layers |
| May 19–21 | Polish UI, privacy policy page, Play Store assets |
| May 22–23 | Submit to Google Play Store |
| May 22 – June 8 | Review buffer + fix any rejection issues |
| June 8 | Hard deadline — app must be live on Play Store |

---

## 10. Domain & Brand

- **App name:** Clarifin
- **Domain:** clarifin.app (purchased, 1 year, GoDaddy)
- **Trademark:** No conflicts found in India (Class 9 and Class 36 searched on ipindia.gov.in — clean)
- **Next step:** File Indian trademark under Class 9 + Class 36 on ipindia.gov.in (₹4,500 for individuals)
- **Twitter/X handle to claim:** @clarifin or @getclarifin (check availability)

---

## 11. What NOT to Build (Explicit Constraints)

- ❌ No real-time stock prices or live NAV shown next to security names
- ❌ No buy/sell/invest buttons or deep links to broker apps
- ❌ No model portfolios or "top fund" lists
- ❌ No return promises in any UI text, push notifications, or metadata
- ❌ No user PAN/Aadhaar/bank account collection through chat
- ❌ No crypto trading features
- ❌ No F&O/intraday trading content
- ❌ No personalised investment advice even if user pressures the AI
- ❌ No comparison of two named funds with a "winner"

---

## 12. Key Decisions Already Made

| Decision | Choice | Reason |
|---|---|---|
| App name | Clarifin | Clarity + Finance, no trademark conflicts |
| Domain | clarifin.app | Google-owned TLD, signals legitimacy |
| Business model | Freemium | Free education, paid profile features |
| AI approach | RAG-only | Prevents hallucination and advice |
| Primary goal | Play Store by June 8 | Google developer account preservation |

---

*This document should be loaded at the start of every development session alongside `AI_Agent_System_Prompt.md`, `App_Build_Compliance.md`, `Investment_Data_Schema.md`, and `User_Data_Schema.md`.*
