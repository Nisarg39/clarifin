import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import { colors, fonts, radius, appBackground, shadows } from "@/constants/theme";
import { fetchInstrumentDetail } from "@/lib/api";
import { Instrument, InstrumentDetailResponse } from "@/lib/types";

import InstrumentSelectModal from "@/components/compare/InstrumentSelectModal";
import ComparisonTable from "@/components/compare/ComparisonTable";

export default function CompareScreen() {
  const { width } = useWindowDimensions();
  const [comparedItems, setComparedItems] = useState<InstrumentDetailResponse["data"][]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddInstruments = useCallback(async (selectedInstruments: Instrument[]) => {
    setModalVisible(false);
    
    // 1. Filter out instruments that were deselected
    const selectedIds = new Set(selectedInstruments.map(i => i.instrument_id));
    const keptItems = comparedItems.filter(item => selectedIds.has(item.instrument.instrument_id));
    
    // 2. Identify newly added instruments
    const currentIds = new Set(comparedItems.map(item => item.instrument.instrument_id));
    const newInstruments = selectedInstruments.filter(inst => !currentIds.has(inst.instrument_id));

    if (newInstruments.length === 0) {
      // Only removals happened (or no changes)
      setComparedItems(keptItems);
      return;
    }

    setLoading(true);

    try {
      const details = await Promise.all(
        newInstruments.map((inst) => fetchInstrumentDetail(inst.instrument_id))
      );
      setComparedItems([...keptItems, ...details.map(d => d.data)]);
    } catch (error) {
      Alert.alert("Error", "Could not fetch details for some instruments.");
      // Still apply removals even if fetching new ones fails
      setComparedItems(keptItems);
    } finally {
      setLoading(false);
    }
  }, [comparedItems]);

  const handleRemoveInstrument = useCallback((id: string) => {
    setComparedItems((prev) => prev.filter((item) => item.instrument._id !== id));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <LinearGradient
        colors={appBackground.colors}
        start={appBackground.start}
        end={appBackground.end}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingTop: 20 }}>
          {/* Header */}
          <View style={{ marginBottom: 16, paddingHorizontal: 20 }}>
            <Text style={{ fontFamily: fonts.displayBold, fontSize: 32, color: colors.textPrimary, marginBottom: 4, letterSpacing: -1 }}>
              Compare ⚖️
            </Text>
            <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary }}>
              Compare instruments side by side
            </Text>
          </View>

          {/* Action Area */}
          <View style={{ flexDirection: "row", marginBottom: 20, gap: 12, paddingHorizontal: 20 }}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              disabled={loading}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: radius.md,
                gap: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Plus size={18} color="#fff" />
              )}
              <Text style={{ fontFamily: fonts.interMedium, fontSize: 14, color: "#fff" }}>
                Add Instrument
              </Text>
            </TouchableOpacity>

            {comparedItems.length > 0 && (
              <TouchableOpacity
                onPress={() => setComparedItems([])}
                disabled={loading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.bgCard,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.borderDefault,
                }}
              >
                <Text style={{ fontFamily: fonts.interMedium, fontSize: 14, color: colors.textPrimary }}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content Area */}
          <View style={{ flex: 1, paddingHorizontal: width < 768 ? 0 : 20, paddingBottom: width >= 768 ? 20 : 0 }}>
            {comparedItems.length === 0 ? (
              <View style={{
                flex: 1,
                padding: 24,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <View style={{ width: 64, height: 64, backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: radius.full, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Plus size={32} color={colors.primary} />
                </View>
                <Text style={{ fontFamily: fonts.interSemi, fontSize: 18, color: colors.textPrimary, marginBottom: 8 }}>
                  No Instruments Added
                </Text>
                <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textSecondary, textAlign: "center", maxWidth: 280, lineHeight: 20 }}>
                  Click the 'Add Instrument' button above to select instruments for a side-by-side comparison.
                </Text>
              </View>
            ) : (
              <View style={{
                flex: 1,
                backgroundColor: colors.bgCard,
                borderRadius: width < 768 ? 0 : radius.lg,
                borderWidth: 1,
                borderColor: colors.borderLight,
                borderLeftWidth: width < 768 ? 0 : 1,
                borderRightWidth: width < 768 ? 0 : 1,
                overflow: "hidden"
              }}>
                <ComparisonTable items={comparedItems} onRemove={handleRemoveInstrument} />
              </View>
            )}
          </View>
        </View>

        <InstrumentSelectModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleAddInstruments}
          initialSelected={comparedItems.map(item => item.instrument)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
