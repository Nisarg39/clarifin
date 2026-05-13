import { View, Text, TouchableOpacity } from "react-native";
import { colors, fonts, radius, shadows, RISK_STYLES, getReturnColor } from "@/constants/theme";
import { Instrument } from "@/lib/types";

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

function formatReturn(min: number | null, max: number | null): string {
  if (min === null && max === null) return "—";
  if (min !== null && max !== null) return `${min}–${max}%`;
  if (max !== null) return `Up to ${max}%`;
  return `${min}%`;
}

function formatType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  item: Instrument;
  onPress: () => void;
}

export default function InstrumentCard({ item, onPress }: Props) {
  const risk = RISK_STYLES[item.risk_level] ?? {
    bg: colors.bgCard,
    text: colors.textSecondary,
    border: colors.borderDefault,
    label: item.risk_level,
  };

  const avgReturn = (item.indicative_return_min_pct_pa || 0 + (item.indicative_return_max_pct_pa || 0)) / 2;
  const returnColor = getReturnColor(avgReturn || item.indicative_return_min_pct_pa || 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: colors.bgCard,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.borderLight,
        padding: 20,
        marginBottom: 16,
        ...shadows.level2,
      }}
    >
      {/* Risk Badge (Top Right) */}
      <View style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
        <View style={{
          backgroundColor: risk.bg,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: risk.border,
        }}>
          <Text style={{ fontFamily: fonts.interMedium, fontSize: 10, color: risk.text, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {risk.label}
          </Text>
        </View>
      </View>

      {/* Header Info */}
      <View style={{ marginBottom: 16, paddingRight: 80 }}>
        <Text
          style={{
            fontFamily: fonts.soraBold,
            fontSize: 19,
            color: colors.navy,
            lineHeight: 26,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
          <View style={{ backgroundColor: "rgba(112,170,228,0.1)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.sm }}>
            <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.skyBlue }}>
              {formatType(item.instrument_type)}
            </Text>
          </View>
          <View style={{ backgroundColor: "rgba(138,170,184,0.1)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.sm }}>
            <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.neutral }}>
              {formatType(item.asset_class)}
            </Text>
          </View>
          {item.suitable_for_80c && (
            <View style={{ backgroundColor: "rgba(245,242,122,0.3)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.sm }}>
              <Text style={{ fontFamily: fonts.interMedium, fontSize: 11, color: "#854D0E" }}>
                80C
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={{ 
        flexDirection: "row", 
        borderTopWidth: 1, 
        borderTopColor: "rgba(112,170,228,0.05)", 
        paddingTop: 16,
        justifyContent: "space-between"
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
            Returns
          </Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 15, color: returnColor }}>
            {formatReturn(item.indicative_return_min_pct_pa, item.indicative_return_max_pct_pa)}
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
            Liquidity
          </Text>
          <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: colors.navy }}>
            {LIQUIDITY_LABEL[item.liquidity_level] ?? item.liquidity_level}
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
            Horizon
          </Text>
          <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: colors.navy }}>
            {HORIZON_LABEL[item.recommended_horizon] ?? item.recommended_horizon}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
