import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';
import { Post } from '@/types';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }

type FilterKey = 'all' | 'scheduled' | 'published' | 'draft';
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
];

export default function QueueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts, deletePost } = usePosts();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 120 : 100;

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [filter, setFilter] = useState<FilterKey>('all');

  const scheduledDays = useMemo(() => {
    const set = new Set<number>();
    for (const p of posts) {
      if (p.scheduledAt) {
        const d = new Date(p.scheduledAt);
        if (d.getFullYear() === calYear && d.getMonth() === calMonth) set.add(d.getDate());
      }
    }
    return set;
  }, [posts, calYear, calMonth]);

  const filteredPosts = useMemo(() => {
    let ps = filter === 'all' ? posts : posts.filter((p) => p.status === filter);
    if (selectedDay !== null) {
      ps = ps.filter((p) => {
        if (!p.scheduledAt) return false;
        const d = new Date(p.scheduledAt);
        return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === selectedDay;
      });
    }
    return ps;
  }, [posts, filter, selectedDay, calYear, calMonth]);

  const days = daysInMonth(calYear, calMonth);
  const firstDay = firstDayOfMonth(calYear, calMonth);
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
    setSelectedDay(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
            CAL<Text style={{ color: colors.primary }}>ENDAR</Text>
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/create')} style={[styles.addBtn, { backgroundColor: colors.accent }]} activeOpacity={0.85}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={[styles.decorBar, { backgroundColor: colors.primary }]} />

        {/* Month nav */}
        <View style={[styles.monthNav, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity onPress={prevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.monthLabel, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            {MONTHS_FULL[calMonth]} {calYear}
          </Text>
          <TouchableOpacity onPress={nextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-forward" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View style={[styles.calendar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Day headers */}
          <View style={styles.weekRow}>
            {DAYS.map((d, i) => (
              <Text key={i} style={[styles.dayHeader, { color: colors.mutedForeground, fontFamily: 'Poppins_700Bold' }]}>{d}</Text>
            ))}
          </View>

          {/* Day cells */}
          {Array.from({ length: cells.length / 7 }, (_, row) => (
            <View key={row} style={styles.weekRow}>
              {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
                const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                const isSelected = day === selectedDay;
                const hasPost = day !== null && scheduledDays.has(day);
                return (
                  <TouchableOpacity
                    key={col}
                    onPress={() => day && setSelectedDay(isSelected ? null : day)}
                    style={[
                      styles.dayCell,
                      isSelected && { backgroundColor: colors.primary, borderRadius: 12 },
                      isToday && !isSelected && { borderWidth: 1.5, borderColor: colors.accent, borderRadius: 12 },
                    ]}
                    disabled={!day}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dayNum,
                      { color: day ? (isSelected ? colors.primaryForeground : colors.foreground) : 'transparent', fontFamily: isToday ? 'Poppins_700Bold' : 'Poppins_400Regular' },
                    ]}>
                      {day ?? ''}
                    </Text>
                    {hasPost && (
                      <View style={[styles.postDot, { backgroundColor: isSelected ? colors.primaryForeground : colors.accent }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity key={f.key} onPress={() => setFilter(f.key)}
                style={[styles.filterChip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterText, { color: active ? colors.primaryForeground : colors.foreground, fontFamily: 'Poppins_700Bold' }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
          {selectedDay && (
            <TouchableOpacity onPress={() => setSelectedDay(null)} style={[styles.filterChip, { backgroundColor: colors.secondary, borderColor: colors.border }]} activeOpacity={0.75}>
              <Text style={[styles.filterText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                {selectedDay} {MONTHS[calMonth]}
              </Text>
              <Ionicons name="close" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Post list */}
        {filteredPosts.length === 0 ? (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
              {selectedDay ? `Nothing on ${selectedDay} ${MONTHS[calMonth]}` : 'Nothing here yet'}
            </Text>
          </View>
        ) : (
          filteredPosts.map((post: Post) => <PostCard key={post.id} post={post} onDelete={deletePost} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 32, letterSpacing: -1 },
  addBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  decorBar: { height: 4, width: 60, borderRadius: 2, transform: [{ rotate: '2deg' }], marginTop: -12, marginLeft: 4 },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 },
  monthLabel: { fontSize: 16 },
  calendar: { borderRadius: 20, borderWidth: 1, padding: 12, gap: 4 },
  weekRow: { flexDirection: 'row' },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 12, paddingVertical: 6, letterSpacing: 0.5 },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 6, gap: 2 },
  dayNum: { fontSize: 13, textAlign: 'center' },
  postDot: { width: 4, height: 4, borderRadius: 2 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  filterText: { fontSize: 13 },
  empty: { borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', padding: 40, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 14 },
});
