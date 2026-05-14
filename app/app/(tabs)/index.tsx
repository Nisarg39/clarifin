import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fonts, shadows, appBackground } from "@/constants/theme";
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

const OPTION_DESCRIPTIONS: Record<string, string> = {
  debt:            "Loans to governments or companies. Typically stable with fixed or floating interest.",
  equity:          "Ownership stake in companies. Higher growth potential with market volatility.",
  gold:            "Physical or paper gold. A traditional hedge against inflation and currency risk.",
  infrastructure:  "Investment in large-scale public assets like roads, ports, and power.",
  alternative:     "Non-traditional assets including private equity and structured products.",
  real_estate:     "Property-backed instruments including REITs and real estate debt.",
  low:             "Capital preservation focused. Minimal price fluctuation, lower return potential.",
  low_to_moderate: "Slightly above capital preservation. Limited volatility with modest growth.",
  moderate:        "Balanced approach. Accepts some fluctuation for moderate growth potential.",
  moderately_high: "Tolerates significant value swings in pursuit of higher long-term growth.",
  high:            "Accepts large fluctuations. Suited to long horizons with growth-focused goals.",
  very_high:       "Maximum risk tolerance. Significant loss potential alongside high upside.",
  market_linked:   "Returns depend on market performance. Variable — can be higher or lower than expected.",
  fixed:           "Predetermined return rate. Predictable income regardless of market conditions.",
  mixed:           "Combines fixed and market-linked return components in the same instrument.",
  short:           "1–3 years. Prioritises liquidity and capital safety over growth.",
  medium:          "3–7 years. Balances growth potential with reasonable accessibility.",
  long:            "7–15 years. Allows market cycles to play out for better compounding.",
  very_long:       "15+ years. Maximum compounding potential for long-term wealth building.",
};

interface StepDef {
  stepNumber: number;
  question: string;
  description: string;
  filterKey: string;
  accentColor: string;
  data: DashboardStat[];
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

  function handleItemPress(key: string, value: string) {
    router.push({ pathname: "/explore", params: { [key]: value } });
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <LinearGradient colors={appBackground.colors} start={appBackground.start} end={appBackground.end} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const isDesktop = width > 768;

  const steps: StepDef[] = data ? [
    {
      stepNumber: 1,
      question: "What type of asset?",
      description: "India has more investment options than just FDs and mutual funds. Understanding asset classes helps you discover what instruments are available to learn about.",
      filterKey: "asset_class",
      accentColor: "#4A8ED4",
      data: data.asset_class,
    },
    {
      stepNumber: 2,
      question: "How much risk does it carry?",
      description: "Every instrument involves a trade-off between risk and potential return. Exploring by risk level helps you understand what each instrument involves before diving deeper.",
      filterKey: "risk_level",
      accentColor: "#7C7FE8",
      data: data.risk_level,
    },
    {
      stepNumber: 3,
      question: "How are returns structured?",
      description: "Returns can be fixed (predictable), market-linked (variable), or mixed. Understanding this structure helps set realistic expectations before learning about any instrument.",
      filterKey: "return_nature",
      accentColor: "#D4A017",
      data: data.return_nature,
    },
    {
      stepNumber: 4,
      question: "How long is the commitment?",
      description: "Some instruments need years to perform, others offer easy exits. Browsing by time horizon helps you understand which instruments suit different life situations.",
      filterKey: "recommended_horizon",
      accentColor: "#059669",
      data: data.recommended_horizon,
    },
  ] : [];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <LinearGradient
        colors={appBackground.colors}
        start={appBackground.start}
        end={appBackground.end}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontFamily: fonts.displayBold, fontSize: 32, color: colors.textPrimary, marginBottom: 4, letterSpacing: -1 }}>
              Welcome back 👋
            </Text>
            <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary }}>
              Your financial universe, summarized.
            </Text>
          </View>

          {/* Market Insight ticker */}
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

          {/* Intro section */}
          <IntroSection isDesktop={isDesktop} />

          {/* Section label — design system: Inter Bold 700, 11sp, skyBlue, ALL CAPS, letterSpacing 1.5-2 */}
          {steps.length > 0 && (
            <Text style={{
              fontFamily: fonts.interBold,
              fontSize: 11,
              color: colors.skyBlue,
              textTransform: "uppercase",
              letterSpacing: 1.8,
              marginBottom: 24,
            }}>
              Explore Instruments
            </Text>
          )}

          {/* Learning steps */}
          {steps.map((step, idx) => (
            <LearningStep
              key={step.filterKey}
              step={step}
              isLast={idx === steps.length - 1}
              isDesktop={isDesktop}
              onPress={handleItemPress}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ─── MarketInsightTicker ────────────────────────────────────────────────────

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

// ─── IntroSection ───────────────────────────────────────────────────────────

function IntroSection({ isDesktop }: { isDesktop: boolean }) {
  return (
    <View style={{ marginBottom: 32, gap: 12, flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "flex-start" : "stretch" }}>

      {/* Deep Blue brand card — about Clarifin */}
      <View style={{
        flex: isDesktop ? 1 : undefined,
        backgroundColor: "#4A8ED4", // Deeper, more saturated brand blue
        borderRadius: 20,
        padding: 20,
        ...shadows.level2,
        elevation: 5,
      }}>
        <View>
            <Text style={{
              fontFamily: fonts.interBold,
              fontSize: 11,
              color: colors.textOnDark,
              opacity: 0.65,
              textTransform: "uppercase",
              letterSpacing: 1.8,
              marginBottom: 10,
            }}>
              About Clarifin
            </Text>
            <Text style={{
              fontFamily: fonts.displayBold,
              fontSize: 28,
              color: colors.textOnDark,
              letterSpacing: -1,
              lineHeight: 32,
              marginBottom: 10,
            }}>
              Clarity in Finance
            </Text>
            <Text style={{
              fontFamily: fonts.interRegular,
              fontSize: 13,
              color: colors.textOnDark,
              opacity: 0.85,
              lineHeight: 20,
              marginBottom: 16,
            }}>
              Clarifin is an investment education platform. We help you understand what financial instruments exist in India — how they work, what they involve, and who typically uses them.
            </Text>
            {/* Badges */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {["Education only", "Not SEBI-registered", "No buy/sell advice"].map((label) => (
                <View key={label} style={{
                  backgroundColor: "rgba(255,255,255,0.20)",
                  borderRadius: 9999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}>
                  <Text style={{ fontFamily: fonts.interSemi, fontSize: 11, color: colors.textOnDark, letterSpacing: 0.2 }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
      </View>

      {/* Instrument Defined card — matched to About Clarifin style and color */}
      <View style={{
        flex: isDesktop ? 1 : undefined,
        backgroundColor: "#F5F27A",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#F5F27A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
        elevation: 5,
      }}>
        <View>
          <Text style={{
            fontFamily: fonts.interBold,
            fontSize: 11,
            color: colors.textPrimary,
            opacity: 0.55,
            textTransform: "uppercase",
            letterSpacing: 1.8,
            marginBottom: 10,
          }}>
            Instrument — Defined
          </Text>
          <Text style={{
            fontFamily: fonts.displayBold,
            fontSize: 28,
            color: colors.textPrimary,
            letterSpacing: -1,
            lineHeight: 32,
            marginBottom: 10,
          }}>
            What exactly is an "instrument"?
          </Text>
          <Text style={{
            fontFamily: fonts.interRegular,
            fontSize: 13,
            color: colors.textPrimary,
            opacity: 0.75,
            lineHeight: 20,
            marginBottom: 16,
          }}>
            Simply put, an instrument is any "container" where you put your money to help it grow. Whether it's a bank deposit or a piece of gold, they are all just different tools to build your future wealth.
          </Text>
          {/* Badges */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {["FDs", "Bonds", "Stocks", "Gold", "REITs"].map((label) => (
              <View key={label} style={{
                backgroundColor: "rgba(3,3,52,0.10)",
                borderRadius: 9999,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}>
                <Text style={{ fontFamily: fonts.interSemi, fontSize: 11, color: colors.textPrimary, letterSpacing: 0.2 }}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

    </View>
  );
}

// ─── LearningStep ───────────────────────────────────────────────────────────

interface LearningStepProps {
  step: StepDef;
  isLast: boolean;
  isDesktop: boolean;
  onPress: (key: string, value: string) => void;
}

function LearningStep({ step, isLast, isDesktop, onPress }: LearningStepProps) {
  const colWidth: any = isDesktop ? "33.33%" : "100%";

  return (
    <View style={{ flexDirection: "row", gap: 16, marginBottom: isLast ? 0 : 40 }}>
      {/* Step indicator + connecting line */}
      <View style={{ alignItems: "center", width: 32 }}>
        <View style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: colors.textPrimary,
          alignItems: "center", justifyContent: "center",
          ...shadows.level2,
        }}>
          <Text style={{ fontFamily: fonts.interBold, fontSize: 13, color: "#fff" }}>
            {step.stepNumber}
          </Text>
        </View>
        {!isLast && (
          <View style={{ width: 1.5, flex: 1, backgroundColor: colors.borderDefault, marginTop: 8, minHeight: 32 }} />
        )}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {/* Step question — Inter Bold, design system title-lg (18sp) */}
        <Text style={{
          fontFamily: fonts.interBold,
          fontSize: isDesktop ? 19 : 17,
          color: colors.textPrimary,
          letterSpacing: -0.3,
          marginBottom: 6,
          lineHeight: isDesktop ? 26 : 23,
        }}>
          {step.question}
        </Text>

        {/* Description — Inter Regular, textSecondary (#4A6A8A) */}
        <Text style={{
          fontFamily: fonts.interRegular,
          fontSize: 13,
          color: colors.textSecondary,
          lineHeight: 20,
          marginBottom: 16,
          maxWidth: isDesktop ? 560 : undefined,
        }}>
          {step.description}
        </Text>

        {/* Options — white card, shadow Level 2, radius-lg 20px, border borderLight */}
        <View style={{
          backgroundColor: colors.bgCard,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.borderLight,
          overflow: "hidden",
          ...shadows.level2,
        }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {step.data.map((item) => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.6}
                onPress={() => onPress(step.filterKey, item._id)}
                style={{
                  width: colWidth,
                  padding: 16,
                  borderBottomWidth: 1,
                  borderRightWidth: 1,
                  borderColor: colors.borderLight,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                  {/* Accent bar */}
                  <View style={{
                    width: 3, height: 18, borderRadius: 2,
                    backgroundColor: step.accentColor,
                    marginTop: 2, flexShrink: 0,
                  }} />

                  <View style={{ flex: 1 }}>
                    {/* Option name — Inter SemiBold 600, 14sp, textPrimary */}
                    <Text style={{
                      fontFamily: fonts.interSemi,
                      fontSize: 14,
                      color: colors.textPrimary,
                      marginBottom: 4,
                    }}>
                      {formatLabel(item._id)}
                    </Text>
                    {/* Option description — Inter Regular, 12sp, textMuted */}
                    <Text style={{
                      fontFamily: fonts.interRegular,
                      fontSize: 12,
                      color: colors.textMuted,
                      lineHeight: 17,
                    }}>
                      {OPTION_DESCRIPTIONS[item._id] ?? ""}
                    </Text>
                  </View>

                  {/* Arrow */}
                  <Text style={{ fontSize: 16, color: colors.textMuted, marginTop: 1 }}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
