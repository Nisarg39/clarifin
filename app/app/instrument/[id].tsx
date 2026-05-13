import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { colors, fonts, radius, shadows, RISK_STYLES } from "@/constants/theme";
import { fetchInstrumentDetail } from "@/lib/api";
import {
  InstrumentDerived,
  InstrumentFull,
  InstrumentPerformance,
} from "@/lib/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(val: number | null | undefined, suffix = "%"): string {
  if (val === null || val === undefined) return "—";
  return `${val > 0 ? "+" : ""}${val.toFixed(1)}${suffix}`;
}

function fmtPlain(val: number | null | undefined, suffix = "%"): string {
  if (val === null || val === undefined) return "—";
  return `${val.toFixed(1)}${suffix}`;
}

function formatType(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const GOAL_LABEL: Record<string, string> = {
  emergency_fund: "Emergency Fund",
  tax_saving_80c: "Tax Saving (80C)",
  retirement: "Retirement",
  wealth_creation: "Wealth Creation",
  regular_income: "Regular Income",
  child_education: "Child Education",
  short_term_parking: "Short-term Parking",
  gold_exposure: "Gold Exposure",
  real_estate_exposure: "Real Estate",
  inflation_hedge: "Inflation Hedge",
};

const LIQUIDITY_LABEL: Record<string, string> = {
  instant: "Instant",
  t1: "T+1",
  t2_t3: "T+2/3",
  low: "Low",
  very_low: "Very Low",
  locked: "Locked",
};

const HORIZON_LABEL: Record<string, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
  very_long: "Very Long",
};

const CAPITAL_LABEL: Record<string, string> = {
  full: "Full",
  partial_insured: "Partial / Insured",
  none: "None",
};

// ─── sub-components ─────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{
      backgroundColor: colors.bgCard,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      padding: 16,
      marginBottom: 12,
      ...shadows.cardLight,
    }}>
      <Text style={{ fontFamily: fonts.soraSemi, fontSize: 15, color: colors.textPrimary, marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function MetricRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
      <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.textSecondary }}>{label}</Text>
      <Text style={{ fontFamily: fonts.interSemi, fontSize: 13, color: valueColor ?? colors.textPrimary }}>{value}</Text>
    </View>
  );
}

function MetricGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <View key={item.label} style={{
          flex: 1,
          minWidth: "30%",
          backgroundColor: colors.bgApp,
          borderRadius: radius.md,
          padding: 10,
          alignItems: "center",
        }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, marginBottom: 4, textAlign: "center" }}>{item.label}</Text>
          <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: colors.textPrimary }}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── main screen ─────────────────────────────────────────────────────────────

export default function InstrumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [instrument, setInstrument] = useState<InstrumentFull | null>(null);
  const [derived, setDerived] = useState<InstrumentDerived | null>(null);
  const [performance, setPerformance] = useState<InstrumentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchInstrumentDetail(id)
      .then((res) => {
        setInstrument(res.data.instrument);
        setDerived(res.data.derived);
        setPerformance(res.data.performance);
      })
      .catch(() => setError("Could not load instrument details."))
      .finally(() => setLoading(false));
  }, [id]);

  const risk = instrument ? (RISK_STYLES[instrument.risk_level] ?? {
    bg: colors.bgCard, text: colors.textSecondary, border: colors.borderDefault, label: instrument.risk_level,
  }) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgApp }} edges={["top"]}>
      {/* Back header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2} />
          <Text style={{ fontFamily: fonts.interMedium, fontSize: 14, color: colors.textPrimary }}>Back</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: colors.textOnDark }}>Go back</Text>
          </TouchableOpacity>
        </View>
      ) : instrument && risk ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          {/* ── Hero ── */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: fonts.soraBold, fontSize: 24, color: colors.textPrimary, marginBottom: 10 }}>
              {instrument.name}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              <View style={{ backgroundColor: risk.bg, borderWidth: 1, borderColor: risk.border, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontFamily: fonts.interSemi, fontSize: 12, color: risk.text }}>{risk.label}</Text>
              </View>
              <View style={{ backgroundColor: colors.bgDark, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontFamily: fonts.interMedium, fontSize: 12, color: colors.textOnDark }}>{formatType(instrument.instrument_type)}</Text>
              </View>
              <View style={{ backgroundColor: colors.bgDark, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontFamily: fonts.interMedium, fontSize: 12, color: colors.textOnDark }}>{formatType(instrument.asset_class)}</Text>
              </View>
              {instrument.suitable_for_80c && (
                <View style={{ backgroundColor: "#FEF9C3", borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontFamily: fonts.interSemi, fontSize: 12, color: "#854D0E" }}>80C Eligible</Text>
                </View>
              )}
            </View>
            {instrument.description ? (
              <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textSecondary, lineHeight: 21 }}>
                {instrument.description}
              </Text>
            ) : null}
          </View>

          {/* ── Returns ── */}
          <SectionCard title="Returns">
            <MetricRow
              label="Indicative Return (p.a.)"
              value={
                instrument.indicative_return_min_pct_pa !== null && instrument.indicative_return_max_pct_pa !== null
                  ? `${instrument.indicative_return_min_pct_pa}–${instrument.indicative_return_max_pct_pa}%`
                  : instrument.indicative_return_max_pct_pa !== null
                  ? `Up to ${instrument.indicative_return_max_pct_pa}%`
                  : "—"
              }
              valueColor={colors.negative}
            />
            <MetricRow label="Return Nature" value={formatType(instrument.return_nature)} />
            <MetricRow label="Inflation Beat" value={formatType(instrument.inflation_beat_potential)} />
            {derived && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontFamily: fonts.interMedium, fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
                  Historical Averages (as of {derived.as_of_fy})
                </Text>
                <MetricGrid items={[
                  { label: "Avg 3yr", value: fmtPlain(derived.avg_return_3yr_pct) },
                  { label: "Avg 5yr", value: fmtPlain(derived.avg_return_5yr_pct) },
                  { label: "Avg 10yr", value: fmtPlain(derived.avg_return_10yr_pct) },
                  { label: "CAGR 3yr", value: fmtPlain(derived.cagr_3yr_pct) },
                  { label: "CAGR 5yr", value: fmtPlain(derived.cagr_5yr_pct) },
                  { label: "CAGR 10yr", value: fmtPlain(derived.cagr_10yr_pct) },
                ]} />
              </View>
            )}
          </SectionCard>

          {/* ── Risk & Performance ── */}
          {derived && (
            <SectionCard title="Risk & Performance">
              <MetricRow label="Volatility (Std Dev)" value={fmtPlain(derived.volatility_std_dev_pct)} />
              <MetricRow label="Best Year Return" value={fmt(derived.best_year_return_pct)} valueColor={colors.positive} />
              <MetricRow label="Worst Year Return" value={fmt(derived.worst_year_return_pct)} valueColor={colors.negative} />
              <MetricRow label="Positive Return Rate" value={fmtPlain(derived.positive_return_rate_pct)} />
              <MetricRow label="Real Return (5yr avg)" value={fmtPlain(derived.avg_real_return_5yr_pct)} />
              <MetricRow label="Net Return (5yr, post-cost)" value={fmtPlain(derived.avg_net_return_5yr_pct)} />
            </SectionCard>
          )}

          {/* ── Key Info ── */}
          <SectionCard title="Key Info">
            <MetricRow label="Liquidity" value={LIQUIDITY_LABEL[instrument.liquidity_level] ?? instrument.liquidity_level} />
            <MetricRow label="Horizon" value={HORIZON_LABEL[instrument.recommended_horizon] ?? instrument.recommended_horizon} />
            <MetricRow label="Lock-in" value={instrument.lock_in_years ? `${instrument.lock_in_years} yrs` : "None"} />
            <MetricRow label="Capital Protection" value={CAPITAL_LABEL[instrument.capital_protection] ?? instrument.capital_protection} />
            <MetricRow label="Tax Treatment" value={instrument.tax_treatment} />
            {instrument.tax_deduction_section && (
              <MetricRow label="Deduction Section" value={instrument.tax_deduction_section} />
            )}
            <MetricRow label="Typical Cost (p.a.)" value={`${instrument.typical_cost_pct_pa}%`} />
          </SectionCard>

          {/* ── Goals & Eligibility ── */}
          <SectionCard title="Goals & Eligibility">
            {instrument.goal_tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {instrument.goal_tags.map((tag) => (
                  <View key={tag} style={{ backgroundColor: colors.bgApp, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.borderDefault }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 12, color: colors.textSecondary }}>
                      {GOAL_LABEL[tag] ?? tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {(instrument.ideal_age_min !== null || instrument.ideal_age_max !== null) && (
              <MetricRow
                label="Ideal Age"
                value={
                  instrument.ideal_age_min !== null && instrument.ideal_age_max !== null
                    ? `${instrument.ideal_age_min}–${instrument.ideal_age_max} yrs`
                    : instrument.ideal_age_min !== null
                    ? `${instrument.ideal_age_min}+ yrs`
                    : `Up to ${instrument.ideal_age_max} yrs`
                }
              />
            )}
          </SectionCard>

          {/* ── Performance History ── */}
          {performance.length > 0 && (
            <SectionCard title="Performance History">
              <View style={{ flexDirection: "row", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.borderDefault, marginBottom: 4 }}>
                <Text style={{ flex: 1, fontFamily: fonts.interMedium, fontSize: 12, color: colors.textMuted }}>FY</Text>
                <Text style={{ width: 70, fontFamily: fonts.interMedium, fontSize: 12, color: colors.textMuted, textAlign: "right" }}>Return</Text>
                <Text style={{ width: 90, fontFamily: fonts.interMedium, fontSize: 12, color: colors.textMuted, textAlign: "right" }}>Type</Text>
              </View>
              {performance.map((p) => (
                <View key={p.fy} style={{ flexDirection: "row", paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
                  <Text style={{ flex: 1, fontFamily: fonts.interRegular, fontSize: 13, color: colors.textPrimary }}>{p.fy}</Text>
                  <Text style={{ width: 70, fontFamily: fonts.interSemi, fontSize: 13, color: p.return_pct >= 0 ? colors.positive : colors.negative, textAlign: "right" }}>
                    {fmt(p.return_pct)}
                  </Text>
                  <Text style={{ width: 90, fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, textAlign: "right" }} numberOfLines={1}>
                    {formatType(p.return_type.replace(/_/g, " "))}
                  </Text>
                </View>
              ))}
              {performance.some((p) => p.is_estimated) && (
                <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 8 }}>
                  * Some values are estimated
                </Text>
              )}
            </SectionCard>
          )}

          {/* ── Special Features ── */}
          {instrument.special_features?.length > 0 && (
            <SectionCard title="Special Features">
              {instrument.special_features.map((f, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                  <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.primary, marginTop: 1 }}>•</Text>
                  <Text style={{ flex: 1, fontFamily: fonts.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>{f}</Text>
                </View>
              ))}
            </SectionCard>
          )}

          {/* ── Compliance note ── */}
          {derived?.compliance_note && (
            <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, lineHeight: 17, paddingHorizontal: 4, marginBottom: 8 }}>
              {derived.compliance_note}
            </Text>
          )}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
