# Clarifin — Universal Investment Data Schema

> **Version:** 3.0 (May 2026)
> **Goal:** Educate users on what investment categories exist and how they compare.
> **Rule:** Schema defined ONCE. Applies to ALL instruments. No per-instrument repetition.
> **Collections:** `instruments` · `instrument_performance` · `instrument_derived`

---

## Structure Overview

```
Investment Data
│
├── instruments            ← what each investment IS (22 fields)
├── instrument_performance ← how it performed each year (7 fields)
└── instrument_derived     ← pre-computed summaries (computed from performance)
```

---

## Collection: `instruments`

> One document per investment category. Stores facts a user needs to understand and compare investments. 22 fields.

| # | Field | Type | Description |
|---|---|---|---|
| **IDENTITY** | | | |
| 1 | `instrument_id` | string | Unique slug: `ppf`, `elss`, `bank-fd` |
| 2 | `name` | string | Display name shown in UI |
| 3 | `description` | string | 2–4 sentence plain-English explanation of what the instrument is, how it works, and who it's for |
| 4 | `instrument_type` | string | Structural type — free text, e.g. `mutual_fund_equity`, `crypto`, `etf` |
| 5 | `asset_class` | string | Underlying asset — free text, e.g. `equity`, `debt`, `gold`, `digital_asset` |
| **RETURNS** | | | |
| 6 | `return_nature` | enum | `fixed` · `market_linked` · `mixed` |
| 7 | `indicative_return_min_pct_pa` | float \| null | Current rate for fixed instruments. `null` for market-linked. |
| 8 | `indicative_return_max_pct_pa` | float \| null | Upper bound of rate range. `null` for market-linked. |
| **RISK** | | | |
| 9 | `risk_level` | enum | SEBI riskometer: `low` · `low_to_moderate` · `moderate` · `moderately_high` · `high` · `very_high` |
| 10 | `capital_protection` | enum | `full` · `partial_insured` · `none` |
| **LIQUIDITY** | | | |
| 11 | `liquidity_level` | enum | `instant` · `t1` · `t2_t3` · `low` · `very_low` · `locked` |
| 12 | `lock_in_years` | float \| null | `null` = no lock-in. `3` = ELSS. `15` = PPF. |
| **COST** | | | |
| 13 | `typical_cost_pct_pa` | float | Annualised cost as % of amount. `0.0` for govt schemes/FDs. |
| **TAXATION** | | | |
| 14 | `tax_treatment` | enum | EEE notation: `EEE` · `EET` · `ETT` · `TET` · `TTT` · `complex` |
| 15 | `suitable_for_80c` | boolean | Qualifies for Section 80C deduction |
| 16 | `tax_deduction_section` | string \| null | `"80C"` · `"80CCD(1B)"` · `null` |
| **HORIZON & GOALS** | | | |
| 17 | `recommended_horizon` | enum | `short` (<3yr) · `medium` (3–7yr) · `long` (>7yr) · `very_long` (>15yr) |
| 18 | `goal_tags` | string[] | `"emergency_fund"` · `"tax_saving_80c"` · `"retirement"` · `"wealth_creation"` · `"regular_income"` · `"child_education"` · `"short_term_parking"` · `"gold_exposure"` · `"real_estate_exposure"` · `"inflation_hedge"` |
| 19 | `inflation_beat_potential` | enum | `high` · `moderate` · `low` · `negative` |
| **IDEAL AGE GROUP** | | | |
| 20 | `ideal_age_min` | int \| null | Age from which this instrument is best suited. `null` = any age. `60` for SCSS (best for retirees). |
| 21 | `ideal_age_max` | int \| null | Age up to which this instrument is best suited. `null` = any age. `10` for SSY (girl child scheme). |
| **QUALITATIVE** | | | |
| 22 | `special_features` | string[] | Plain-English sentences about rules, legal structure, tax edge-cases, eligibility. Each sentence = separate vector embedding for AI RAG retrieval. |

---

## Collection: `instrument_performance`

> One document per instrument per financial year. Core comparable data — every instrument's annual return on the same axis.

| Field | Type | Description |
|---|---|---|
| `instrument_id` | string | FK → `instruments.instrument_id` |
| `fy` | string | Indian Financial Year: `"FY2024"` = Apr 2023–Mar 2024 |
| `return_pct` | float \| null | Annual return %. `null` for P2P (no benchmark exists). |
| `return_type` | enum | `statutory_rate` · `benchmark_index` · `category_median` · `gold_price_change` · `inflation_cpi` |
| `benchmark_name` | string \| null | Source index/benchmark. `null` for statutory rates. |
| `is_estimated` | boolean | `true` = approximate value — not verified from primary source |
| `data_source` | string | Source authority: `"NSE India"`, `"RBI Small Savings Notification"`, `"CRISIL"`, `"MOSPI"` |

> Compound unique index on `{ instrument_id, fy }`.

---

## Collection: `instrument_derived`

> Pre-computed summaries. Rebuilt every April when new FY data lands. Never computed on-the-fly at query time.

| Field | Type | Description |
|---|---|---|
| `instrument_id` | string | FK → `instruments.instrument_id` |
| `as_of_fy` | string | Latest FY used in computation |
| `avg_return_3yr_pct` | float \| null | Arithmetic mean — last 3 FYs |
| `avg_return_5yr_pct` | float \| null | Arithmetic mean — last 5 FYs |
| `avg_return_10yr_pct` | float \| null | Arithmetic mean — last 10 FYs |
| `cagr_3yr_pct` | float \| null | Geometric compounded return — 3 FYs |
| `cagr_5yr_pct` | float \| null | Geometric compounded return — 5 FYs |
| `cagr_10yr_pct` | float \| null | Geometric compounded return — 10 FYs |
| `avg_real_return_5yr_pct` | float \| null | Return minus CPI inflation — 5yr average |
| `volatility_std_dev_pct` | float \| null | Std deviation of annual returns — higher = more unpredictable |
| `best_year_return_pct` | float \| null | Best single FY return |
| `worst_year_return_pct` | float \| null | Worst single FY return |
| `positive_return_rate_pct` | float \| null | % of years with positive return |
| `avg_net_return_5yr_pct` | float \| null | 5yr avg after subtracting `typical_cost_pct_pa` |
| `data_as_of_date` | date | When this was last computed |
| `compliance_note` | string | Appended to every UI response using this data |

> Unique index on `{ instrument_id, as_of_fy }`.

---

## Instrument Registry

| # | `instrument_id` | Name |
|---|---|---|
| 1 | `mutual-fund-equity-large-cap` | Equity Mutual Fund — Large Cap |
| 2 | `elss` | ELSS — Equity Linked Savings Scheme |
| 3 | `mutual-fund-liquid` | Liquid Mutual Fund |
| 4 | `ppf` | PPF — Public Provident Fund |
| 5 | `bank-fd` | Bank Fixed Deposit |
| 6 | `tax-saver-fd` | Tax-Saver Fixed Deposit (5-Year) |
| 7 | `nps-tier1-e` | NPS Tier I — Equity (E) |
| 8 | `nps-tier1-c` | NPS Tier I — Corporate Bond (C) |
| 9 | `nps-tier1-g` | NPS Tier I — Government Bond (G) |
| 10 | `sgb` | SGB — Sovereign Gold Bond |
| 11 | `listed-equity-stock` | Listed Equity Shares |
| 12 | `g-sec` | Government Securities — G-Sec / T-Bill |
| 13 | `corporate-bond-ncd` | Corporate Bond — Listed NCD |
| 14 | `reit` | REIT — Real Estate Investment Trust |
| 15 | `invit` | InvIT — Infrastructure Investment Trust |
| 16 | `nifty-50-index-etf` | Nifty 50 Index ETF |
| 17 | `p2p-lending` | P2P Lending |
| 18 | `scss` | SCSS — Senior Citizens Savings Scheme |
| 19 | `sukanya-samriddhi-yojana` | Sukanya Samriddhi Yojana |

> Adding a new category (e.g. crypto): create a new document with a new `instrument_id`. No code changes needed — `instrument_type` and `asset_class` are free text.

---

## Historical Seed Data (FY2016–FY2025)

*Stored in `instrument_performance`. All `return_pct` is gross pre-tax.*

### PPF
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 8.70 | statutory_rate | RBI Small Savings Notification |
| FY2017 | 8.10 | statutory_rate | RBI Small Savings Notification |
| FY2018 | 7.90 | statutory_rate | RBI Small Savings Notification |
| FY2019 | 8.00 | statutory_rate | RBI Small Savings Notification |
| FY2020 | 7.90 | statutory_rate | RBI Small Savings Notification |
| FY2021 | 7.10 | statutory_rate | RBI Small Savings Notification |
| FY2022 | 7.10 | statutory_rate | RBI Small Savings Notification |
| FY2023 | 7.10 | statutory_rate | RBI Small Savings Notification |
| FY2024 | 7.10 | statutory_rate | RBI Small Savings Notification |
| FY2025 | 7.10 | statutory_rate | RBI Small Savings Notification |

### Bank FD (benchmark: SBI 1-year)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 7.00 | statutory_rate | SBI website archive |
| FY2017 | 6.90 | statutory_rate | SBI website archive |
| FY2018 | 6.50 | statutory_rate | SBI website archive |
| FY2019 | 6.80 | statutory_rate | SBI website archive |
| FY2020 | 6.25 | statutory_rate | SBI website archive |
| FY2021 | 5.10 | statutory_rate | SBI website archive |
| FY2022 | 5.10 | statutory_rate | SBI website archive |
| FY2023 | 6.80 | statutory_rate | SBI website archive |
| FY2024 | 6.80 | statutory_rate | SBI website archive |
| FY2025 | 6.80 | statutory_rate | SBI website archive |

### SCSS
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 9.30 | statutory_rate | RBI Small Savings Notification |
| FY2017 | 8.50 | statutory_rate | RBI Small Savings Notification |
| FY2018 | 8.30 | statutory_rate | RBI Small Savings Notification |
| FY2019 | 8.70 | statutory_rate | RBI Small Savings Notification |
| FY2020 | 8.60 | statutory_rate | RBI Small Savings Notification |
| FY2021 | 7.40 | statutory_rate | RBI Small Savings Notification |
| FY2022 | 7.40 | statutory_rate | RBI Small Savings Notification |
| FY2023 | 8.00 | statutory_rate | RBI Small Savings Notification |
| FY2024 | 8.20 | statutory_rate | RBI Small Savings Notification |
| FY2025 | 8.20 | statutory_rate | RBI Small Savings Notification |

### Sukanya Samriddhi Yojana
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 9.20 | statutory_rate | RBI Small Savings Notification |
| FY2017 | 8.40 | statutory_rate | RBI Small Savings Notification |
| FY2018 | 8.10 | statutory_rate | RBI Small Savings Notification |
| FY2019 | 8.50 | statutory_rate | RBI Small Savings Notification |
| FY2020 | 7.60 | statutory_rate | RBI Small Savings Notification |
| FY2021 | 7.60 | statutory_rate | RBI Small Savings Notification |
| FY2022 | 7.60 | statutory_rate | RBI Small Savings Notification |
| FY2023 | 8.00 | statutory_rate | RBI Small Savings Notification |
| FY2024 | 8.20 | statutory_rate | RBI Small Savings Notification |
| FY2025 | 8.20 | statutory_rate | RBI Small Savings Notification |

### Equity MF Large Cap (benchmark: Nifty 100 TRI)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | -9.00 | benchmark_index | NSE India |
| FY2017 | 18.60 | benchmark_index | NSE India |
| FY2018 | 12.40 | benchmark_index | NSE India |
| FY2019 | 15.40 | benchmark_index | NSE India |
| FY2020 | -26.50 | benchmark_index | NSE India |
| FY2021 | 74.90 | benchmark_index | NSE India |
| FY2022 | 22.30 | benchmark_index | NSE India |
| FY2023 | -0.60 | benchmark_index | NSE India |
| FY2024 | 40.80 | benchmark_index | NSE India |
| FY2025 | 6.50 | benchmark_index | NSE India |

### ELSS + Listed Stocks (benchmark: Nifty 500 TRI)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | -7.30 | benchmark_index | NSE India |
| FY2017 | 24.60 | benchmark_index | NSE India |
| FY2018 | 14.00 | benchmark_index | NSE India |
| FY2019 | 8.10 | benchmark_index | NSE India |
| FY2020 | -28.10 | benchmark_index | NSE India |
| FY2021 | 79.40 | benchmark_index | NSE India |
| FY2022 | 22.40 | benchmark_index | NSE India |
| FY2023 | 0.60 | benchmark_index | NSE India |
| FY2024 | 44.80 | benchmark_index | NSE India |
| FY2025 | 7.20 | benchmark_index | NSE India |

### Nifty 50 ETF (benchmark: Nifty 50 TRI)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | -8.90 | benchmark_index | NSE India |
| FY2017 | 18.60 | benchmark_index | NSE India |
| FY2018 | 10.30 | benchmark_index | NSE India |
| FY2019 | 15.40 | benchmark_index | NSE India |
| FY2020 | -26.00 | benchmark_index | NSE India |
| FY2021 | 72.50 | benchmark_index | NSE India |
| FY2022 | 19.10 | benchmark_index | NSE India |
| FY2023 | -0.60 | benchmark_index | NSE India |
| FY2024 | 29.40 | benchmark_index | NSE India |
| FY2025 | 5.30 | benchmark_index | NSE India |

### Liquid MF (benchmark: CRISIL Liquid Fund Index)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 7.80 | benchmark_index | CRISIL |
| FY2017 | 6.90 | benchmark_index | CRISIL |
| FY2018 | 6.80 | benchmark_index | CRISIL |
| FY2019 | 7.50 | benchmark_index | CRISIL |
| FY2020 | 6.10 | benchmark_index | CRISIL |
| FY2021 | 3.80 | benchmark_index | CRISIL |
| FY2022 | 3.90 | benchmark_index | CRISIL |
| FY2023 | 6.10 | benchmark_index | CRISIL |
| FY2024 | 7.30 | benchmark_index | CRISIL |
| FY2025 | 7.40 | benchmark_index | CRISIL |

### Corporate Bond / NCD (benchmark: CRISIL AA Corporate Bond Index)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 8.90 | benchmark_index | CRISIL |
| FY2017 | 7.50 | benchmark_index | CRISIL |
| FY2018 | 5.80 | benchmark_index | CRISIL |
| FY2019 | 6.40 | benchmark_index | CRISIL |
| FY2020 | 9.90 | benchmark_index | CRISIL |
| FY2021 | 7.50 | benchmark_index | CRISIL |
| FY2022 | 3.30 | benchmark_index | CRISIL |
| FY2023 | 6.80 | benchmark_index | CRISIL |
| FY2024 | 8.40 | benchmark_index | CRISIL |
| FY2025 | 8.60 | benchmark_index | CRISIL |

### G-Sec (benchmark: CRISIL Gilt Fund Index — total return)
*`is_estimated: true` — verify at crisil.com before production seed.*
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 7.80 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2017 | 13.50 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2018 | 1.20 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2019 | 6.80 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2020 | 14.00 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2021 | 10.80 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2022 | 1.50 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2023 | 2.50 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2024 | 8.50 | benchmark_index | CRISIL Gilt Fund Index (approximate) |
| FY2025 | 9.20 | benchmark_index | CRISIL Gilt Fund Index (approximate) |

### SGB (benchmark: MCX Gold Spot + 2.5% coupon)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | -0.70 | gold_price_change | MCX India + RBI SGB coupon |
| FY2017 | 8.60 | gold_price_change | MCX India + RBI SGB coupon |
| FY2018 | 6.80 | gold_price_change | MCX India + RBI SGB coupon |
| FY2019 | 14.30 | gold_price_change | MCX India + RBI SGB coupon |
| FY2020 | 31.90 | gold_price_change | MCX India + RBI SGB coupon |
| FY2021 | 4.30 | gold_price_change | MCX India + RBI SGB coupon |
| FY2022 | 15.00 | gold_price_change | MCX India + RBI SGB coupon |
| FY2023 | 17.40 | gold_price_change | MCX India + RBI SGB coupon |
| FY2024 | 19.80 | gold_price_change | MCX India + RBI SGB coupon |
| FY2025 | 34.60 | gold_price_change | MCX India + RBI SGB coupon |

### REIT / InvIT (benchmark: Nifty REIT & InvIT Index — data from FY2020)
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2020 | 3.10 | benchmark_index | NSE India |
| FY2021 | 12.40 | benchmark_index | NSE India |
| FY2022 | 18.70 | benchmark_index | NSE India |
| FY2023 | -5.20 | benchmark_index | NSE India |
| FY2024 | 22.50 | benchmark_index | NSE India |
| FY2025 | 8.30 | benchmark_index | NSE India |

### CPI Inflation — baseline for real return calculation
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 4.90 | inflation_cpi | MOSPI |
| FY2017 | 4.50 | inflation_cpi | MOSPI |
| FY2018 | 3.60 | inflation_cpi | MOSPI |
| FY2019 | 3.40 | inflation_cpi | MOSPI |
| FY2020 | 6.60 | inflation_cpi | MOSPI |
| FY2021 | 5.20 | inflation_cpi | MOSPI |
| FY2022 | 5.50 | inflation_cpi | MOSPI |
| FY2023 | 6.70 | inflation_cpi | MOSPI |
| FY2024 | 5.40 | inflation_cpi | MOSPI |
| FY2025 | 4.80 | inflation_cpi | MOSPI |

### NPS Tier I — Equity Scheme E
*`is_estimated: true` — verify at npstrust.org.in.*
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | -7.00 | benchmark_index | NPS Trust (approximate) |
| FY2017 | 17.00 | benchmark_index | NPS Trust (approximate) |
| FY2018 | 11.00 | benchmark_index | NPS Trust (approximate) |
| FY2019 | 14.00 | benchmark_index | NPS Trust (approximate) |
| FY2020 | -24.00 | benchmark_index | NPS Trust (approximate) |
| FY2021 | 62.00 | benchmark_index | NPS Trust (approximate) |
| FY2022 | 19.00 | benchmark_index | NPS Trust (approximate) |
| FY2023 | 1.50 | benchmark_index | NPS Trust (approximate) |
| FY2024 | 36.00 | benchmark_index | NPS Trust (approximate) |
| FY2025 | 7.00 | benchmark_index | NPS Trust (approximate) |

### NPS Tier I — Corporate Bond Scheme C
*`is_estimated: true` — verify at npstrust.org.in.*
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 10.00 | benchmark_index | NPS Trust (approximate) |
| FY2017 | 11.50 | benchmark_index | NPS Trust (approximate) |
| FY2018 | 7.00 | benchmark_index | NPS Trust (approximate) |
| FY2019 | 9.00 | benchmark_index | NPS Trust (approximate) |
| FY2020 | 11.50 | benchmark_index | NPS Trust (approximate) |
| FY2021 | 10.00 | benchmark_index | NPS Trust (approximate) |
| FY2022 | 4.50 | benchmark_index | NPS Trust (approximate) |
| FY2023 | 7.80 | benchmark_index | NPS Trust (approximate) |
| FY2024 | 9.80 | benchmark_index | NPS Trust (approximate) |
| FY2025 | 9.20 | benchmark_index | NPS Trust (approximate) |

### NPS Tier I — Government Bond Scheme G
*`is_estimated: true` — verify at npstrust.org.in.*
| FY | return_pct | return_type | data_source |
|---|---|---|---|
| FY2016 | 9.50 | benchmark_index | NPS Trust (approximate) |
| FY2017 | 12.50 | benchmark_index | NPS Trust (approximate) |
| FY2018 | 5.50 | benchmark_index | NPS Trust (approximate) |
| FY2019 | 7.00 | benchmark_index | NPS Trust (approximate) |
| FY2020 | 10.50 | benchmark_index | NPS Trust (approximate) |
| FY2021 | 12.00 | benchmark_index | NPS Trust (approximate) |
| FY2022 | 3.00 | benchmark_index | NPS Trust (approximate) |
| FY2023 | 6.00 | benchmark_index | NPS Trust (approximate) |
| FY2024 | 8.50 | benchmark_index | NPS Trust (approximate) |
| FY2025 | 8.00 | benchmark_index | NPS Trust (approximate) |

### Tax-Saver FD
*No separate performance rows. Maps to `bank-fd` rows at query time. `special_features[]` explains 5-yr lock-in and 80C benefit.*

---

## Developer Rules

1. **`return_pct` is gross pre-tax** — note in UI: "PPF gross = net (EEE). FD gross ≠ net."
2. **P2P** — `return_pct: null`. No industry benchmark exists.
3. **NPS** — 3 separate entries (E/C/G). Blended return computed client-side from user's allocation.
4. **REIT/InvIT** — performance data starts FY2020. Clamp date range in UI.
5. **Tax-Saver FD** — no own performance rows. Query maps to `bank-fd` rows.
6. **`instrument_derived`** — rebuilt every April. Never compute CAGR on-the-fly at query time.
7. **`special_features[]`** — each sentence = one vector embedding for RAG retrieval.
8. **New instrument category** — add a document, no schema/code changes needed.
