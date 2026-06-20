import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Image, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BestTimePicker } from '@/components/BestTimePicker';
import { CaptionTemplates } from '@/components/CaptionTemplates';
import { FormatSelector } from '@/components/FormatSelector';
import { HashtagSuggester } from '@/components/HashtagSuggester';
import { PostPreviewModal } from '@/components/PostPreviewModal';
import { useLibrary } from '@/context/LibraryContext';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';
import { AspectRatio, Platform as SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@/types';

type ScheduleKey = 'now' | '1h' | 'tonight' | 'tomorrow' | 'next_week';

const SCHEDULE_OPTIONS: { key: ScheduleKey; label: string; desc: string }[] = [
  { key: 'now', label: 'Now', desc: 'Post immediately' },
  { key: '1h', label: 'In 1h', desc: 'Within the hour' },
  { key: 'tonight', label: 'Tonight', desc: '8:00 PM today' },
  { key: 'tomorrow', label: 'Tomorrow', desc: '9:00 AM' },
  { key: 'next_week', label: 'Next Week', desc: '9:00 AM' },
];

function getScheduledAt(key: ScheduleKey): string | null {
  const d = new Date();
  if (key === 'now') return null;
  if (key === '1h') { d.setHours(d.getHours() + 1); return d.toISOString(); }
  if (key === 'tonight') { d.setHours(20, 0, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1); return d.toISOString(); }
  if (key === 'tomorrow') { d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d.toISOString(); }
  d.setDate(d.getDate() + 7); d.setHours(9, 0, 0, 0); return d.toISOString();
}

function PIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'facebook') return <FontAwesome name="facebook" size={18} color="#fff" />;
  if (platform === 'youtube') return <FontAwesome name="youtube-play" size={18} color="#fff" />;
  return <MaterialCommunityIcons name="music-note" size={18} color="#fff" />;
}

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addPost, accounts } = usePosts();
  const { mediaItems } = useLibrary();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 120 : 100;

  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [format, setFormat] = useState<AspectRatio>('1:1');
  const [scheduleKey, setScheduleKey] = useState<ScheduleKey>('now');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const connected = accounts.filter((a) => a.connected);

  const toggle = (p: SocialPlatform) => {
    Haptics.selectionAsync();
    setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], allowsEditing: true, quality: 0.85 });
    if (!result.canceled && result.assets[0]) setMediaUri(result.assets[0].uri);
  };

  const insertHashtag = (tag: string) => {
    setContent((prev) => (prev.endsWith(' ') || prev === '' ? prev + tag : prev + ' ' + tag));
    Haptics.selectionAsync();
  };

  const handleBestTime = (key: string) => {
    setScheduleKey(key as ScheduleKey);
    Haptics.selectionAsync();
  };

  const handleSubmit = () => {
    if (!content.trim()) { Alert.alert('Add a caption', 'Write something before posting.'); return; }
    if (selectedPlatforms.length === 0) { Alert.alert('Select a platform', 'Choose at least one platform.'); return; }
    const scheduledAt = getScheduledAt(scheduleKey);
    const status = scheduleKey === 'now' ? 'published' : 'scheduled';
    addPost({ content: content.trim(), mediaUri: mediaUri ?? undefined, platforms: selectedPlatforms, format, scheduledAt, status, campaignName: campaignName.trim() || undefined });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setContent(''); setSelectedPlatforms([]); setMediaUri(null); setScheduleKey('now'); setCampaignName('');
    router.push('/(tabs)/');
  };

  const firstConnected = connected.find((a) => selectedPlatforms.includes(a.platform));

  if (connected.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.noAccounts, { paddingTop: topPad + 60 }]}>
          <Ionicons name="people-outline" size={56} color={colors.mutedForeground} />
          <Text style={[styles.noAccountsTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Connect an Account First</Text>
          <Text style={[styles.noAccountsDesc, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>Go to the Accounts tab and connect Facebook, YouTube, or TikTok before creating a post.</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/accounts')} style={[styles.goBtn, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
            <Text style={[styles.goBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>Go to Accounts</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PostPreviewModal
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        content={content}
        mediaUri={mediaUri}
        platforms={selectedPlatforms.length > 0 ? selectedPlatforms : connected.map((a) => a.platform)}
        handle={firstConnected?.handle ?? ''}
      />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
            NEW <Text style={{ color: colors.primary }}>POST</Text>
          </Text>
          <View style={styles.headerBtns}>
            <TouchableOpacity onPress={() => setShowPreview(true)} style={[styles.previewBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]} activeOpacity={0.8}>
              <Ionicons name="eye-outline" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.postBtn, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
              <Text style={[styles.postBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>
                {scheduleKey === 'now' ? 'Publish' : 'Schedule'}
              </Text>
              <Ionicons name={scheduleKey === 'now' ? 'send' : 'calendar'} size={15} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Platforms */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>POST TO</Text>
          <View style={styles.platformList}>
            {connected.map((acc) => {
              const sel = selectedPlatforms.includes(acc.platform);
              return (
                <TouchableOpacity key={acc.id} onPress={() => toggle(acc.platform)}
                  style={[styles.platformChip, { backgroundColor: sel ? PLATFORM_COLORS[acc.platform] : colors.card, borderColor: sel ? PLATFORM_COLORS[acc.platform] : colors.border }]}
                  activeOpacity={0.75}
                >
                  <PIcon platform={acc.platform} />
                  <View style={styles.platformInfo}>
                    <Text style={[styles.platformName, { color: sel ? '#fff' : colors.foreground, fontFamily: 'Poppins_700Bold' }]}>{PLATFORM_NAMES[acc.platform]}</Text>
                    <Text style={[styles.platformHandle, { color: sel ? '#ffffff99' : colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>{acc.handle}</Text>
                  </View>
                  {sel && <Ionicons name="checkmark-circle" size={18} color="#fff" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Format */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>FORMAT</Text>
          <FormatSelector selected={format} onSelect={setFormat} selectedPlatforms={selectedPlatforms} />
        </View>

        {/* Media */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>MEDIA (optional)</Text>

          {/* Library quick pick */}
          {mediaItems.length > 0 && !mediaUri && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.libraryRow}>
              {mediaItems.slice(0, 5).map((item) => (
                <TouchableOpacity key={item.id} onPress={() => setMediaUri(item.uri)} style={[styles.libraryThumb, { borderColor: colors.border }]} activeOpacity={0.8}>
                  <Image source={{ uri: item.uri }} style={styles.libraryThumbImg} resizeMode="cover" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={pickFromGallery} style={[styles.libraryAdd, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.8}>
                <Ionicons name="add" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Main picker */}
          {!mediaUri ? (
            <TouchableOpacity onPress={pickFromGallery} style={[styles.mediaPicker, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.8}>
              <Ionicons name="image-outline" size={28} color={colors.mutedForeground} />
              <Text style={[styles.mediaPickerText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                {mediaItems.length > 0 ? 'Pick from gallery' : 'Add Photo or Video'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.mediaPreviewWrap}>
              <Image source={{ uri: mediaUri }} style={styles.mediaPreview} resizeMode="cover" />
              <TouchableOpacity onPress={() => setMediaUri(null)} style={[styles.removeMedia, { backgroundColor: colors.destructive }]}>
                <Ionicons name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Caption */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>CAPTION</Text>
          <CaptionTemplates onSelect={setContent} currentCaption={content} />
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
            placeholder="What's the vibe today?"
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
            maxLength={2200}
          />
          <Text style={[styles.charCount, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>{content.length} / 2200</Text>
        </View>

        {/* Hashtag Suggester */}
        <HashtagSuggester caption={content} onInsert={insertHashtag} />

        {/* Best Time */}
        <BestTimePicker platforms={selectedPlatforms} onSelectTime={handleBestTime} />

        {/* Campaign */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>CAMPAIGN (optional)</Text>
          <TextInput
            style={[styles.campaignInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
            placeholder="e.g. Summer Launch, Q3 Promo"
            placeholderTextColor={colors.mutedForeground}
            value={campaignName}
            onChangeText={setCampaignName}
            returnKeyType="done"
          />
        </View>

        {/* When */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>WHEN TO POST</Text>
          <View style={styles.scheduleGrid}>
            {SCHEDULE_OPTIONS.map((opt) => {
              const sel = scheduleKey === opt.key;
              return (
                <TouchableOpacity key={opt.key} onPress={() => { Haptics.selectionAsync(); setScheduleKey(opt.key); }}
                  style={[styles.schedChip, { backgroundColor: sel ? colors.accent : colors.card, borderColor: sel ? colors.accent : colors.border }]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.schedLabel, { color: sel ? '#fff' : colors.foreground, fontFamily: 'Poppins_700Bold' }]}>{opt.label}</Text>
                  <Text style={[styles.schedDesc, { color: sel ? '#ffffff99' : colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>{opt.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 24 },
  noAccounts: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  noAccountsTitle: { fontSize: 22, textAlign: 'center' },
  noAccountsDesc: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  goBtn: { borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32, marginTop: 8 },
  goBtnText: { fontSize: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 32, letterSpacing: -1 },
  headerBtns: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  previewBtn: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 },
  postBtnText: { fontSize: 14 },
  section: { gap: 10 },
  label: { fontSize: 11, letterSpacing: 1.5 },
  platformList: { gap: 10 },
  platformChip: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 16, padding: 14 },
  platformInfo: { flex: 1 },
  platformName: { fontSize: 14 },
  platformHandle: { fontSize: 11, marginTop: 1 },
  libraryRow: { flexDirection: 'row', gap: 8 },
  libraryThumb: { width: 60, height: 60, borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  libraryThumbImg: { width: '100%', height: '100%' },
  libraryAdd: { width: 60, height: 60, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  mediaPicker: { borderRadius: 16, borderWidth: 1, height: 100, alignItems: 'center', justifyContent: 'center', gap: 8 },
  mediaPickerText: { fontSize: 13 },
  mediaPreviewWrap: { borderRadius: 16, overflow: 'hidden', position: 'relative' },
  mediaPreview: { width: '100%', height: 180, borderRadius: 16 },
  removeMedia: { position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  textInput: { borderWidth: 1, borderRadius: 16, padding: 16, fontSize: 15, minHeight: 120, lineHeight: 22 },
  charCount: { fontSize: 11, textAlign: 'right' },
  campaignInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  schedChip: { borderWidth: 1.5, borderRadius: 14, padding: 14, minWidth: '45%', flex: 1 },
  schedLabel: { fontSize: 14 },
  schedDesc: { fontSize: 11, marginTop: 2 },
});
