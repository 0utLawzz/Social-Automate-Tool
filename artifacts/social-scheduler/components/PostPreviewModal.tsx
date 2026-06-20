import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Platform as SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  content: string;
  mediaUri?: string | null;
  platforms: SocialPlatform[];
  handle: string;
}

function FacebookPreview({ content, mediaUri, handle }: { content: string; mediaUri?: string | null; handle: string }) {
  const colors = useColors();
  return (
    <View style={[fbStyles.card, { backgroundColor: '#fff', borderColor: '#ddd' }]}>
      <View style={fbStyles.header}>
        <View style={[fbStyles.avatar, { backgroundColor: PLATFORM_COLORS.facebook }]}>
          <FontAwesome name="facebook" size={16} color="#fff" />
        </View>
        <View>
          <Text style={[fbStyles.name, { color: '#050505' }]}>{handle || 'Your Page'}</Text>
          <Text style={[fbStyles.time, { color: '#65676B' }]}>Just now · Public</Text>
        </View>
      </View>
      <Text style={[fbStyles.content, { color: '#050505' }]}>{content || 'Your caption goes here...'}</Text>
      {mediaUri && <Image source={{ uri: mediaUri }} style={fbStyles.media} resizeMode="cover" />}
      <View style={[fbStyles.reactions, { borderTopColor: '#e4e6eb' }]}>
        {['Like', 'Comment', 'Share'].map((a) => (
          <View key={a} style={fbStyles.action}>
            <Text style={{ color: '#65676B', fontSize: 13, fontWeight: '600' }}>{a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const fbStyles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  header: { flexDirection: 'row', gap: 10, padding: 12, alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '700', fontSize: 14 },
  time: { fontSize: 12 },
  content: { paddingHorizontal: 12, paddingBottom: 12, fontSize: 14, lineHeight: 20 },
  media: { width: '100%', height: 200 },
  reactions: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 4 },
  action: { flex: 1, alignItems: 'center', paddingVertical: 8 },
});

function YouTubePreview({ content, mediaUri, handle }: { content: string; mediaUri?: string | null; handle: string }) {
  const title = content.split('\n')[0] || 'Your video title';
  return (
    <View style={ytStyles.card}>
      <View style={ytStyles.thumb}>
        {mediaUri
          ? <Image source={{ uri: mediaUri }} style={ytStyles.thumbImg} resizeMode="cover" />
          : <View style={[ytStyles.thumbPlaceholder, { backgroundColor: '#333' }]}>
              <FontAwesome name="youtube-play" size={40} color="#FF0000" />
            </View>
        }
        <View style={ytStyles.duration}><Text style={ytStyles.durationText}>0:30</Text></View>
      </View>
      <View style={ytStyles.info}>
        <View style={[ytStyles.avatar, { backgroundColor: PLATFORM_COLORS.youtube }]}>
          <FontAwesome name="youtube-play" size={14} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ytStyles.title} numberOfLines={2}>{title}</Text>
          <Text style={ytStyles.channel}>{handle || 'Your Channel'}</Text>
          <Text style={ytStyles.stats}>0 views · Just now</Text>
        </View>
      </View>
    </View>
  );
}

const ytStyles = StyleSheet.create({
  card: { backgroundColor: '#0F0F0F', borderRadius: 12, overflow: 'hidden' },
  thumb: { width: '100%', height: 200, backgroundColor: '#222' },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  duration: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#000000CC', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  durationText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  info: { flexDirection: 'row', gap: 10, padding: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  title: { color: '#fff', fontWeight: '700', fontSize: 14, lineHeight: 20 },
  channel: { color: '#aaa', fontSize: 12, marginTop: 2 },
  stats: { color: '#aaa', fontSize: 12 },
});

function TikTokPreview({ content, mediaUri, handle }: { content: string; mediaUri?: string | null; handle: string }) {
  return (
    <View style={ttStyles.card}>
      {mediaUri
        ? <Image source={{ uri: mediaUri }} style={ttStyles.bg} resizeMode="cover" />
        : <View style={[ttStyles.bg, { backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name="music-note" size={48} color="#69C9D0" />
          </View>
      }
      <View style={ttStyles.overlay} />
      <View style={ttStyles.bottomInfo}>
        <Text style={ttStyles.user}>{handle || '@youraccount'}</Text>
        <Text style={ttStyles.caption} numberOfLines={2}>{content || 'Your caption here...'}</Text>
      </View>
      <View style={ttStyles.actions}>
        {[{ icon: 'heart', count: '0' }, { icon: 'chatbubble', count: '0' }, { icon: 'arrow-redo', count: '0' }].map((a) => (
          <View key={a.icon} style={ttStyles.action}>
            <Ionicons name={a.icon as any} size={28} color="#fff" />
            <Text style={ttStyles.actionCount}>{a.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const ttStyles = StyleSheet.create({
  card: { borderRadius: 16, overflow: 'hidden', height: 340, backgroundColor: '#000' },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000040' },
  bottomInfo: { position: 'absolute', bottom: 20, left: 12, right: 60 },
  user: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  caption: { color: '#fff', fontSize: 13, lineHeight: 18 },
  actions: { position: 'absolute', right: 8, bottom: 20, gap: 16, alignItems: 'center' },
  action: { alignItems: 'center', gap: 2 },
  actionCount: { color: '#fff', fontSize: 11, fontWeight: '700' },
});

export function PostPreviewModal({ visible, onClose, content, mediaUri, platforms, handle }: Props) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<SocialPlatform>(platforms[0] ?? 'facebook');

  const activePlatforms = platforms.length > 0 ? platforms : (['facebook'] as SocialPlatform[]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.handle} />
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Post Preview</Text>

        {/* Platform tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {activePlatforms.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setActiveTab(p)}
              style={[styles.tab, { backgroundColor: activeTab === p ? PLATFORM_COLORS[p] : colors.secondary, borderColor: activeTab === p ? PLATFORM_COLORS[p] : colors.border }]}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, { color: activeTab === p ? '#fff' : colors.mutedForeground, fontFamily: 'Poppins_700Bold' }]}>
                {PLATFORM_NAMES[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
          {activeTab === 'facebook' && <FacebookPreview content={content} mediaUri={mediaUri} handle={handle} />}
          {activeTab === 'youtube' && <YouTubePreview content={content} mediaUri={mediaUri} handle={handle} />}
          {activeTab === 'tiktok' && <TikTokPreview content={content} mediaUri={mediaUri} handle={handle} />}
        </ScrollView>

        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
          <Text style={[styles.closeBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000070' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, padding: 24, maxHeight: '85%', gap: 16 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#555', alignSelf: 'center' },
  title: { fontSize: 18 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  tabText: { fontSize: 13 },
  previewScroll: { maxHeight: 380 },
  closeBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  closeBtnText: { fontSize: 15 },
});
