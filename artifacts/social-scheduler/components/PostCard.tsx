import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { FORMAT_LABELS, Platform as SocialPlatform, Post } from '@/types';
import { PlatformBadge } from './PlatformBadge';

interface Props {
  post: Post;
  onDelete: (id: string) => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Published';
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (days === 1) return `Tomorrow ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (days > 1 && days < 7) return d.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#FFE600',
  published: '#00D4AA',
  draft: '#8080A0',
};

export function PostCard({ post, onDelete }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
      {/* Accent left bar */}
      <View style={[styles.accentBar, { backgroundColor: STATUS_COLORS[post.status] }]} />

      {post.mediaUri && <Image source={{ uri: post.mediaUri }} style={styles.media} resizeMode="cover" />}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.statusPill, { backgroundColor: `${STATUS_COLORS[post.status]}22`, borderColor: `${STATUS_COLORS[post.status]}55` }]}>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[post.status] }]} />
            <Text style={[styles.statusText, { color: STATUS_COLORS[post.status], fontFamily: 'Poppins_600SemiBold' }]}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Text>
          </View>

          <View style={[styles.formatBadge, { borderColor: colors.glassBorder, backgroundColor: colors.muted }]}>
            <Text style={[styles.formatText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
              {FORMAT_LABELS[post.format]}
            </Text>
          </View>

          {post.campaignName && (
            <View style={[styles.campaignBadge, { backgroundColor: `${colors.accent}20`, borderColor: `${colors.accent}40` }]}>
              <Text style={[styles.campaignText, { color: colors.accent, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={1}>
                {post.campaignName}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onDelete(post.id); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.content, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]} numberOfLines={2}>
          {post.content}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.platforms}>
            {post.platforms.map((p: SocialPlatform) => <PlatformBadge key={p} platform={p} size="sm" />)}
          </View>
          <Text style={[styles.date, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            {formatDate(post.scheduledAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  accentBar: { height: 3, width: '100%' },
  media: { width: '100%', height: 140 },
  body: { padding: 16, gap: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  formatBadge: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 2 },
  formatText: { fontSize: 10 },
  campaignBadge: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 2, maxWidth: 90 },
  campaignText: { fontSize: 10 },
  content: { fontSize: 14, lineHeight: 21 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  platforms: { flexDirection: 'row', gap: 6 },
  date: { fontSize: 12 },
});
