# Clarifin — User Data Schema

> **Version:** 2.0 (May 2026)
> **Purpose:** Defines what user data is collected and how it is stored.
> **SEBI rule:** No personalised investment advice. App is educational only.
> **DPDP rule:** Collect minimum necessary data. No PAN/Aadhaar/bank details ever.

---

## What User Data Is For

Identity only — authenticate the user and personalise the display name.

---

## User Fields

| # | Field | Type | Notes |
|---|---|---|---|
| 1 | `name` | String | Display name. Required. |
| 2 | `email` | String | Unique. Used for auth. Required. |

---

## What Is NOT Collected

**Hard stops — SEBI + DPDP Act 2023:**

| Data | Reason Not Collected |
|---|---|
| Age / age range | Not needed. No profile-based filtering. |
| Income / income bracket | Not needed. |
| Financial goals | Not needed. |
| Risk appetite | Not needed. |
| Time horizon | Not needed. |
| Liquidity preference | Not needed. |
| Tax regime / tax slab | Not needed. |
| PAN / Aadhaar | DPDP Act Sec. 4–6 — sensitive personal data. Never collected. |
| Bank account / IFSC | Same as above. |
| Phone number | No functional use. Not collected. |
| Location / GPS | No functional use. Not collected. |

---

## DPDP Act 2023 Compliance Notes

1. Only name and email collected — strict minimum necessary data principle
2. Explicit consent captured at signup before any data is stored
3. User can view, correct, or delete their account at any time (Data Principal Rights)
4. Data is NOT shared with third parties for advertising or profiling
5. Data erasure request: target ≤ 7 days for full deletion
