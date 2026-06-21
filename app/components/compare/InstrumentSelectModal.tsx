import { useState, useCallback, useRef, useEffect } from "react";
import { Modal, View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X } from "lucide-react-native";
import { colors, fonts, radius, appBackground } from "@/constants/theme";
import { fetchInstruments } from "@/lib/api";
import { Instrument, ExploreFilters } from "@/lib/types";
import InstrumentCard from "@/components/instruments/InstrumentCard";

const DEFAULT_FILTERS: ExploreFilters = {
  search: "",
  asset_class: "",
  risk_level: "",
  return_nature: "",
  suitable_for_80c: null,
  recommended_horizon: "",
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (instruments: Instrument[]) => void;
  initialSelected?: Instrument[];
}

export default function InstrumentSelectModal({ visible, onClose, onSelect, initialSelected = [] }: Props) {
  const { width } = useWindowDimensions();
  const numColumns = width >= 1100 ? 3 : width >= 640 ? 2 : 1;

  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_FILTERS);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selected, setSelected] = useState<Instrument[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeFiltersRef = useRef(filters);

  const load = useCallback(async (activeFilters: ExploreFilters, pageNum: number, append: boolean) => {
    try {
      const res = await fetchInstruments(activeFilters, pageNum);
      setInstruments((prev) => append ? [...prev, ...res.data] : res.data);
      setHasMore(res.pagination.hasMore);
      setError(null);
    } catch {
      setError("Could not load instruments. Check your connection.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      activeFiltersRef.current = filters;
      setPage(1);
      setLoading(true);
      setInstruments([]);
      setSelected(initialSelected);
      load(filters, 1, false);
    }
  }, [filters, visible, load]);

  function handleToggleSelect(instrument: Instrument) {
    setSelected((prev) => {
      const isSelected = prev.some((item) => item.instrument_id === instrument.instrument_id);
      if (isSelected) {
        return prev.filter((item) => item.instrument_id !== instrument.instrument_id);
      }
      return [...prev, instrument];
    });
  }

  function handleSearchChange(text: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: text }));
    }, 400);
  }

  function handleEndReached() {
    if (!hasMore || loadingMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    load(activeFiltersRef.current, nextPage, true);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: appBackground.colors[0] }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Text style={{ fontFamily: fonts.displayBold, fontSize: 24, color: colors.textPrimary }}>
                  Select Instrument
                </Text>
                {selected.length > 0 && (
                  <View style={{ backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full }}>
                    <Text style={{ fontFamily: fonts.interMedium, fontSize: 12, color: "#fff" }}>
                      {selected.length} Selected
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.bgCard,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.borderDefault,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 16,
              gap: 8,
            }}>
              <Search size={16} color={colors.textMuted} />
              <TextInput
                placeholder="Search instruments..."
                placeholderTextColor={colors.textMuted}
                onChangeText={handleSearchChange}
                style={{
                  flex: 1,
                  fontFamily: fonts.interRegular,
                  fontSize: 14,
                  color: colors.textPrimary,
                  padding: 0,
                  outlineStyle: "none",
                } as any}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>

            {/* List */}
            {loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : error ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textMuted, textAlign: "center" }}>
                  {error}
                </Text>
              </View>
            ) : (
              <FlatList
                  key={numColumns}
                  data={instruments}
                  numColumns={numColumns}
                  columnWrapperStyle={numColumns > 1 ? { gap: 16 } : undefined}
                  keyExtractor={(item) => item.instrument_id}
                  renderItem={({ item }) => {
                    const isSelected = selected.some((s) => s.instrument_id === item.instrument_id);
                    return (
                      <View style={{ flex: numColumns > 1 ? 1 : undefined }}>
                        <InstrumentCard
                          item={item}
                          selected={isSelected}
                          onPress={() => handleToggleSelect(item)}
                        />
                      </View>
                    );
                  }}
                  onEndReached={handleEndReached}
                  onEndReachedThreshold={0.3}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  ListFooterComponent={
                    loadingMore ? (
                      <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />
                    ) : null
                  }
                  ListEmptyComponent={
                    <View style={{ paddingTop: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: fonts.interRegular, fontSize: 14, color: colors.textMuted }}>
                        No instruments found
                      </Text>
                    </View>
                  }
                />
            )}
          </View>
          
          {/* Bottom Action Bar */}
          {selected.length > 0 && (
            <View style={{
              padding: 20,
              backgroundColor: colors.bgCard,
              borderTopWidth: 1,
              borderTopColor: colors.borderLight,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Text style={{ fontFamily: fonts.interMedium, fontSize: 16, color: colors.textPrimary }}>
                {selected.length} Selected
              </Text>
              <TouchableOpacity
                onPress={() => onSelect(selected)}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: radius.md,
                }}
              >
                <Text style={{ fontFamily: fonts.interMedium, fontSize: 16, color: "#fff" }}>
                  Compare
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
