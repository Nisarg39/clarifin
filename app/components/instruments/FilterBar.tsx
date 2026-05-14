import React, { useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Check, ChevronDown, Layers, ShieldAlert, TrendingUp, Clock } from "lucide-react-native";
import { colors, fonts, radius, shadows } from "@/constants/theme";
import { ExploreFilters } from "@/lib/types";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  key: keyof ExploreFilters;
  defaultLabel: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  options: FilterOption[];
  activeBg: string;
  inactiveBg: string;
  accentColor: string;
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    key: "asset_class",
    defaultLabel: "Asset Class",
    Icon: Layers,
    activeBg: colors.skyBlue,
    inactiveBg: "#E0EEFF", // Very Light Sky Blue
    accentColor: colors.skyBlue,
    options: [
      { label: "All Assets", value: "" },
      { label: "Equity", value: "equity" },
      { label: "Debt", value: "debt" },
      { label: "Gold", value: "gold" },
      { label: "Infrastructure", value: "infrastructure" },
      { label: "Alternative", value: "alternative" },
      { label: "Real Estate", value: "real_estate" },
    ],
  },
  {
    key: "risk_level",
    defaultLabel: "Risk",
    Icon: ShieldAlert,
    activeBg: "#D6D9FF", // Lavender
    inactiveBg: "#F0F1FF", // Very Light Lavender
    accentColor: "#5B61E1",
    options: [
      { label: "All Risk", value: "" },
      { label: "Low", value: "low" },
      { label: "Low–Moderate", value: "low_to_moderate" },
      { label: "Moderate", value: "moderate" },
      { label: "Moderately High", value: "moderately_high" },
      { label: "High", value: "high" },
      { label: "Very High", value: "very_high" },
    ],
  },
  {
    key: "return_nature",
    defaultLabel: "Return",
    Icon: TrendingUp,
    activeBg: colors.accent, // Yellow
    inactiveBg: "#FFFEE5", // Very Light Yellow
    accentColor: "#D9D400",
    options: [
      { label: "All Returns", value: "" },
      { label: "Fixed", value: "fixed" },
      { label: "Market-linked", value: "market_linked" },
      { label: "Mixed", value: "mixed" },
    ],
  },
  {
    key: "recommended_horizon",
    defaultLabel: "Horizon",
    Icon: Clock,
    activeBg: "#D1FAE5", // Mint
    inactiveBg: "#F0FDF4", // Very Light Mint
    accentColor: "#059669",
    options: [
      { label: "All Horizons", value: "" },
      { label: "Short", value: "short" },
      { label: "Medium", value: "medium" },
      { label: "Long", value: "long" },
      { label: "Very Long", value: "very_long" },
    ],
  },
];

interface Props {
  filters: ExploreFilters;
  onChange: (filters: ExploreFilters) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  const [openKey, setOpenKey] = useState<keyof ExploreFilters | null>(null);
  const [dropdownY, setDropdownY] = useState(120);
  const badgeRefs = useRef<Record<string, TouchableOpacity | null>>({});

  function openDropdown(key: keyof ExploreFilters) {
    const ref = badgeRefs.current[key as string];
    if (ref) {
      ref.measure((_x, _y, _w, h, _px, py) => {
        setDropdownY(py + h + 6);
        setOpenKey(key);
      });
    } else {
      setOpenKey(key);
    }
  }

  function selectOption(key: keyof ExploreFilters, value: string) {
    onChange({ ...filters, [key]: value });
    setOpenKey(null);
  }

  const openGroup = FILTER_GROUPS.find((g) => g.key === openKey) ?? null;

  return (
    <>
      {/* Badge row — wrapper View fixes vertical clipping on web */}
      <View style={{ height: 44, marginBottom: 12, flexShrink: 0 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 2, height: 44, alignItems: "center" }}
        style={{ flex: 1 }}
      >
        {FILTER_GROUPS.map((group) => {
          const currentVal = filters[group.key] as string;
          const active = Boolean(currentVal);
          const selectedOpt = group.options.find((o) => o.value === currentVal);
          const label = active && selectedOpt ? selectedOpt.label : group.defaultLabel;

          const { Icon } = group;

          return (
            <TouchableOpacity
              key={group.key}
              ref={(r) => { badgeRefs.current[group.key as string] = r; }}
              onPress={() => openDropdown(group.key)}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 13,
                paddingVertical: 7,
                borderRadius: radius.full,
                borderWidth: 1.5,
                backgroundColor: active ? group.activeBg : colors.bgCard,
                borderColor: active ? group.activeBg : group.accentColor,
                opacity: active ? 1 : 0.8,
              }}
            >
              <Icon size={13} color={active ? colors.navy : group.accentColor} strokeWidth={2.2} />
              <Text
                style={{
                  fontFamily: fonts.interSemi,
                  fontSize: 13,
                  color: active ? colors.navy : colors.textPrimary,
                }}
              >
                {label}
              </Text>
              <ChevronDown
                size={12}
                color={active ? colors.navy : group.accentColor}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>

      {/* Dropdown */}
      <Modal
        visible={openKey !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenKey(null)}
      >
        <TouchableWithoutFeedback onPress={() => setOpenKey(null)}>
          <View style={{ flex: 1, backgroundColor: "rgba(13,31,26,0.25)" }}>
            {openGroup && (
              <TouchableWithoutFeedback>
                <View
                  style={{
                    position: "absolute",
                    top: dropdownY,
                    left: 20,
                    right: 20,
                    backgroundColor: colors.bgCard,
                    borderRadius: radius.lg,
                    borderWidth: 1,
                    borderColor: colors.borderLight,
                    overflow: "hidden",
                    ...shadows.card,
                  }}
                >
                  {openGroup.options.map((opt, i) => {
                    const selected = (filters[openKey!] as string) === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => selectOption(openKey!, opt.value)}
                        activeOpacity={0.7}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingHorizontal: 16,
                          paddingVertical: 13,
                          borderBottomWidth: i < openGroup.options.length - 1 ? 1 : 0,
                          borderBottomColor: colors.borderLight,
                          backgroundColor: selected ? colors.bgApp : colors.bgCard,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: selected ? fonts.interSemi : fonts.interRegular,
                            fontSize: 14,
                            color: selected ? colors.primary : colors.textPrimary,
                          }}
                        >
                          {opt.label}
                        </Text>
                        {selected && <Check size={14} color={colors.primary} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
