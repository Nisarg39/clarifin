# Clarifin — App Build Compliance Reference
# SEBI + Google Play + DPDP Rules for Developers

> **Version:** 1.1 (May 2026)
> **Audience:** Engineering and compliance team building and maintaining the Clarifin app.
> **NOT for LLM:** Do not load this file as a system prompt. The AI agent system prompt is in `AI_Agent_System_Prompt.md`.

---

## What Clarifin Is (and Is Not)

Clarifin is an **investment education app** distributed via Google Play Store, targeting Indian users. It explains how Indian investment instruments work at a conceptual level.

Clarifin is **NOT**:
- A SEBI-Registered Investment Adviser (RIA)
- A SEBI-Registered Research Analyst (RA)
- A stock broker or sub-broker
- A Mutual Fund Distributor (MFD / ARN holder)
- An insurance agent or any RBI/PFRDA/IRDAI-licensed intermediary

**This means the entire app — every screen, every notification, every AI response, every store listing — must stay inside the "investor education" safe harbour defined by Reg. 4 of the SEBI (Investment Advisers) Regulations, 2013.**

---

## Architecture Rules (Non-Negotiable)

These must be enforced at the infrastructure level, not just in code comments.

1. **NEVER embed LLM API keys in the Expo client.** All OpenAI/Anthropic calls must route through the Next.js backend proxy. Keys live in server-side env vars only.
2. **Pre-prompt the LLM with the full `AI_Agent_System_Prompt.md` on every API call.** Do not rely on session-level caching to skip it. Compliance requires it every time.
3. **Post-generation moderation pipeline is mandatory** before any AI response reaches the user:
   - Step 1: Server-side regex blocklist over the Forbidden Language list (see `AI_Agent_System_Prompt.md §Forbidden Language`)
   - Step 2: LLM-judge check — "Does this output contain a buy/sell/hold call on a named security, a return promise, or personalised advice?" — fail closed with the refusal template if yes
4. **Rate limiting + abuse detection** on the chatbot endpoint to prevent prompt-injection attacks and system-prompt extraction.
5. **Conversation logs** retained ≥ 5 years (mirroring Reg. 19 IA Regs / Reg. 25 RA Regs best practice) under DPDP-compliant storage. User consent required at onboarding.
6. **Secure storage for auth tokens:** use `expo-secure-store`, not `AsyncStorage`. No PAN/Aadhaar/bank data in AsyncStorage under any circumstance.
7. **No SMS_READ permission** in the app manifest. Google Play Financial Services policy + DPDP forbid it for this use case.

---

## What NOT to Build (Hard Stops)

Building any of the following will trigger SEBI enforcement risk, Google Play rejection, or both.

| Do NOT Build | Reason |
|---|---|
| Real-time stock prices or live NAV shown next to security names | SEBI Circular 29 Jan 2025 — 3-month lag rule |
| Buy/sell/invest buttons or CTA deep-links to broker apps | Reg. 3 IA Regs — solicitation |
| Model portfolios or "top fund" ranked lists with buy intent | Reg. 3 RA Regs — research analyst territory |
| Return promises anywhere in UI, notifications, or metadata | SEBI Intermediaries Amendment 2024 Reg. 16A |
| User PAN/Aadhaar/bank account input fields inside chat | DPDP Act 2023 Sec. 4–6; Play Data Safety |
| Crypto trading features or wallet linkage | Play Cryptocurrency Exchanges & Software Wallets policy (India requirements) |
| F&O intraday call content or "signals" | RA Regs 2014 (as amended Dec 2024) |
| API keys in Expo client bundle | Basic secrets hygiene + Play Security policy |
| AI-generated fake portfolio P&L images or testimonials | SEBI Avadhut Sathe order precedent (Dec 2025) |
| Deepfake voices or AI "expert" personas giving market views | Play AI-Generated Content policy 2025 |
| Personal-loan facilitation language or P2P lending with "assured returns" | RBI Master Direction 16 Aug 2024; Play Financial Services policy |
| "Leaderboard of top performing funds" with actionable CTAs | Reg. 16A Intermediaries Amdt 2024 |
| Real-time push notifications naming a security + directional verb | SEBI Finfluencer Circular Jan 2025 |
| Premium tier marketed as "better calls / picks" | Play Subscriptions policy — must be content/usage tier only |

---

## Store Listing & Metadata Rules

Violating these causes Play Store rejection or removal.

**NEVER use in title, short description, long description, or screenshots:**
- "stock tips", "guaranteed returns", "top picks", "AI-powered trading"
- "advisory", "advice", "investment recommendation", "SEBI-approved"
- "assured returns", "no-risk", "double your money"
- Any return percentage tied to a specific fund or instrument

**MUST use:**
- "investment education" as the core description
- Clear disclaimer that the app is not SEBI-registered
- Accurate category: Education (not Finance if it implies advisory)

---

## In-App Mandatory UI Elements

Every screen that shows AI-generated content must have:

1. **"Report this answer" flag button** on every AI message — feeds a moderation queue (Play AI-Generated Content policy, mandatory)
2. **Privacy Policy link** reachable from any chatbot screen
3. **Disclaimer footer** visible on every substantive AI response (verbatim text in `AI_Agent_System_Prompt.md §Mandatory Response Footer`)
4. **Onboarding screen** must state verbatim: *"This app provides investment EDUCATION only. It is not a SEBI-Registered Investment Adviser, Research Analyst, broker, or distributor."*
5. **First chatbot session**: AI must introduce itself as: *"I'm an AI assistant. My answers are educational and may contain errors. I am not a SEBI-Registered Investment Adviser."*
6. **Terms of Use acceptance** at onboarding — must include the no-advice clause and DPDP-compliant consent

---

## SEBI Compliance Checklist

Run before every Play Store submission and quarterly thereafter.

**Positioning & Claims**
- [ ] App and store listing avoid: "advisory", "advice", "recommendation", "tips", "calls", "best fund", "guaranteed"
- [ ] Onboarding screen has the verbatim education-only disclaimer
- [ ] No leaderboards of top-performing funds/stocks with buy CTAs
- [ ] No real-time push notifications naming a security with directional verb
- [ ] No deep-links into broker apps with pre-filled buy/sell intents from chat output
- [ ] Knowledge-base data: any historical NAV/price/yield data attached to a named security is lagged ≥ 3 months; live tickers NOT shown next to security names

**AI Agent**
- [ ] Full `AI_Agent_System_Prompt.md` pre-prompted on every LLM call
- [ ] Post-generation moderation pipeline active (regex blocklist + LLM judge)
- [ ] Conversation logs retained ≥ 5 years under DPDP-compliant storage
- [ ] AI moderation queue for flagged responses has human review process
- [ ] Rate limiting on chatbot endpoint active

**Ongoing**
- [ ] Quarterly internal compliance audit of AI outputs against `AI_Agent_System_Prompt.md`
- [ ] Review `AI_Agent_System_Prompt.md` immediately on: any new SEBI circular touching investor education or AI/ML, any Google Play Financial Services/AI policy update, or any DPDP Rules 2025 phase commencement

---

## Google Play Compliance Checklist

Run before every Play Store submission.

**Declarations (mandatory from 30 Oct 2025)**
- [ ] **Financial Features Declaration** completed in Play Console — declare truthfully: does NOT provide personalised investment advice, does NOT manage money, does NOT facilitate trading
- [ ] **Data Safety section** accurately reflects: chat content sent to OpenAI/Anthropic; data deletion mechanism exists; no SDK collecting SMS/Call Log/Photos beyond declared use
- [ ] **Privacy policy URL** is non-geofenced, non-PDF, publicly accessible at clarifin.app/privacy
- [ ] **AI-Generated Content declaration** submitted in Play Console
- [ ] In-app Report button on every AI message

**Technical**
- [ ] Target API level: Android 15 (API 35) for new submissions/updates as of 31 Aug 2025; Android 14 minimum to remain visible to existing users
- [ ] No `SMS_READ` permission in manifest
- [ ] No personal-loan facilitation, no crypto-trading facilitation, no binary-options content

**Account Health**
- [ ] At least one published update every 90 days (dormant-account closure policy)
- [ ] ≥ 1,000 installs maintained or active IAP within 90 days

**Subscriptions**
- [ ] Price, billing period, what is/isn't included, and cancellation path clearly disclosed before purchase
- [ ] Premium tier described as content/usage tier — never implies "better calls/picks/signals"

**Store Listing**
- [ ] Screenshots scrubbed for Misleading Claims (no return promises, no fake P&L, no "SEBI-approved")
- [ ] Short and long description scrubbed for forbidden phrases (see §Store Listing & Metadata Rules above)

---

## DPDP Act 2023 + DPDP Rules 2025 Checklist

*(Rules notified 13 Nov 2025; phased commencement; substantive obligations expected from May 2027 unless accelerated — implement now to avoid scramble)*

- [ ] Lawful basis for processing chat data = explicit consent under Sec. 6, captured at onboarding via Consent Manager-compatible flow
- [ ] Privacy notice available in English + at least one of the 22 listed Indian languages where applicable
- [ ] Data Principal Rights implemented: access, correction, erasure (target ≤ 7 days for erasure), grievance officer contact, escalation path to Data Protection Board
- [ ] Data minimisation: chatbot does NOT collect PAN/Aadhaar/bank account; KYC (if ever needed downstream) performed by the registered intermediary on their platform
- [ ] Children's data (under 18): verifiable parental consent; no behavioural monitoring or targeted ads at minors (Sec. 9 DPDP)
- [ ] Third-party sub-processor inventory: OpenAI/Anthropic enterprise/zero-retention terms documented; DPA-style clauses in place; processing-purpose limitation (no repurposing chat for ads/training without separate consent)
- [ ] 72-hour breach notification process to the Data Protection Board documented and tested

---

## Privacy Policy Requirements (clarifin.app/privacy)

The Privacy Policy must clearly state:

1. The app uses third-party LLM APIs (OpenAI / Anthropic) and that **chat content may transit those providers** under their respective enterprise/zero-retention terms
2. DPDP Act 2023 compliance: lawful basis = consent (Sec. 6); user rights of access, correction, erasure within statutory windows; grievance officer contact; Consent Manager option; data deletion mechanism
3. What data is collected (chat logs, profile data) and what is NOT collected (PAN, Aadhaar, bank account via chat)
4. Retention period (≥ 5 years for chat logs, mirroring IA/RA best practice)
5. Link to SEBI investor charter and SCORES grievance portal

---

## Freemium Compliance Note

The paid tier must be positioned as a **content/usage tier**, never as a "better advice" or "signal service" tier.

| Paid tier CAN include | Paid tier CANNOT include |
|---|---|
| Profile-aware instrument discovery | "Better investment picks" |
| More instrument categories | "Higher-conviction AI recommendations" |
| Higher monthly AI question limit | "Premium signals" or "exclusive calls" |
| Goal simulator (illustrative math) | Any promise of returns or performance |
| Comparison of instrument categories | Named fund/stock rankings as recommendations |

---

## Key Authorities & Where to Verify

- **SEBI** — https://www.sebi.gov.in (regulations, intermediary search, investor charter, SCORES grievance portal, SmartODR)
- **AMFI** — https://www.amfiindia.com (MFD ARN search, fund factsheets)
- **RBI** — https://www.rbi.org.in (NBFC-P2P master directions, monetary policy, retail-direct G-Sec)
- **PFRDA** — https://www.pfrda.org.in (NPS, Atal Pension Yojana)
- **MeitY (DPDP)** — https://www.meity.gov.in (DPDP Act 2023, DPDP Rules 2025)
- **Google Play Console Help** — https://support.google.com/googleplay/android-developer

---

## Source Regulations Cited

*(Internal traceability — not for end users)*

- SEBI Act, 1992 — Sections 11, 11B, 12(1), 15A–15HA
- SEBI (Investment Advisers) Regulations, 2013 — Reg. 2(l), Reg. 3, Reg. 4, Reg. 15A, Reg. 18(9), Reg. 19, Reg. 22A; last amended 7 August 2025
- SEBI (Investment Advisers) (Second Amendment) Regulations, 2024 — 16 December 2024
- SEBI (Research Analysts) Regulations, 2014 — last major amendment 16 December 2024 (model portfolios, intraday calls, part-time RA, AI disclosure Reg. 19(vii), Reg. 24(7))
- SEBI (Intermediaries) (Amendment) Regulations, 2024 — Reg. 16A (notified 29 August 2024)
- SEBI Circular SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2025/12 dated 29 January 2025 — 3-month price-data lag rule for educators
- SEBI Circular SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2025/003 dated 8 January 2025 — IA Guidelines
- SEBI Circular SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2025/004 dated 8 January 2025 — RA Guidelines
- SEBI Consultation Paper dated 20 June 2025 — Responsible Usage of AI/ML in Indian Securities Markets
- SEBI (Mutual Funds) Regulations, 1996 — Sixth Schedule (Advertisement Code); SEBI Circular IMD/CIR/12/2003
- SEBI Interim Order — Avadhut Sathe Trading Academy, 4 December 2025 (~₹546.16 crore impounded)
- SEBI Order — Mohammad Nasiruddin Ansari ("Baap of Chart"), 26 October 2023 (debarment + ₹17.2 crore impounding)
- Digital Personal Data Protection Act, 2023; DPDP Rules notified 13 November 2025
- IT Act, 2000 + IT (Reasonable Security Practices) Rules, 2011
- RBI Master Direction — NBFC-P2P Lending Platform Directions, 2017 as updated 16 August 2024
- Google Play — Financial Services, AI-Generated Content, Misleading Claims, Deceptive Behavior, Subscriptions, Privacy/User Data policies (current revisions aligned with 30 October 2025 announcement)
- Google Play — Financial Features Declaration requirement (mandatory from 30 October 2025)
- Google Play Policy Announcements: 30 October 2025, 10 July 2025, 10 April 2025
