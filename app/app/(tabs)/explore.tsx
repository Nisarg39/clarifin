import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layers, Search } from "lucide-react-native";
import { colors, fonts, radius } from "@/constants/theme";
import { fetchInstruments } from "@/lib/api";
import { ExploreFilters, Instrument } from "@/lib/types";
import InstrumentCard from "@/components/instruments/InstrumentCard";
import FilterBar from "@/components/instruments/FilterBar";

const DEFAULT_FILTERS: ExploreFilters = {
  search: "",
  asset_class: "",
  risk_level: "",
  return_nature: "",
  suitable_for_80c: null,
  recommended_horizon: "",
};

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const numColumns = width >= 1100 ? 3 : width >= 640 ? 2 : 1;

  const [filters, setFilters] = useState<ExploreFilters>(() => ({
    ...DEFAULT_FILTERS,
    asset_class: (params.asset_class as string) || DEFAULT_FILTERS.asset_class,
    risk_level: (params.risk_level as string) || DEFAULT_FILTERS.risk_level,
    return_nature: (params.return_nature as string) || DEFAULT_FILTERS.return_nature,
    recommended_horizon: (params.recommended_horizon as string) || DEFAULT_FILTERS.recommended_horizon,
    suitable_for_80c: params.suitable_for_80c === "true" ? true : params.suitable_for_80c === "false" ? false : DEFAULT_FILTERS.suitable_for_80c,
  }));

  // Sync params to filters (important for deep linking from Home screen)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      asset_class: (params.asset_class as string) || DEFAULT_FILTERS.asset_class,
      risk_level: (params.risk_level as string) || DEFAULT_FILTERS.risk_level,
      return_nature: (params.return_nature as string) || DEFAULT_FILTERS.return_nature,
      recommended_horizon: (params.recommended_horizon as string) || DEFAULT_FILTERS.recommended_horizon,
      suitable_for_80c: params.suitable_for_80c === "true" ? true : params.suitable_for_80c === "false" ? false : DEFAULT_FILTERS.suitable_for_80c,
    }));
  }, [params.asset_class, params.risk_level, params.return_nature, params.recommended_horizon, params.suitable_for_80c]);

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
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
    activeFiltersRef.current = filters;
    setPage(1);
    setLoading(true);
    setInstruments([]);
    load(filters, 1, false);
  }, [filters, load]);

  function handleSearchChange(text: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: text }));
    }, 400);
  }

  function handleFilterChange(next: ExploreFilters) {
    setFilters(next);
  }

  function handleEndReached() {
    if (!hasMore || loadingMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    load(activeFiltersRef.current, nextPage, true);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgApp }} edges={["top"]}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 16, marginTop: 0 }}>
          <Text style={{ fontFamily: fonts.displayBold, fontSize: 32, color: colors.textPrimary, marginBottom: 4, letterSpacing: -1 }}>
            Explore 🧭
          </Text>
          <Text style={{ fontFamily: fonts.interRegular, fontSize: 16, color: colors.textSecondary }}>
            Browse all financial instruments
          </Text>
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
          marginBottom: 12,
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
            }}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Filter pills */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

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
              renderItem={({ item }) => (
                <View style={{ flex: numColumns > 1 ? 1 : undefined }}>
                  <InstrumentCard
                    item={item}
                    onPress={() => router.push(`/instrument/${item.instrument_id}`)}
                  />
                </View>
              )}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
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
    </SafeAreaView>
  );
}
