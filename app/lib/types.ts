export type RiskLevel =
  | "low"
  | "low_to_moderate"
  | "moderate"
  | "moderately_high"
  | "high"
  | "very_high";

export type Horizon = "short" | "medium" | "long" | "very_long";

export interface Instrument {
  _id: string;
  instrument_id: string;
  name: string;
  instrument_type: string;
  asset_class: string;
  return_nature: "fixed" | "market_linked" | "mixed";
  indicative_return_min_pct_pa: number | null;
  indicative_return_max_pct_pa: number | null;
  risk_level: RiskLevel;
  capital_protection: "full" | "partial_insured" | "none";
  liquidity_level: string;
  lock_in_years: number | null;
  typical_cost_pct_pa: number;
  tax_treatment: string;
  suitable_for_80c: boolean;
  recommended_horizon: Horizon;
  goal_tags: string[];
  inflation_beat_potential: "high" | "moderate" | "low" | "negative";
}

export interface InstrumentFull extends Instrument {
  description: string | null;
  special_features: string[];
  ideal_age_min: number | null;
  ideal_age_max: number | null;
  tax_deduction_section: string | null;
}

export interface InstrumentDerived {
  instrument_id: string;
  as_of_fy: string;
  avg_return_3yr_pct: number | null;
  avg_return_5yr_pct: number | null;
  avg_return_10yr_pct: number | null;
  cagr_3yr_pct: number | null;
  cagr_5yr_pct: number | null;
  cagr_10yr_pct: number | null;
  avg_real_return_5yr_pct: number | null;
  volatility_std_dev_pct: number | null;
  best_year_return_pct: number | null;
  worst_year_return_pct: number | null;
  positive_return_rate_pct: number | null;
  avg_net_return_5yr_pct: number | null;
  data_as_of_date: string;
  compliance_note: string;
}

export interface InstrumentPerformance {
  instrument_id: string;
  fy: string;
  return_pct: number;
  return_type: string;
  benchmark_name: string | null;
  is_estimated: boolean;
  data_source: string | null;
}

export interface InstrumentDetailResponse {
  success: boolean;
  data: {
    instrument: InstrumentFull;
    derived: InstrumentDerived | null;
    performance: InstrumentPerformance[];
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
}

export interface InstrumentsResponse {
  success: boolean;
  data: Instrument[];
  pagination: PaginationMeta;
}

export interface ExploreFilters {
  search: string;
  asset_class: string;
  risk_level: string;
  return_nature: string;
  suitable_for_80c: boolean | null;
  recommended_horizon: string;
}
export interface DashboardStat {
  _id: string;
  count: number;
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: {
    asset_class: DashboardStat[];
    risk_level: DashboardStat[];
    return_nature: DashboardStat[];
    recommended_horizon: DashboardStat[];
    lastInstrumentCreatedAt?: string | null;
  };
}
