import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormatSelector } from '@/components/FormatSelector';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';
import { AspectRatio, Platform as SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@/types';

type ScheduleOption = 'now' | '1h' | 'tonight' | 'tomorrow' | 'next_week';

const SCHEDULE_OPTIONS: { key: ScheduleOption; label: string; desc: string }[] = [
  { key: 'now', label: 'Now', desc: 'Post immediately' },
  { key: '1h', label: 'In 1h', desc: 'Within the hour' },
  { key: 'tonight', label: 'Tonight', desc: '8:00 PM today' },
  { key: 'tomorrow', label: 'Tomorrow', desc: '9:00 AM' },
  { key: 'next_week', label: 'Next Week', desc: '9:00 AM' },
];

function getScheduledAt(option: ScheduleOption): string | null {
  const now = new Date();
  if (option === 'now') return null;
  if (option === '1h') { now.setHours(now.getHours() + 1); return now.toISOString(); }
  if (option === 'tonight') {
    now.setHours(20, 0, 0, 0);
    if (now < new Date()) now.setDate(now.getDate() + 1);
    return now.toISOString();
  }
  if (option === 'tomorrow') { now.setDate(now.getDate() + 1); now.setHours(9, 0, 0, 0); return now.toISOString(); }
  now.setDate(now.getDate() + 7); now.setHours(9, 0, 0, 0); return now.toISOString();
}

const ALL_PLATFORMS: SocialPlatform[] = ['facebook', 'youtube', 'tiktok'];

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'facebook') return <FontAwesome name="facebook" size={18} color="#fff" />;
  if (platform === 'youtube') return <FontAwesome name="youtube-play" size={18} color="#fff" />;
  return <MaterialCommunityIcons name="music-note" size={18} color="#fff" />;
}

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addPost, accounts } = usePosts();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 120 : 100;

  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [format, setFormat] = useState<AspectRatio>('1:1');
  const [scheduleOption, setScheduleOption] = useState<ScheduleOption>('now');
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const connectedAccounts = accounts.filter((a) => a.connected);

  const togglePlatform = (p: SocialPlatform) => {
    Haptics.selectionAsync();
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) { Alert.alert('Add a caption', 'Write something before posting.'); return; }
    if (selectedPlatforms.length === 0) { Alert.alert('Select a platform', 'Choose at least one platform to post to.'); return; }
    const scheduledAt = getScheduledAt(scheduleOption);
    const status = scheduleOption === 'now' ? 'published' : 'scheduled';
    addPost({ content: content.trim(), mediaUri: mediaUri ?? undefined, platforms: selectedPlatforms, format, scheduledAt, status });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setContent('');
    setSelectedPlatforms([]);
    setMediaUri(null);
    setScheduleOption('now');
    router.push('/(tabs)/');
  };

  if (connectedAccounts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.noAccountsWrap, { paddingTop: topPad + 60 }]}>
          <Ionicons name="people-outline" size={56} color={colors.mutedForeground} />
          <Text style={[styles.noAccountsTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            Connect an Account First
          </Text>
          <Text style={[styles.noAccountsDesc, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            Go to the Accounts tab and connect your Facebook, YouTube, or TikTok account before creating a post.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/accounts')}
            style={[styles.goAccountsBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.goAccountsBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>
              Go to Accounts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
            NEW <Text style={{ color: colors.primary }}>POST</Text>
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.postBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.postBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>
              {scheduleOption === 'now' ? 'Publish' : 'Schedule'}
            </Text>
            <Ionicons name={scheduleOption === 'now' ? 'send' : 'calendar'} size={16} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>

        {/* Platforms — only show connected ones */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            POST TO
          </Text>
          <View style={styles.platformRow}>
            {connectedAccounts.map((acc) => {
              const isSelected = selectedPlatforms.includes(acc.platform);
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => togglePlatform(acc.platform)}
                  style={[
                    styles.platformChip,
                    {
                      backgroundColor: isSelected ? PLATFORM_COLORS[acc.platform] : colors.card,
                      borderColor: isSelected ? PLATFORM_COLORS[acc.platform] : colors.border,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <PlatformIcon platform={acc.platform} />
                  <View style={styles.platformChipInfo}>
                    <Text style={[styles.platformLabel, { color: isSelected ? '#fff' : colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                      {PLATFORM_NAMES[acc.platform]}
                    </Text>
                    <Text style={[styles.platformHandle, { color: isSelected ? '#ffffff99' : colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                      {acc.handle}
                    </Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color="#fff" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Format */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            FORMAT
          </Text>
          <FormatSelector selected={format} onSelect={setFormat} selectedPlatforms={selectedPlatforms} />
        </View>

        {/* Media */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            MEDIA (optional)
          </Text>
          <TouchableOpacity
            onPress={pickMedia}
            style={[
              styles.mediaBtn,
              {
                backgroundColor: mediaUri ? 'transparent' : colors.card,
                borderColor: mediaUri ? colors.primary : colors.border,
                borderWidth: mediaUri ? 2 : 1,
                height: mediaUri ? undefined : 100,
              },
            ]}
            activeOpacity={0.8}
          >
            {mediaUri ? (
              <>
                <Image source={{ uri: mediaUri }} style={styles.mediaPreview} resizeMode="cover" />
                <TouchableOpacity onPress={() => setMediaUri(null)} style={[styles.removeMedia, { backgroundColor: colors.destructive }]}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.mediaBtnInner}>
                <Ionicons name="image-outline" size={28} color={colors.mutedForeground} />
                <Text style={[styles.mediaBtnText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                  Add Photo or Video
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Caption */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            CAPTION
          </Text>
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
          <Text style={[styles.charCount, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            {content.length} / 2200
          </Text>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            WHEN TO POST
          </Text>
          <View style={styles.scheduleGrid}>
            {SCHEDULE_OPTIONS.map((opt) => {
              const isSelected = scheduleOption === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => { Haptics.selectionAsync(); setScheduleOption(opt.key); }}
                  style={[
                    styles.scheduleChip,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.scheduleLabel, { color: isSelected ? '#fff' : colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.scheduleDesc, { color: isSelected ? '#ffffff99' : colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                    {opt.desc}
                  </Text>
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
  noAccountsWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  noAccountsTitle: { fontSize: 22, textAlign: 'center' },
  noAccountsDesc: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  goAccountsBtn: { borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32, marginTop: 8 },
  goAccountsBtnText: { fontSize: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 32, letterSpacing: -1 },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 },
  postBtnText: { fontSize: 14 },
  section: { gap: 10 },
  label: { fontSize: 11, letterSpacing: 1.5 },
  platformRow: { gap: 10 },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
  },
  platformChipInfo: { flex: 1 },
  platformLabel: { fontSize: 14 },
  platformHandle: { fontSize: 11, marginTop: 1 },
  mediaBtn: { borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  mediaBtnInner: { alignItems: 'center', gap: 8 },
  mediaBtnText: { fontSize: 13 },
  mediaPreview: { width: '100%', height: 180, borderRadius: 16 },
  removeMedia: {
    position: 'absolute', top: 8, right: 8, width: 26, height: 26,
    borderRadius: 13, alignItems: 'center', justifyContent: 'center',
  },
  textInput: { borderWidth: 1, borderRadius: 16, padding: 16, fontSize: 15, minHeight: 120, lineHeight: 22 },
  charCount: { fontSize: 11, textAlign: 'right' },
  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  scheduleChip: { borderWidth: 1.5, borderRadius: 14, padding: 14, minWidth: '45%', flex: 1 },
  scheduleLabel: { fontSize: 14 },
  scheduleDesc: { fontSize: 11, marginTop: 2 },
});
