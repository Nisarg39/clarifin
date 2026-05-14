import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Layers, ShieldAlert, Clock, TrendingUp } from "lucide-react-native";
import { colors, fonts, shadows, radius } from "@/constants/theme";
import { fetchDashboardSummary } from "@/lib/api";
import { DashboardSummaryResponse, DashboardStat } from "@/lib/types";

function formatLabel(str: string): string {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [data, setData] = useState<DashboardSummaryResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary()
      .then((res) => setData(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalInstruments = data ? data.asset_class.reduce((acc, i) => acc + i.count, 0) : 0;

  function handleCardPress(key: string, value: string) {
    router.push({
      pathname: "/explore",
      params: { [key]: value },
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgApp }} edges={["top"]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const isDesktop = width > 768;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgApp }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontFamily: fonts.displayBold, fontSize: 32, color: colors.textPrimary, marginBottom: 4, letterSpacing: -1 }}>
            Welcome back 👋
          </Text>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary }}>
            Your financial universe, summarized.
          </Text>
        </View>

        {/* Market Insight — 3-stat ticker */}
        {data && (
          <MarketInsightTicker
            totalInstruments={totalInstruments}
            lastCreatedAt={data.lastInstrumentCreatedAt}
            marketLinkedPct={totalInstruments > 0
              ? Math.round(((data.return_nature.find(r => r._id === "market_linked")?.count ?? 0) / totalInstruments) * 100)
              : null}
            isDesktop={isDesktop}
            onPress={() => router.push("/explore")}
          />
        )}

        {/* Categories Grid */}
        <View style={{ 
          flexDirection: isDesktop ? "row" : "column", 
          flexWrap: isDesktop ? "wrap" : "nowrap", 
          gap: 20 
        }}>
          <FilterCategoryCard
            title="Asset Classes"
            subtitle="Explore by instrument type"
            icon={Layers}
            data={data?.asset_class}
            filterKey="asset_class"
            onPress={handleCardPress}
            theme={{
              gradient: ["#70AAE4", "#4A8ED4"] as const,
              text: colors.navy,
              sub: "rgba(3,3,52,0.6)",
              pillBg: "rgba(255,255,255,0.4)",
              pillBorder: "rgba(255,255,255,0.3)",
              iconColor: "#FFFFFF"
            }}
            style={{ flex: isDesktop ? 1 : undefined, minWidth: isDesktop ? "45%" : "100%" }}
          />

          <FilterCategoryCard
            title="Risk Profiles"
            subtitle="Manage your exposure"
            icon={ShieldAlert}
            data={data?.risk_level}
            filterKey="risk_level"
            onPress={handleCardPress}
            theme={{
              gradient: ["#D6D9FF", "#B5BAFF"] as const,
              text: colors.navy,
              sub: "rgba(3,3,52,0.6)",
              pillBg: "rgba(255,255,255,0.4)",
              pillBorder: "rgba(255,255,255,0.2)",
              iconColor: "#5B61E1"
            }}
            style={{ flex: isDesktop ? 1 : undefined, minWidth: isDesktop ? "45%" : "100%" }}
          />

          <FilterCategoryCard
            title="Returns"
            subtitle="How yields are structured"
            icon={TrendingUp}
            data={data?.return_nature}
            filterKey="return_nature"
            onPress={handleCardPress}
            theme={{
              gradient: ["#F5F27A", "#EDE84A"] as const,
              text: colors.navy,
              sub: "rgba(3,3,52,0.5)",
              pillBg: "rgba(255,255,255,0.5)",
              pillBorder: "rgba(3,3,52,0.05)",
              iconColor: colors.navy
            }}
            style={{ flex: isDesktop ? 1 : undefined, minWidth: isDesktop ? "45%" : "100%" }}
          />

          <FilterCategoryCard
            title="Time Horizon"
            subtitle="Lock-in and commitment"
            icon={Clock}
            data={data?.recommended_horizon}
            filterKey="recommended_horizon"
            onPress={handleCardPress}
            theme={{
              gradient: ["#D1FAE5", "#A7F3D0"] as const,
              text: colors.navy,
              sub: "rgba(3,3,52,0.6)",
              pillBg: "rgba(255,255,255,0.4)",
              pillBorder: "rgba(255,255,255,0.2)",
              iconColor: "#059669"
            }}
            style={{ flex: isDesktop ? 1 : undefined, minWidth: isDesktop ? "45%" : "100%" }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MarketInsightTickerProps {
  totalInstruments: number;
  lastCreatedAt: string | null | undefined;
  marketLinkedPct: number | null;
  isDesktop: boolean;
  onPress: () => void;
}

function MarketInsightTicker({ totalInstruments, lastCreatedAt, marketLinkedPct, isDesktop, onPress }: MarketInsightTickerProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  function startMarquee(totalWidth: number) {
    if (isDesktop || totalWidth === 0) return;
    const singleWidth = totalWidth / 2;
    const durationMs = (singleWidth / 38) * 1000;
    translateX.setValue(0);
    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, { toValue: -singleWidth, duration: durationMs, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    animRef.current.start();
  }

  useEffect(() => {
    return () => { animRef.current?.stop(); };
  }, [isDesktop]);

  const DIVIDER = (
    <View style={{ width: 1, height: 44, backgroundColor: colors.borderDefault, marginHorizontal: 24, alignSelf: "center" }} />
  );

  function StatGroup() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontFamily: fonts.soraBold, fontSize: 76, color: colors.textPrimary, letterSpacing: -5, lineHeight: 76 }}>
            {Math.floor(totalInstruments)}
          </Text>
          <View style={{ gap: 3 }}>
            <Text style={{ fontFamily: fonts.interSemi, fontSize: 15, color: colors.textPrimary }}>instruments live</Text>
            <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.textMuted }}>Analyzed and ready for your portfolio</Text>
          </View>
        </View>

        {DIVIDER}

        <View style={{ gap: 3, justifyContent: "center" }}>
          <Text style={{ fontFamily: fonts.interSemi, fontSize: 15, color: colors.textPrimary }}>Last added</Text>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.textMuted }}>{formatDate(lastCreatedAt)}</Text>
        </View>

        {DIVIDER}

        <View style={{ gap: 3, justifyContent: "center", paddingRight: 48 }}>
          <Text style={{ fontFamily: fonts.interSemi, fontSize: 15, color: colors.textPrimary }}>
            {marketLinkedPct !== null ? `${marketLinkedPct}% market-linked` : "—"}
          </Text>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: colors.textMuted }}>
            of all instruments
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ marginBottom: 32 }}>
      <Text style={{ fontFamily: fonts.soraBold, fontSize: 10, color: colors.primary, textTransform: "uppercase", letterSpacing: 3, marginBottom: 10 }}>
        Market Insight
      </Text>
      <LinearGradient colors={[colors.textPrimary, "transparent", "transparent"]} locations={[0, 0.5, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 2 }} />
      <View style={{ paddingVertical: 14, overflow: "hidden" }}>
        {isDesktop ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <StatGroup />
          </View>
        ) : (
          <Animated.View
            style={{ flexDirection: "row", transform: [{ translateX }] }}
            onLayout={(e) => startMarquee(e.nativeEvent.layout.width)}
          >
            <StatGroup />
            <StatGroup />
          </Animated.View>
        )}
      </View>
      <LinearGradient colors={[colors.borderDefault, "transparent", "transparent"]} locations={[0, 0.5, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 1 }} />
    </TouchableOpacity>
  );
}

interface CardProps {
  title: string;
  subtitle: string;
  icon: any;
  data?: DashboardStat[];
  filterKey: string;
  onPress: (key: string, value: string) => void;
  theme: {
    gradient: readonly [string, string, ...string[]];
    text: string;
    sub: string;
    pillBg: string;
    pillBorder: string;
    iconColor: string;
  };
  style?: any;
}

function FilterCategoryCard({ title, subtitle, icon: Icon, data, filterKey, onPress, theme, style }: CardProps) {
  if (!data || data.length === 0) return null;

  return (
    <View style={{ borderRadius: radius.xl, overflow: "hidden", ...shadows.level2, ...style }}>
    <LinearGradient
      colors={theme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ padding: 24 }}
    >
      {/* Card Header */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <View style={{ backgroundColor: theme.pillBg, padding: 8, borderRadius: 12 }}>
              <Icon size={20} color={theme.iconColor} strokeWidth={2.5} />
            </View>
            <Text style={{ 
          fontFamily: fonts.soraBold, 
          fontSize: 22, 
          color: theme.text, 
          marginBottom: 2,
          letterSpacing: -0.5
        }}>
          {title}
        </Text>
          </View>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 13, color: theme.sub }}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Options — tag chip layout */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {data.map((item) => (
          <TouchableOpacity
            key={item._id}
            activeOpacity={0.7}
            onPress={() => onPress(filterKey, item._id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: radius.full,
              paddingHorizontal: 13,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontFamily: fonts.interSemi, fontSize: 13, color: theme.text }}>
              {formatLabel(item._id)}
            </Text>
            <View style={{
              backgroundColor: "rgba(0,0,0,0.12)",
              borderRadius: 20,
              paddingHorizontal: 6,
              paddingVertical: 1,
              minWidth: 20,
              alignItems: "center",
            }}>
              <Text style={{ fontFamily: fonts.interSemi, fontSize: 10, color: theme.text, opacity: 0.75 }}>
                {item.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
    </View>
  );
}
