import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Layers, ShieldAlert, Clock, TrendingUp, ChevronRight } from "lucide-react-native";
import { colors, fonts, shadows, radius } from "@/constants/theme";
import { fetchDashboardSummary } from "@/lib/api";
import { DashboardSummaryResponse, DashboardStat } from "@/lib/types";

function formatLabel(str: string): string {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

  const totalInstruments = data ? Object.values(data).reduce((acc, cat) => acc + cat.reduce((c, item) => c + item.count, 0), 0) / 4 : 0;

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
          <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.textPrimary, marginBottom: 4, letterSpacing: -1 }}>
            Welcome back!
          </Text>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary }}>
            Your financial universe, summarized.
          </Text>
        </View>

        {/* Hero Banner (Brand Gradient) */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push("/explore")}
          style={{
            borderRadius: radius["2xl"],
            marginBottom: 28,
            ...shadows.level3,
            overflow: "hidden"
          }}
        >
          <LinearGradient
            colors={[colors.navy, "#437BB8"]} // Navy to a mid-point Sky Blue shade
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 28 }}
          >
            <View style={{ zIndex: 1 }}>
              <Text style={{ fontFamily: fonts.soraBold, fontSize: 13, color: colors.skyBlue, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                Market Insight
              </Text>
              <Text style={{ fontFamily: fonts.soraBold, fontSize: 56, color: "#FFFFFF", marginBottom: 8, letterSpacing: -3 }}>
                {Math.floor(totalInstruments)}
              </Text>
              <Text style={{ fontFamily: fonts.interRegular, fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 24, maxWidth: "85%" }}>
                Live instruments analyzed and ready for your portfolio.
              </Text>
            </View>
            {/* Decorative background elements */}
            <View style={{ position: "absolute", right: -30, top: -30, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)" }} />
          </LinearGradient>
        </TouchableOpacity>

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
              bg: colors.skyBlue,
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
              bg: "#D6D9FF", // Soft Lavender / Indigo
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
              bg: colors.accent, // Yellow
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
              bg: "#D1FAE5", // Fresh Mint
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

interface CardProps {
  title: string;
  subtitle: string;
  icon: any;
  data?: DashboardStat[];
  filterKey: string;
  onPress: (key: string, value: string) => void;
  theme: {
    bg: string;
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
    <View style={{
      backgroundColor: theme.bg,
      borderRadius: radius.xl,
      padding: 24,
      ...shadows.level2,
      ...style,
    }}>
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

      {/* Options List inside card */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {data.map((item) => (
          <TouchableOpacity
            key={item._id}
            activeOpacity={0.7}
            onPress={() => onPress(filterKey, item._id)}
            style={{
              backgroundColor: theme.pillBg,
              borderWidth: 1,
              borderColor: theme.pillBorder,
              borderRadius: radius.md,
              paddingHorizontal: 12,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              minWidth: "47%",
              flexGrow: 1,
            }}
          >
            <View>
              <Text style={{ fontFamily: fonts.interSemi, fontSize: 14, color: theme.text, marginBottom: 2 }}>
                {formatLabel(item._id)}
              </Text>
              <Text style={{ fontFamily: fonts.interRegular, fontSize: 11, color: theme.sub }}>
                {item.count} items
              </Text>
            </View>
            <ChevronRight size={14} color={theme.text} opacity={0.5} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
