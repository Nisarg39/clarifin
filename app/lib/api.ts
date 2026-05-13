import { BASEURL } from "@env";
import { DashboardSummaryResponse, ExploreFilters, InstrumentDetailResponse, InstrumentsResponse } from "./types";

export async function fetchInstruments(
  filters: ExploreFilters,
  page: number
): Promise<InstrumentsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "15");

  if (filters.search)              params.set("search", filters.search);
  if (filters.asset_class)         params.set("asset_class", filters.asset_class);
  if (filters.risk_level)          params.set("risk_level", filters.risk_level);
  if (filters.return_nature)       params.set("return_nature", filters.return_nature);
  if (filters.recommended_horizon) params.set("recommended_horizon", filters.recommended_horizon);
  if (filters.suitable_for_80c !== null)
    params.set("suitable_for_80c", String(filters.suitable_for_80c));

  const res = await fetch(`${BASEURL}/api/v1/user/instruments?${params}`);
  if (!res.ok) throw new Error("Failed to fetch instruments");
  return res.json();
}

export async function fetchInstrumentDetail(id: string): Promise<InstrumentDetailResponse> {
  const res = await fetch(`${BASEURL}/api/v1/user/instruments/${id}`);
  if (!res.ok) throw new Error("Failed to fetch instrument detail");
  return res.json();
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  const res = await fetch(`${BASEURL}/api/v1/user/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}
