import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountCard } from '@/components/AccountCard';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function AccountsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { accounts, posts, toggleAccount } = usePosts();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const connected = accounts.filter((a) => a.connected);
  const totalFollowers = connected.reduce((sum, a) => sum + a.followers, 0);
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

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
            YOUR{' '}
            <Text style={{ color: colors.accent }}>CREW</Text>
          </Text>
        </View>

        {/* Decorative bar */}
        <View style={[styles.decorBar, { backgroundColor: colors.accent }]} />

        {/* Summary card */}
        <LinearGradient
          colors={['#FF3CAC20', '#F5E64220']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.summaryCard, { borderColor: colors.accent }]}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.primary, fontFamily: 'Poppins_900Black' }]}>
                {connected.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                Connected
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.accent, fontFamily: 'Poppins_900Black' }]}>
                {formatFollowers(totalFollowers)}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                Total Reach
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
                {scheduledCount}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                Queued
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Accounts list */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            Platforms
          </Text>
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} onToggle={toggleAccount} />
          ))}
        </View>

        {/* Info note */}
        <View style={[styles.note, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={18} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            Real OAuth connections will be wired in once API credentials are configured for each platform.
          </Text>
        </View>

        {/* Format compatibility section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            Format Guide
          </Text>
          {[
            { platform: 'TikTok', formats: ['9:16'], hint: 'Vertical only' },
            { platform: 'YouTube', formats: ['16:9', '9:16'], hint: 'Landscape + Shorts' },
            { platform: 'Facebook', formats: ['1:1', '4:5', '16:9', '9:16'], hint: 'All formats' },
          ].map((row) => (
            <View key={row.platform} style={[styles.formatRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.formatPlatform, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                {row.platform}
              </Text>
              <View style={styles.formatChips}>
                {row.formats.map((f) => (
                  <View key={f} style={[styles.formatChip, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.formatChipText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.formatHint, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                {row.hint}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 24 },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontSize: 36, letterSpacing: -1 },
  decorBar: {
    height: 4,
    width: 60,
    borderRadius: 2,
    transform: [{ rotate: '-1.5deg' }],
    marginTop: -14,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center', gap: 4, flex: 1 },
  summaryValue: { fontSize: 28 },
  summaryLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center' },
  divider: { width: 1, height: 40 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20 },
  note: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'flex-start',
  },
  noteText: { fontSize: 12, lineHeight: 18, flex: 1 },
  formatRow: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  formatPlatform: { fontSize: 14 },
  formatChips: { flexDirection: 'row', gap: 6 },
  formatChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  formatChipText: { fontSize: 11 },
  formatHint: { fontSize: 12 },
});
