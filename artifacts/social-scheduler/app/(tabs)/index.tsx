import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
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
import { Post } from '@/types';

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  const colors = useColors();
  return (
    <View
      style={[
        statStyles.card,
        {
          backgroundColor: accent ? colors.primary : colors.card,
          borderColor: accent ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          statStyles.value,
          { color: accent ? colors.primaryForeground : colors.foreground, fontFamily: 'Poppins_900Black' },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          statStyles.label,
          { color: accent ? colors.primaryForeground : colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 32,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts, deletePost } = usePosts();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const published = posts.filter((p) => p.status === 'published').length;

  const upNext = posts
    .filter((p) => p.status === 'scheduled' && p.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())[0];

  const recent = posts.slice(0, 10);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: Platform.OS === 'web' ? 120 : 100 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
              Good vibes only
            </Text>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
                POST
              </Text>
              <Text style={[styles.titleAccent, { color: colors.primary, fontFamily: 'Poppins_900Black' }]}>
                LY
              </Text>
            </View>
          </View>
          <View style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
          </View>
        </View>

        {/* Decorative bar */}
        <View style={[styles.decorBar, { backgroundColor: colors.primary }]} />

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Total" value={posts.length} />
          <StatCard label="Scheduled" value={scheduled} accent />
          <StatCard label="Published" value={published} />
        </View>

        {/* Up Next */}
        {upNext && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
              Up Next
            </Text>
            <LinearGradient
              colors={['#F5E64220', '#FF3CAC20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.upNextCard, { borderColor: colors.primary }]}
            >
              <View style={styles.upNextInner}>
                <View style={[styles.upNextDot, { backgroundColor: colors.primary }]} />
                <Text
                  style={[styles.upNextContent, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
                  numberOfLines={2}
                >
                  {upNext.content}
                </Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Recent Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
              All Posts
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/create')}
              style={[styles.newBtn, { backgroundColor: colors.accent }]}
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {recent.length === 0 ? (
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Ionicons name="rocket-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                No posts yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                Create your first post to get started
              </Text>
            </View>
          ) : (
            recent.map((post: Post) => (
              <PostCard key={post.id} post={post} onDelete={deletePost} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating create button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, bottom: Platform.OS === 'web' ? 100 : 90 }]}
        onPress={() => router.push('/(tabs)/create')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={colors.primaryForeground} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: 13, marginBottom: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline' },
  title: { fontSize: 40, letterSpacing: -1 },
  titleAccent: { fontSize: 40, letterSpacing: -1 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  decorBar: {
    height: 4,
    width: 60,
    borderRadius: 2,
    transform: [{ rotate: '-2deg' }],
    marginTop: -8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 20 },
  newBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upNextCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  upNextInner: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  upNextDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  upNextContent: { flex: 1, fontSize: 14, lineHeight: 21 },
  empty: {
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 16, marginTop: 8 },
  emptySub: { fontSize: 13, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F5E642',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
