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

const SCHEDULE_OPTIONS: { key: ScheduleOption; label: string }[] = [
  { key: 'now', label: 'Now' },
  { key: '1h', label: 'In 1h' },
  { key: 'tonight', label: 'Tonight' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'next_week', label: 'Next Week' },
];

function getScheduledAt(option: ScheduleOption): string | null {
  const now = new Date();
  if (option === 'now') return null;
  if (option === '1h') {
    now.setHours(now.getHours() + 1);
    return now.toISOString();
  }
  if (option === 'tonight') {
    now.setHours(20, 0, 0, 0);
    if (now < new Date()) now.setDate(now.getDate() + 1);
    return now.toISOString();
  }
  if (option === 'tomorrow') {
    now.setDate(now.getDate() + 1);
    now.setHours(9, 0, 0, 0);
    return now.toISOString();
  }
  now.setDate(now.getDate() + 7);
  now.setHours(9, 0, 0, 0);
  return now.toISOString();
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
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['facebook']);
  const [format, setFormat] = useState<AspectRatio>('1:1');
  const [scheduleOption, setScheduleOption] = useState<ScheduleOption>('now');
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const connectedIds = new Set(accounts.filter((a) => a.connected).map((a) => a.platform));

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
    if (!content.trim()) {
      Alert.alert('Add content', 'Write something before posting.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      Alert.alert('Select platform', 'Choose at least one platform.');
      return;
    }

    const scheduledAt = getScheduledAt(scheduleOption);
    const status = scheduleOption === 'now' ? 'published' : 'scheduled';

    addPost({
      content: content.trim(),
      mediaUri: mediaUri ?? undefined,
      platforms: selectedPlatforms,
      format,
      scheduledAt,
      status,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(tabs)/');
  };

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
            NEW{' '}
            <Text style={{ color: colors.primary }}>POST</Text>
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

        {/* Platforms */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            PLATFORMS
          </Text>
          <View style={styles.platformRow}>
            {ALL_PLATFORMS.map((p) => {
              const isSelected = selectedPlatforms.includes(p);
              const isConnected = connectedIds.has(p);
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => togglePlatform(p)}
                  style={[
                    styles.platformChip,
                    {
                      backgroundColor: isSelected ? PLATFORM_COLORS[p] : colors.card,
                      borderColor: isSelected ? PLATFORM_COLORS[p] : colors.border,
                      opacity: isConnected ? 1 : 0.5,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <PlatformIcon platform={p} />
                  <Text
                    style={[
                      styles.platformLabel,
                      { color: isSelected ? '#fff' : colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' },
                    ]}
                  >
                    {PLATFORM_NAMES[p]}
                  </Text>
                  {!isConnected && (
                    <Ionicons name="lock-closed" size={10} color={isSelected ? '#fff' : colors.mutedForeground} />
                  )}
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
          <FormatSelector
            selected={format}
            onSelect={setFormat}
            selectedPlatforms={selectedPlatforms}
          />
        </View>

        {/* Media */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            MEDIA
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
                <TouchableOpacity
                  onPress={() => setMediaUri(null)}
                  style={[styles.removeMedia, { backgroundColor: colors.destructive }]}
                >
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
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
                fontFamily: 'Poppins_400Regular',
              },
            ]}
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
            WHEN
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scheduleRow}>
            {SCHEDULE_OPTIONS.map((opt) => {
              const isSelected = scheduleOption === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setScheduleOption(opt.key);
                  }}
                  style={[
                    styles.scheduleChip,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.scheduleText,
                      { color: isSelected ? '#fff' : colors.foreground, fontFamily: 'Poppins_700Bold' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 32, letterSpacing: -1 },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  postBtnText: { fontSize: 14 },
  section: { gap: 10 },
  label: { fontSize: 11, letterSpacing: 1.5 },
  platformRow: { flexDirection: 'row', gap: 10 },
  platformChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
  },
  platformLabel: { fontSize: 12 },
  mediaBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaBtnInner: { alignItems: 'center', gap: 8 },
  mediaBtnText: { fontSize: 13 },
  mediaPreview: { width: '100%', height: 180, borderRadius: 16 },
  removeMedia: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: { fontSize: 11, textAlign: 'right' },
  scheduleRow: { flexDirection: 'row', gap: 10 },
  scheduleChip: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  scheduleText: { fontSize: 13 },
});
