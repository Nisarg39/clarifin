import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart2 } from "lucide-react-native";
import { colors, fonts, shadows, radius } from "@/constants/theme";

export default function CompareScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgScreen }} edges={["top"]}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ marginBottom: 16, marginTop: 0 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.textPrimary, marginBottom: 4, letterSpacing: -1 }}>
            Compare
          </Text>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary }}>
            Compare instruments side by side
          </Text>
        </View>

        <View style={{
          backgroundColor: colors.bgCard,
          borderRadius: radius.lg,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.borderLight,
          ...shadows.card,
        }}>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textMuted }}>
            Comparison screen coming soon.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
