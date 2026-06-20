import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Platform, PLATFORM_COLORS, PLATFORM_NAMES, Post } from '@/types';

interface Props {
  posts: Post[];
}

const ALL_PLATFORMS: Platform[] = ['facebook', 'youtube', 'tiktok'];

export function AnalyticsSection({ posts }: Props) {
  const colors = useColors();

  const stats = useMemo(() => {
    const total = posts.length;
    const scheduled = posts.filter((p) => p.status === 'scheduled').length;
    const published = posts.filter((p) => p.status === 'published').length;

    const perPlatform = ALL_PLATFORMS.map((p) => ({
      platform: p,
      total: posts.filter((post) => post.platforms.includes(p)).length,
      scheduled: posts.filter((post) => post.platforms.includes(p) && post.status === 'scheduled').length,
      published: posts.filter((post) => post.platforms.includes(p) && post.status === 'published').length,
    }));

    const maxTotal = Math.max(...perPlatform.map((s) => s.total), 1);

    const thisWeek = posts.filter((p) => {
      const d = new Date(p.createdAt);
      const now = new Date();
      return now.getTime() - d.getTime() < 7 * 86400000;
    }).length;

    return { total, scheduled, published, perPlatform, maxTotal, thisWeek };
  }, [posts]);

  if (posts.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Analytics</Text>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <Text style={[styles.summaryVal, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>{stats.thisWeek}</Text>
          <Text style={[styles.summaryLbl, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>This Week</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
          <Text style={[styles.summaryVal, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>{stats.published}</Text>
          <Text style={[styles.summaryLbl, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Published</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="time-outline" size={18} color={colors.accent} />
          <Text style={[styles.summaryVal, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>{stats.scheduled}</Text>
          <Text style={[styles.summaryLbl, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Queued</Text>
        </View>
      </View>

      {/* Platform bars */}
      <View style={[styles.barsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.barsTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>By Platform</Text>
        {stats.perPlatform.map((s) => (
          <View key={s.platform} style={styles.barRow}>
            <Text style={[styles.barLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
              {PLATFORM_NAMES[s.platform]}
            </Text>
            <View style={[styles.barTrack, { backgroundColor: colors.secondary }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(s.total / stats.maxTotal) * 100}%`,
                    backgroundColor: PLATFORM_COLORS[s.platform],
                  },
                ]}
              />
            </View>
            <Text style={[styles.barCount, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
              {s.total}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  sectionTitle: { fontSize: 20 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  summaryVal: { fontSize: 22 },
  summaryLbl: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },
  barsCard: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 12 },
  barsTitle: { fontSize: 14, marginBottom: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { width: 70, fontSize: 12 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barCount: { width: 24, fontSize: 13, textAlign: 'right' },
});
