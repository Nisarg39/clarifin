import { View, Text } from "react-native";
import { Link } from "expo-router";
import { colors, fonts } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bgApp, padding: 20 }}>
      <Text style={{ fontFamily: fonts.soraBold, fontSize: 36, color: colors.textPrimary }}>404</Text>
      <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary, marginTop: 8, marginBottom: 24 }}>
        Screen not found
      </Text>
      <Link href="/" style={{ fontFamily: fonts.interSemi, fontSize: 15, color: colors.primary }}>
        Go home
      </Link>
    </View>
  );
}
