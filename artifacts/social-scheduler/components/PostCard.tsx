import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  if (days === 0) {
    return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (days === 1) {
    return `Tomorrow ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (days > 1 && days < 7) {
    return d.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_COLOR: Record<string, string> = {
  scheduled: '#F5E642',
  published: '#00D4AA',
  draft: '#8888AA',
};

export function PostCard({ post, onDelete }: Props) {
  const colors = useColors();

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(post.id);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {post.mediaUri && (
        <Image source={{ uri: post.mediaUri }} style={styles.media} resizeMode="cover" />
      )}
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[post.status] }]} />
          <Text style={[styles.status, { color: STATUS_COLOR[post.status], fontFamily: 'Poppins_600SemiBold' }]}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </Text>
          <View style={[styles.formatBadge, { borderColor: colors.border }]}>
            <Text style={[styles.formatText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
              {FORMAT_LABELS[post.format]}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.content, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
          numberOfLines={2}
        >
          {post.content}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.platforms}>
            {post.platforms.map((p: SocialPlatform) => (
              <PlatformBadge key={p} platform={p} size="sm" />
            ))}
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
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: 140,
  },
  body: {
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  status: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  formatBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 4,
  },
  formatText: {
    fontSize: 10,
  },
  deleteBtn: {
    padding: 2,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  platforms: {
    flexDirection: 'row',
    gap: 6,
  },
  date: {
    fontSize: 12,
  },
});
