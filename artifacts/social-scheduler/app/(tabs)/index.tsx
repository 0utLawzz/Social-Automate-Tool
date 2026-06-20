import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';
import { Post } from '@/types';

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  const colors = useColors();
  return (
    <View style={[stat.card, { backgroundColor: accent ? colors.primary : colors.card, borderColor: accent ? colors.primary : colors.border }]}>
      <Text style={[stat.value, { color: accent ? colors.primaryForeground : colors.foreground, fontFamily: 'Poppins_900Black' }]}>{value}</Text>
      <Text style={[stat.label, { color: accent ? colors.primaryForeground : colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>{label}</Text>
    </View>
  );
}
const stat = StyleSheet.create({
  card: { flex: 1, borderRadius: 20, borderWidth: 1, padding: 16, alignItems: 'center', gap: 4 },
  value: { fontSize: 32 },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center' },
});

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts, accounts, deletePost } = usePosts();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 120 : 100;

  const connected = accounts.filter((a) => a.connected);
  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const published = posts.filter((p) => p.status === 'published').length;
  const isFirstTime = connected.length === 0 && posts.length === 0;

  const upNext = posts
    .filter((p) => p.status === 'scheduled' && p.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>Good vibes only</Text>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>POST</Text>
              <Text style={[styles.title, { color: colors.primary, fontFamily: 'Poppins_900Black' }]}>LY</Text>
            </View>
          </View>
          <View style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
          </View>
        </View>
        <View style={[styles.decorBar, { backgroundColor: colors.primary }]} />

        {isFirstTime ? (
          <LinearGradient colors={['#F5E64215', '#FF3CAC15']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.onboardCard, { borderColor: colors.primary }]}>
            <Text style={[styles.onboardBig, { color: colors.primary, fontFamily: 'Poppins_900Black' }]}>START</Text>
            <Text style={[styles.onboardTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Welcome to Postly</Text>
            <Text style={[styles.onboardDesc, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
              Connect your social accounts and start scheduling posts across Facebook, YouTube, and TikTok — all in one place.
            </Text>
            {[{ num: '1', text: 'Connect your accounts' }, { num: '2', text: 'Create your first post' }, { num: '3', text: 'Pick a time to go live' }].map((s) => (
              <View key={s.num} style={styles.step}>
                <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.stepNumText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>{s.num}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}>{s.text}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => router.push('/(tabs)/accounts')} style={[styles.onboardBtn, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
              <Text style={[styles.onboardBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>Connect Accounts</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.primaryForeground} />
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <>
            {/* Stats */}
            <View style={styles.statsRow}>
              <StatCard label="Total" value={posts.length} />
              <StatCard label="Scheduled" value={scheduled} accent />
              <StatCard label="Published" value={published} />
            </View>

            {/* Up Next */}
            {upNext && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Up Next</Text>
                <LinearGradient colors={['#F5E64220', '#FF3CAC20']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.upCard, { borderColor: colors.primary }]}>
                  <View style={styles.upRow}>
                    <View style={[styles.upDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.upContent, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]} numberOfLines={2}>{upNext.content}</Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Analytics */}
            <AnalyticsSection posts={posts} />

            {/* Posts */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>All Posts</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/create')} style={[styles.newBtn, { backgroundColor: colors.accent }]}>
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              {posts.length === 0 ? (
                <View style={[styles.empty, { borderColor: colors.border }]}>
                  <Ionicons name="rocket-outline" size={40} color={colors.mutedForeground} />
                  <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>No posts yet</Text>
                  <Text style={[styles.emptySub, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>Tap + to create your first post</Text>
                </View>
              ) : (
                posts.slice(0, 10).map((post: Post) => <PostCard key={post.id} post={post} onDelete={deletePost} />)
              )}
            </View>
          </>
        )}
      </ScrollView>
      {connected.length > 0 && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, bottom: Platform.OS === 'web' ? 100 : 90 }]} onPress={() => router.push('/(tabs)/create')} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color={colors.primaryForeground} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 13, marginBottom: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline' },
  title: { fontSize: 40, letterSpacing: -1 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  decorBar: { height: 4, width: 60, borderRadius: 2, transform: [{ rotate: '-2deg' }], marginTop: -8 },
  statsRow: { flexDirection: 'row', gap: 10 },
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20 },
  newBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  upCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  upRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  upDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  upContent: { flex: 1, fontSize: 14, lineHeight: 21 },
  empty: { borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', padding: 40, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, marginTop: 8 },
  emptySub: { fontSize: 13, textAlign: 'center' },
  fab: { position: 'absolute', right: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#F5E642', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  onboardCard: { borderRadius: 24, borderWidth: 1.5, padding: 24, gap: 16 },
  onboardBig: { fontSize: 28, letterSpacing: 4 },
  onboardTitle: { fontSize: 22 },
  onboardDesc: { fontSize: 14, lineHeight: 22 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 13 },
  stepText: { fontSize: 14 },
  onboardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, paddingVertical: 14, marginTop: 4 },
  onboardBtnText: { fontSize: 15 },
});
