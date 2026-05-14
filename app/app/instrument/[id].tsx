import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { colors, fonts, radius, shadows, RISK_STYLES } from "@/constants/theme";
import { fetchInstrumentDetail } from "@/lib/api";
import { InstrumentDerived, InstrumentFull, InstrumentPerformance } from "@/lib/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(val: number | null | undefined): string {
  if (val === null || val === undefined) return "—";
  const abs = Math.abs(val).toFixed(1);
  if (val > 0) return `+${abs}%`;
  if (val < 0) return `−${abs}%`;
  return `${abs}%`;
}

function fmtPlain(val: number | null | undefined): string {
  if (val === null || val === undefined) return "—";
  return `${val.toFixed(1)}%`;
}

function formatType(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtReturn(min: number | null, max: number | null): string {
  if (min === null && max === null) return "—";
  if (min !== null && max !== null && min === max) return `${min}%`;
  if (min !== null && max !== null) return `${min} – ${max}%`;
  if (max !== null) return `Up to ${max}%`;
  return `${min}%`;
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

const SECTION_LABEL = {
  fontFamily: fonts.interBold,
  fontSize: 11 as const,
  color: colors.skyBlue,
  letterSpacing: 1.5,
  textTransform: "uppercase" as const,
  marginBottom: 14,
};

const ROW_DIVIDER = {
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};

// ─── screen ──────────────────────────────────────────────────────────────────

export default function InstrumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
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

  const risk = instrument
    ? (RISK_STYLES[instrument.risk_level] ?? {
        bg: colors.bgApp,
        text: colors.textSecondary,
        border: colors.borderDefault,
        label: instrument.risk_level,
      })
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgApp }} edges={["top"]}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.7}
        style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 20, paddingVertical: 12 }}
      >
        <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={1.5} />
        <Text style={{ fontFamily: fonts.interMedium, fontSize: 14, color: colors.textPrimary }}>Back</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.navy} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 20 }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: colors.navy, borderRadius: radius.full, paddingHorizontal: 24, paddingVertical: 12, ...shadows.level2 }}
          >
            <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: "#FFFFFF" }}>Go back</Text>
          </TouchableOpacity>
        </View>
      ) : instrument && risk ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
          <View style={{ width: "100%", paddingHorizontal: 20 }}>

            {/* ── 1. Hero — on gradient, no card ── */}
            <View style={{ paddingTop: 4, marginBottom: 20 }}>
              <Text style={{
                fontFamily: fonts.interBold,
                fontSize: 11,
                color: colors.skyBlue,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 10,
              }}>
                {formatType(instrument.instrument_type)} · {formatType(instrument.asset_class)}
              </Text>

              <Text style={{
                fontFamily: fonts.display,
                fontSize: 30,
                color: colors.navy,
                letterSpacing: -1,
                lineHeight: 36,
                marginBottom: 12,
              }}>
                {instrument.name}
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                <View style={{
                  backgroundColor: risk.bg,
                  borderWidth: 1,
                  borderColor: risk.border,
                  borderRadius: radius.full,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}>
                  <Text style={{ fontFamily: fonts.interSemi, fontSize: 11, color: risk.text, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    {risk.label} Risk
                  </Text>
                </View>
                {instrument.suitable_for_80c && (
                  <View style={{
                    backgroundColor: "#DCFCE7",
                    borderWidth: 1,
                    borderColor: "#BBF7D0",
                    borderRadius: radius.full,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}>
                    <Text style={{ fontFamily: fonts.interSemi, fontSize: 11, color: "#166534" }}>80C Eligible</Text>
                  </View>
                )}
              </View>

              {instrument.description ? (
                <Text style={{ fontFamily: fonts.interRegular, fontSize: 15, color: colors.textSecondary, lineHeight: 24 }}>
                  {instrument.description}
                </Text>
              ) : null}
            </View>

            {/* ── 2 + 3. Stats | Yellow Card | Key Info ── */}
            <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 12, marginBottom: 16, alignItems: isDesktop ? "stretch" : undefined }}>

              {/* Stats Strip — horizontal on mobile, vertical column on desktop */}
              <View style={{
                flex: isDesktop ? 1 : undefined,
                flexDirection: isDesktop ? "column" : "row",
                gap: 8,
              }}>
                {([
                  { label: "Liquidity", value: LIQUIDITY_LABEL[instrument.liquidity_level] ?? instrument.liquidity_level, gradient: ["#70AAE4", "#4A8ED4"] as const, labelColor: colors.navy },
                  { label: "Lock-in", value: instrument.lock_in_years ? `${instrument.lock_in_years} yrs` : "None", gradient: ["#A5B4FC", "#818CF8"] as const, labelColor: "#1E1B4B" },
                  { label: "Capital", value: CAPITAL_LABEL[instrument.capital_protection] ?? instrument.capital_protection, gradient: ["#6EE7B7", "#34D399"] as const, labelColor: "#064E3B" },
                ]).map((stat) => (
                  <View key={stat.label} style={{ flex: 1, borderRadius: radius.lg, overflow: "hidden", ...shadows.level1 }}>
                    <LinearGradient colors={stat.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16, alignItems: isDesktop ? "flex-start" : "center", justifyContent: "center" }}>
                      <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: stat.labelColor, opacity: 0.7, marginBottom: 4 }}>
                        {stat.label}
                      </Text>
                      <Text style={{ fontFamily: fonts.interSemi, fontSize: 15, color: stat.labelColor }}>
                        {stat.value}
                      </Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>

              {/* Yellow Hero Card — center column */}
              <View style={{
                flex: isDesktop ? 1 : undefined,
                backgroundColor: colors.accent,
                borderRadius: radius.xl,
                padding: 20,
                ...shadows.yellowCard,
                flexDirection: "column",
              }}>
                <View>
                  <Text style={{
                    fontFamily: fonts.interBold,
                    fontSize: 11,
                    color: colors.navy,
                    opacity: 0.55,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    textAlign: "center",
                    marginBottom: 8,
                  }}>
                    Indicative Return P.A.
                  </Text>
                  <Text style={{
                    fontFamily: fonts.display,
                    fontSize: isDesktop ? 64 : 52,
                    color: colors.navy,
                    letterSpacing: -2,
                    lineHeight: isDesktop ? 72 : 58,
                    textAlign: "center",
                  }}>
                    {fmtReturn(instrument.indicative_return_min_pct_pa, instrument.indicative_return_max_pct_pa)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", paddingTop: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: colors.navy, opacity: 0.5, marginBottom: 3 }}>Return Type</Text>
                    <Text style={{ fontFamily: fonts.interSemi, fontSize: 13, color: colors.navy }}>{formatType(instrument.return_nature)}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: colors.navy, opacity: 0.5, marginBottom: 3 }}>Horizon</Text>
                    <Text style={{ fontFamily: fonts.interSemi, fontSize: 13, color: colors.navy }}>
                      {HORIZON_LABEL[instrument.recommended_horizon] ?? instrument.recommended_horizon}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: colors.navy, opacity: 0.5, marginBottom: 3 }}>Inflation Beat</Text>
                    <Text style={{ fontFamily: fonts.interSemi, fontSize: 13, color: colors.navy }}>{formatType(instrument.inflation_beat_potential)}</Text>
                  </View>
                </View>
              </View>

              {/* Key Info Cards — horizontal on mobile, vertical column on desktop */}
              <View style={{
                flex: isDesktop ? 1 : undefined,
                flexDirection: isDesktop ? "column" : "row",
                gap: 8,
              }}>
                {([
                  { label: "Tax Treatment", value: instrument.tax_treatment, gradient: ["#FDE68A", "#FCD34D"] as const, labelColor: "#78350F" },
                  { label: "Typical Cost", value: `${instrument.typical_cost_pct_pa}%`, gradient: ["#F9A8D4", "#F472B6"] as const, labelColor: "#831843" },
                  { label: "Deduction", value: instrument.tax_deduction_section ?? "—", gradient: ["#5EEAD4", "#14B8A6"] as const, labelColor: "#134E4A" },
                ]).map((info) => (
                  <View key={info.label} style={{ flex: 1, borderRadius: radius.lg, overflow: "hidden", ...shadows.level1 }}>
                    <LinearGradient colors={info.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16, alignItems: isDesktop ? "flex-start" : "center", justifyContent: "center" }}>
                      <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: info.labelColor, opacity: 0.7, marginBottom: 4 }}>
                        {info.label}
                      </Text>
                      <Text style={{ fontFamily: fonts.interSemi, fontSize: 15, color: info.labelColor }} numberOfLines={1} adjustsFontSizeToFit>
                        {info.value}
                      </Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>

            </View>

            {/* ── 4. Blue Gradient Card — Historical Performance ── */}
            {derived && (
              <View style={{ borderRadius: radius.xl, overflow: "hidden", marginBottom: 12, ...shadows.blueCard }}>
                <LinearGradient
                  colors={["#70AAE4", "#4A8ED4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 20 }}
                >
                  <Text style={{
                    fontFamily: fonts.interBold,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}>
                    Historical Performance
                  </Text>

                  <View style={{ flexDirection: "row", marginBottom: 14 }}>
                    {[
                      { label: "CAGR 3yr", val: derived.cagr_3yr_pct, align: "flex-start" as const },
                      { label: "CAGR 5yr", val: derived.cagr_5yr_pct, align: "center" as const },
                      { label: "CAGR 10yr", val: derived.cagr_10yr_pct, align: "flex-end" as const },
                    ].map((col) => (
                      <View key={col.label} style={{ flex: 1, alignItems: col.align }}>
                        <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 5 }}>{col.label}</Text>
                        <Text style={{ fontFamily: fonts.monoMedium, fontSize: 20, color: "#FFFFFF" }}>{fmtPlain(col.val)}</Text>
                      </View>
                    ))}
                  </View>

                  {(derived.avg_return_3yr_pct !== null || derived.avg_return_5yr_pct !== null || derived.avg_return_10yr_pct !== null) && (
                    <View style={{ flexDirection: "row", paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.15)" }}>
                      {[
                        { label: "Avg 3yr", val: derived.avg_return_3yr_pct, align: "flex-start" as const },
                        { label: "Avg 5yr", val: derived.avg_return_5yr_pct, align: "center" as const },
                        { label: "Avg 10yr", val: derived.avg_return_10yr_pct, align: "flex-end" as const },
                      ].map((col) => (
                        <View key={col.label} style={{ flex: 1, alignItems: col.align }}>
                          <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>{col.label}</Text>
                          <Text style={{ fontFamily: fonts.monoMedium, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{fmtPlain(col.val)}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
                    As of {derived.as_of_fy}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* ── 5. Navy Card — Risk Metrics ── */}
            {derived && (
              <View style={{
                backgroundColor: colors.navy,
                borderRadius: radius.xl,
                padding: 20,
                marginBottom: 28,
                ...shadows.navyCard,
              }}>
                <Text style={{
                  fontFamily: fonts.interBold,
                  fontSize: 11,
                  color: colors.skyBlue,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}>
                  Risk Metrics
                </Text>

                <View style={{ flexDirection: "row", marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 5 }}>Best Year</Text>
                    <Text style={{ fontFamily: fonts.display, fontSize: 30, color: colors.positive, letterSpacing: -1 }}>
                      {fmt(derived.best_year_return_pct)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 5 }}>Worst Year</Text>
                    <Text style={{ fontFamily: fonts.display, fontSize: 30, color: colors.negative, letterSpacing: -1 }}>
                      {fmt(derived.worst_year_return_pct)}
                    </Text>
                  </View>
                </View>

                <View style={{ borderTopWidth: 1, borderTopColor: "rgba(112,170,228,0.15)", paddingTop: 14, gap: 10 }}>
                  {[
                    { label: "Volatility (Std Dev)", value: fmtPlain(derived.volatility_std_dev_pct) },
                    { label: "Positive Return Rate", value: fmtPlain(derived.positive_return_rate_pct) },
                    { label: "Real Return (5yr avg)", value: fmtPlain(derived.avg_real_return_5yr_pct) },
                    { label: "Net Return (5yr, post-cost)", value: fmtPlain(derived.avg_net_return_5yr_pct) },
                  ].map((row) => (
                    <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{row.label}</Text>
                      <Text style={{ fontFamily: fonts.monoMedium, fontSize: 13, color: "#FFFFFF" }}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}


            {/* ── 7. Goals & Eligibility — bare ── */}
            {(instrument.goal_tags.length > 0 || instrument.ideal_age_min !== null || instrument.ideal_age_max !== null) && (
              <View style={{ marginBottom: 28 }}>
                <Text style={SECTION_LABEL}>Goals & Eligibility</Text>
                {instrument.goal_tags.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: instrument.ideal_age_min !== null || instrument.ideal_age_max !== null ? 14 : 0 }}>
                    {instrument.goal_tags.map((tag) => (
                      <View key={tag} style={{
                        backgroundColor: colors.bgCard,
                        borderWidth: 1,
                        borderColor: colors.borderDefault,
                        borderRadius: radius.full,
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                      }}>
                        <Text style={{ fontFamily: fonts.interMedium, fontSize: 12, color: colors.navy }}>
                          {GOAL_LABEL[tag] ?? tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {(instrument.ideal_age_min !== null || instrument.ideal_age_max !== null) && (
                  <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4 }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.textSecondary }}>
                      {"Ideal Age: "}
                    </Text>
                    <Text style={{ fontFamily: fonts.interSemi, fontSize: 13, color: colors.navy }}>
                      {instrument.ideal_age_min !== null && instrument.ideal_age_max !== null
                        ? `${instrument.ideal_age_min}–${instrument.ideal_age_max} yrs`
                        : instrument.ideal_age_min !== null
                        ? `${instrument.ideal_age_min}+ yrs`
                        : `Up to ${instrument.ideal_age_max} yrs`}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* ── 8. Performance History — bare table ── */}
            {performance.length > 0 && (
              <View style={{ marginBottom: 28 }}>
                <Text style={SECTION_LABEL}>Performance History</Text>
                <View style={{ flexDirection: "row", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.borderDefault }}>
                  <Text style={{ flex: 1, fontFamily: fonts.interBold, fontSize: 10, color: colors.skyBlue, letterSpacing: 1, textTransform: "uppercase" }}>FY</Text>
                  <Text style={{ width: 72, fontFamily: fonts.interBold, fontSize: 10, color: colors.skyBlue, letterSpacing: 1, textTransform: "uppercase", textAlign: "right" }}>Return</Text>
                  <Text style={{ width: 84, fontFamily: fonts.interBold, fontSize: 10, color: colors.skyBlue, letterSpacing: 1, textTransform: "uppercase", textAlign: "right" }}>Type</Text>
                </View>
                {performance.map((p, i) => {
                  const retColor = p.return_pct >= 0 ? colors.positive : colors.negative;
                  return (
                    <View key={p.fy} style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      ...(i < performance.length - 1 ? ROW_DIVIDER : {}),
                    }}>
                      <View style={{ width: 3, height: 32, backgroundColor: retColor, borderRadius: 2, marginRight: 10 }} />
                      <Text style={{ flex: 1, fontFamily: fonts.interRegular, fontSize: 13, color: colors.textPrimary }}>{p.fy}</Text>
                      <Text style={{ width: 72, fontFamily: fonts.monoMedium, fontSize: 13, color: retColor, textAlign: "right" }}>
                        {fmt(p.return_pct)}
                      </Text>
                      <Text style={{ width: 84, fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, textAlign: "right" }} numberOfLines={1}>
                        {formatType(p.return_type)}
                      </Text>
                    </View>
                  );
                })}
                {performance.some((p) => p.is_estimated) && (
                  <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 8 }}>
                    * Some values are estimated
                  </Text>
                )}
              </View>
            )}

            {/* ── 9. Special Features — bare ── */}
            {instrument.special_features?.length > 0 && (
              <View style={{ marginBottom: 28 }}>
                <Text style={SECTION_LABEL}>What Makes It Special</Text>
                {instrument.special_features.map((f, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                    <Text style={{ fontFamily: fonts.interSemi, fontSize: 15, color: colors.navy }}>•</Text>
                    <Text style={{ flex: 1, fontFamily: fonts.interRegular, fontSize: 15, color: colors.textSecondary, lineHeight: 24 }}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── 10. Compliance note ── */}
            {derived?.compliance_note && (
              <Text style={{
                fontFamily: fonts.interRegular,
                fontSize: 11,
                color: colors.textMuted,
                lineHeight: 17,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.borderLight,
              }}>
                {derived.compliance_note}
              </Text>
            )}

          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
