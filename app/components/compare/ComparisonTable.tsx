import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { colors, fonts, radius, RISK_STYLES, getReturnColor } from "@/constants/theme";
import { InstrumentDetailResponse } from "@/lib/types";
import { X } from "lucide-react-native";

type InstrumentData = InstrumentDetailResponse["data"];

interface Props {
  items: InstrumentData[];
  onRemove: (id: string) => void;
}

const HORIZON_LABEL: Record<string, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
  very_long: "Very Long",
};

const LIQUIDITY_LABEL: Record<string, string> = {
  instant: "Instant",
  t1: "T+1",
  t2_t3: "T+2/3",
  low: "Low",
  very_low: "Very Low",
  locked: "Locked",
};

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

function formatType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatReturn(min: number | null, max: number | null): string {
  if (min === null && max === null) return "—";
  if (min !== null && max !== null) return `${min}–${max}%`;
  if (max !== null) return `Up to ${max}%`;
  return `${min}%`;
}

function formatPct(val: number | null | undefined): string {
  if (val == null) return "—";
  return `${val}%`;
}

interface RowData {
  label: string;
  height?: number;
  renderValue: (item: InstrumentData) => React.ReactNode;
}

const SECTIONS: { title: string; height?: number; rows: RowData[] }[] = [
  {
    title: "Overview",
    height: 44,
    rows: [
      {
        label: "Description",
        height: 120,
        renderValue: (d) => (
          <ScrollView nestedScrollEnabled={true} style={{ flex: 1, marginVertical: 4 }} showsVerticalScrollIndicator={true}>
            <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary, fontSize: 13, lineHeight: 20 }}>
              {d.instrument.description}
            </Text>
          </ScrollView>
        ),
      },
      {
        label: "Asset Class",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{formatType(d.instrument.asset_class)}</Text>,
      },
      {
        label: "Type",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{formatType(d.instrument.instrument_type)}</Text>,
      },
      {
        label: "Risk Level",
        height: 60,
        renderValue: (d) => {
          const risk = RISK_STYLES[d.instrument.risk_level] ?? { bg: colors.bgCard, text: colors.textSecondary, border: colors.borderDefault, label: d.instrument.risk_level };
          return (
            <View style={{ backgroundColor: risk.bg, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.sm, borderWidth: 1, borderColor: risk.border }}>
              <Text style={{ fontFamily: fonts.interMedium, fontSize: 11, color: risk.text }}>{risk.label}</Text>
            </View>
          );
        },
      },
      {
        label: "Horizon",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{HORIZON_LABEL[d.instrument.recommended_horizon] || d.instrument.recommended_horizon}</Text>,
      },
      {
        label: "Goal Tags",
        height: 80,
        renderValue: (d) => {
          if (!d.instrument.goal_tags?.length) return <Text style={{ fontFamily: fonts.interRegular, color: colors.textMuted }}>—</Text>;
          return (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {d.instrument.goal_tags.map(tag => (
                <View key={tag} style={{ backgroundColor: colors.bgSubtle, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm }}>
                  <Text style={{ fontFamily: fonts.interMedium, fontSize: 10, color: colors.textSecondary }}>{GOAL_LABEL[tag] || tag}</Text>
                </View>
              ))}
            </View>
          );
        },
      },
      {
        label: "Ideal Age",
        height: 60,
        renderValue: (d) => {
          const { ideal_age_min, ideal_age_max } = d.instrument;
          if (ideal_age_min == null && ideal_age_max == null) return <Text style={{ fontFamily: fonts.interRegular, color: colors.textMuted }}>—</Text>;
          let text = "";
          if (ideal_age_min != null && ideal_age_max != null) text = `${ideal_age_min}–${ideal_age_max} yrs`;
          else if (ideal_age_min != null) text = `${ideal_age_min}+ yrs`;
          else text = `Up to ${ideal_age_max} yrs`;
          return <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{text}</Text>;
        },
      },
    ],
  },
  {
    title: "Returns & Performance",
    height: 44,
    rows: [
      {
        label: "Indicative Return",
        height: 70,
        renderValue: (d) => {
          const avgReturn = (d.instrument.indicative_return_min_pct_pa || 0 + (d.instrument.indicative_return_max_pct_pa || 0)) / 2;
          const returnColor = getReturnColor(avgReturn || d.instrument.indicative_return_min_pct_pa || 0);
          return <Text style={{ fontFamily: fonts.display, fontSize: 16, color: returnColor }}>{formatReturn(d.instrument.indicative_return_min_pct_pa, d.instrument.indicative_return_max_pct_pa)}</Text>;
        },
      },
      {
        label: "Return Nature",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{formatType(d.instrument.return_nature)}</Text>,
      },
      {
        label: "3Y CAGR",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{formatPct(d.derived?.cagr_3yr_pct)}</Text>,
      },
      {
        label: "5Y CAGR",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{formatPct(d.derived?.cagr_5yr_pct)}</Text>,
      },
      {
        label: "10Y CAGR",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{formatPct(d.derived?.cagr_10yr_pct)}</Text>,
      },
      {
        label: "Best Year",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.success }}>{formatPct(d.derived?.best_year_return_pct)}</Text>,
      },
      {
        label: "Worst Year",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.danger }}>{formatPct(d.derived?.worst_year_return_pct)}</Text>,
      },
      {
        label: "Volatility",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{formatPct(d.derived?.volatility_std_dev_pct)}</Text>,
      },
      {
        label: "Real Return (5Y)",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{formatPct(d.derived?.avg_real_return_5yr_pct)}</Text>,
      },
      {
        label: "Net Return (5Y)",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{formatPct(d.derived?.avg_net_return_5yr_pct)}</Text>,
      },
      {
        label: "Inflation Beat",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{formatType(d.instrument.inflation_beat_potential)}</Text>,
      },
    ],
  },
  {
    title: "Security & Liquidity",
    height: 44,
    rows: [
      {
        label: "Capital Protection",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{formatType(d.instrument.capital_protection)}</Text>,
      },
      {
        label: "Liquidity",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{LIQUIDITY_LABEL[d.instrument.liquidity_level] || d.instrument.liquidity_level}</Text>,
      },
      {
        label: "Lock-in",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{d.instrument.lock_in_years ? `${d.instrument.lock_in_years} Years` : "None"}</Text>,
      },
    ],
  },
  {
    title: "Costs & Taxation",
    height: 44,
    rows: [
      {
        label: "Typical Cost (p.a.)",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{d.instrument.typical_cost_pct_pa}%</Text>,
      },
      {
        label: "Tax Treatment",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interRegular, color: colors.textSecondary }}>{formatType(d.instrument.tax_treatment)}</Text>,
      },
      {
        label: "80C Suitable",
        height: 60,
        renderValue: (d) => (
          d.instrument.suitable_for_80c ? (
            <View style={{ backgroundColor: "#FEF9C3", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.sm, borderWidth: 1, borderColor: "#FDE047" }}>
              <Text style={{ fontFamily: fonts.interMedium, fontSize: 11, color: "#854D0E" }}>Yes</Text>
            </View>
          ) : (
            <Text style={{ fontFamily: fonts.interRegular, color: colors.textMuted }}>No</Text>
          )
        ),
      },
      {
        label: "Tax Deduction Sec",
        height: 60,
        renderValue: (d) => <Text style={{ fontFamily: fonts.interMedium, color: colors.textPrimary }}>{d.instrument.tax_deduction_section || "—"}</Text>,
      },
    ],
  },
];

export default function ComparisonTable({ items, onRemove }: Props) {
  const { width } = useWindowDimensions();
  // On mobile, stick with a 100px label column to save space
  const LABEL_COL_WIDTH = width > 768 ? 160 : 100;
  
  // On desktop, account for 40px padding. On mobile, padding is 0.
  // Ensure the data columns don't squish smaller than 140px.
  const paddingOffset = width > 768 ? 40 : 0;
  const targetColWidth = (width - LABEL_COL_WIDTH - paddingOffset) / 2;
  const DATA_COL_WIDTH = width > 768 ? targetColWidth : Math.max(140, targetColWidth);

  if (items.length === 0) return null;

  const content = (
    <View style={{ flexDirection: "column", paddingBottom: 40, minWidth: "fit-content" } as any}>
      {/* Headers */}
      <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: colors.borderDefault, backgroundColor: colors.bgCard, position: "sticky", top: 0, zIndex: 20 } as any}>
        <View style={{ width: LABEL_COL_WIDTH, padding: 12, justifyContent: "flex-end", backgroundColor: colors.bgCard, position: "sticky", left: 0, zIndex: 30, borderRightWidth: 1, borderRightColor: colors.borderLight } as any}>
            <Text style={{ fontFamily: fonts.interSemi, fontSize: 12, color: colors.textMuted, textTransform: "uppercase" }}>Features</Text>
          </View>
          {items.map((item) => (
            <View key={item.instrument._id} style={{ width: DATA_COL_WIDTH, padding: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ fontFamily: fonts.soraBold, fontSize: 16, color: colors.textPrimary, flex: 1, marginBottom: 8 }} numberOfLines={2}>
                  {item.instrument.name}
                </Text>
                <TouchableOpacity onPress={() => onRemove(item.instrument._id)} style={{ padding: 4, marginLeft: 4, backgroundColor: colors.bgSubtle, borderRadius: radius.full }}>
                  <X size={14} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Sections */}
        {SECTIONS.map((section, sIdx) => (
          <View key={sIdx}>
            {/* Section Header */}
            <View style={{ flexDirection: "row", height: section.height, backgroundColor: "#121A26" }}>
              <View style={{ width: width, padding: 12, position: "sticky", left: 0, zIndex: 10 } as any}>
                <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: colors.primary }}>{section.title}</Text>
              </View>
            </View>

            {/* Rows */}
            {section.rows.map((row, rIdx) => (
              <View key={rIdx} style={{ flexDirection: "row", height: row.height, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
                {/* Row Label */}
                <View style={{ width: LABEL_COL_WIDTH, padding: 12, justifyContent: "center", backgroundColor: colors.bgCard, position: "sticky", left: 0, zIndex: 10, borderRightWidth: 1, borderRightColor: colors.borderLight } as any}>
                  <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.textSecondary }}>{row.label}</Text>
                </View>
                {/* Data Cells */}
                {items.map((item) => (
                  <View key={item.instrument._id} style={{ width: DATA_COL_WIDTH, padding: 12, justifyContent: "center" }}>
                    {row.renderValue(item)}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
    </View>
  );

  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1, overflow: "auto", overscrollBehaviorX: "none" } as any}>
        {content}
      </View>
    );
  }

  // Native iOS/Android Layout
  // We use a split architecture to achieve 2D sticky headers natively.
  let headerScrollRef: ScrollView | null = null;

  return (
    <View style={{ flex: 1 }}>
      {/* NATIVE TOP HEADER (Sticky Vertically) */}
      <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: colors.borderDefault, backgroundColor: colors.bgCard, zIndex: 20 }}>
        {/* Top Left Cell (Sticky Horizontally) */}
        <View style={{ width: LABEL_COL_WIDTH, padding: 12, justifyContent: "flex-end", backgroundColor: colors.bgCard, borderRightWidth: 1, borderRightColor: colors.borderLight }}>
          <Text style={{ fontFamily: fonts.interSemi, fontSize: 12, color: colors.textMuted, textTransform: "uppercase" }}>Features</Text>
        </View>
        {/* Top Data Headers (Scrolls horizontally in sync with body) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={(ref) => { headerScrollRef = ref; }} scrollEnabled={false} style={{ flex: 1 }}>
          {items.map((item) => (
            <View key={item.instrument._id} style={{ width: DATA_COL_WIDTH, padding: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ fontFamily: fonts.soraBold, fontSize: 16, color: colors.textPrimary, flex: 1, marginBottom: 8 }} numberOfLines={2}>
                  {item.instrument.name}
                </Text>
                <TouchableOpacity onPress={() => onRemove(item.instrument._id)} style={{ padding: 4, marginLeft: 4, backgroundColor: colors.bgSubtle, borderRadius: radius.full }}>
                  <X size={14} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* NATIVE BODY (Scrolls Vertically) */}
      <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", paddingBottom: 40 }}>
          {/* Left Label Column (Sticky Horizontally) */}
          <View style={{ width: LABEL_COL_WIDTH, zIndex: 10 }}>
            {SECTIONS.map((section, sIdx) => (
              <View key={`left-s-${sIdx}`}>
                <View style={{ padding: 12, height: section.height, backgroundColor: "#121A26", width: width }}>
                  <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: colors.primary }}>{section.title}</Text>
                </View>
                {section.rows.map((row, rIdx) => (
                  <View key={`left-r-${rIdx}`} style={{ padding: 12, height: row.height, justifyContent: "center", backgroundColor: colors.bgCard, borderRightWidth: 1, borderRightColor: colors.borderLight, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
                    <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.textSecondary }}>{row.label}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Right Data Grid (Scrolls Horizontally) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ flex: 1 }}
            scrollEventThrottle={16}
            onScroll={(e) => {
              headerScrollRef?.scrollTo({ x: e.nativeEvent.contentOffset.x, animated: false });
            }}
          >
            <View style={{ flexDirection: "column" }}>
              {SECTIONS.map((section, sIdx) => (
                <View key={`right-s-${sIdx}`}>
                  {/* Section Header Row Empty Cells */}
                  <View style={{ flexDirection: "row", height: section.height, backgroundColor: "rgba(112, 170, 228, 0.03)" }}>
                    {items.map((item) => (
                      <View key={`right-s-${sIdx}-${item.instrument._id}`} style={{ width: DATA_COL_WIDTH, padding: 12 }} />
                    ))}
                  </View>
                  {/* Data Rows */}
                  {section.rows.map((row, rIdx) => (
                    <View key={`right-r-${rIdx}`} style={{ flexDirection: "row", height: row.height, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
                      {items.map((item) => (
                        <View key={`right-r-${rIdx}-${item.instrument._id}`} style={{ width: DATA_COL_WIDTH, padding: 12, justifyContent: "center" }}>
                          {row.renderValue(item)}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
