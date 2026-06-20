import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';
import { Post, PostStatus } from '@/types';

type FilterKey = 'all' | PostStatus;
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
];

function formatDay(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((d.getTime() - now.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function QueueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts, deletePost } = usePosts();
  const [filter, setFilter] = useState<FilterKey>('all');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((p) => p.status === filter);
  }, [posts, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of filtered) {
      const key = post.scheduledAt
        ? formatDay(post.scheduledAt)
        : post.status === 'published'
        ? 'Published'
        : 'Draft';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 16, paddingBottom: Platform.OS === 'web' ? 120 : 100 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
            QUEUE{' '}
            {posts.filter((p) => p.status === 'scheduled').length > 0 && (
              <Text style={{ color: colors.primary }}>
                {posts.filter((p) => p.status === 'scheduled').length}
              </Text>
            )}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/create')}
            style={[styles.addBtn, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Decorative accent */}
        <View style={[styles.decorBar, { backgroundColor: colors.accent }]} />

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isActive ? colors.primaryForeground : colors.foreground, fontFamily: 'Poppins_700Bold' },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Posts */}
        {grouped.length === 0 ? (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
              Nothing here yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
              Schedule your first post
            </Text>
          </View>
        ) : (
          grouped.map(([day, dayPosts]) => (
            <View key={day} style={styles.group}>
              <View style={styles.dayHeader}>
                <View style={[styles.dayLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dayLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_700Bold' }]}>
                  {day}
                </Text>
                <View style={[styles.dayLine, { backgroundColor: colors.border }]} />
              </View>
              {dayPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} onDelete={deletePost} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 36, letterSpacing: -1 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorBar: {
    height: 4,
    width: 50,
    borderRadius: 2,
    transform: [{ rotate: '2deg' }],
    marginTop: -12,
    marginLeft: 4,
  },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterText: { fontSize: 13 },
  empty: {
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 16, marginTop: 8 },
  emptySub: { fontSize: 13 },
  group: { gap: 12 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayLine: { flex: 1, height: 1 },
  dayLabel: { fontSize: 12, letterSpacing: 0.5 },
});
