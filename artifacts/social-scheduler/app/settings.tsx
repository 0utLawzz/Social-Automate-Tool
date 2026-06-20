import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Linking, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiKeys, useSettings } from '@/context/SettingsContext';
import { useColors } from '@/hooks/useColors';

const PLATFORM_CONFIG = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    icon: 'facebook' as const,
    iconLib: 'FontAwesome' as const,
    fields: [
      { key: 'appId' as const, label: 'App ID', hint: 'From your Facebook App Dashboard → Settings → Basic', placeholder: '123456789012345', secret: false },
      { key: 'appSecret' as const, label: 'App Secret', hint: 'Same page — tap "Show" to reveal your secret', placeholder: 'a1b2c3d4e5f6...', secret: true },
    ],
    guide: {
      steps: [
        '1. Go to developers.facebook.com',
        '2. Click "My Apps" → "Create App"',
        '3. Choose Business type',
        '4. Settings → Basic → copy App ID & App Secret',
        '5. Add "Pages API" product for publishing',
      ],
      url: 'https://developers.facebook.com',
    },
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    icon: 'youtube-play' as const,
    iconLib: 'FontAwesome' as const,
    fields: [
      { key: 'appId' as const, label: 'Google Client ID', hint: 'From console.cloud.google.com → APIs & Services → Credentials', placeholder: '123456-abc.apps.googleusercontent.com', secret: false },
      { key: 'appSecret' as const, label: 'Client Secret', hint: 'Same credentials page, OAuth 2.0 section', placeholder: 'GOCSPX-abc123...', secret: true },
    ],
    guide: {
      steps: [
        '1. Go to console.cloud.google.com',
        '2. Create a new project',
        '3. Enable "YouTube Data API v3"',
        '4. Credentials → Create OAuth 2.0 Client ID',
        '5. Choose iOS or Android as app type',
      ],
      url: 'https://console.cloud.google.com',
    },
  },
  tiktok: {
    name: 'TikTok',
    color: '#69C9D0',
    icon: 'music-note' as const,
    iconLib: 'MaterialCommunity' as const,
    fields: [
      { key: 'appId' as const, label: 'Client Key', hint: 'From developers.tiktok.com → Manage Apps → Your App', placeholder: 'aw1234abc567...', secret: false },
      { key: 'appSecret' as const, label: 'Client Secret', hint: 'Same App Settings page in TikTok Developer Portal', placeholder: 'xyz789...', secret: true },
    ],
    guide: {
      steps: [
        '1. Go to developers.tiktok.com',
        '2. Register / log in as a developer',
        '3. Manage Apps → Create App',
        '4. Apply for "Content Posting API" (takes 1–4 weeks)',
        '5. Copy Client Key & Client Secret once approved',
      ],
      url: 'https://developers.tiktok.com',
    },
    note: 'TikTok requires manual API approval before publishing is possible.',
  },
} as const;

function PIcon({ name, lib, color, size }: { name: string; lib: string; color: string; size: number }) {
  if (lib === 'MaterialCommunity') return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
  return <FontAwesome name={name as any} size={size} color={color} />;
}

function PlatformSection({ platformKey }: { platformKey: keyof ApiKeys }) {
  const colors = useColors();
  const { apiKeys, setApiKey, savePlatformKeys, clearPlatformKeys, isPlatformConfigured } = useSettings();
  const cfg = PLATFORM_CONFIG[platformKey];
  const [showGuide, setShowGuide] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const configured = isPlatformConfigured(platformKey);

  const handleSave = async () => {
    const { appId, appSecret } = apiKeys[platformKey];
    if (!appId.trim() || !appSecret.trim()) {
      Alert.alert('Fill both fields', 'Both App ID and App Secret are required.');
      return;
    }
    setSaving(true);
    await savePlatformKeys(platformKey);
    setSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleClear = () => {
    Alert.alert(`Clear ${cfg.name} keys?`, 'You can re-enter them any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { clearPlatformKeys(platformKey); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } },
    ]);
  };

  return (
    <View style={[styles.section, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.platformIcon, { backgroundColor: cfg.color }]}>
          <PIcon name={cfg.icon} lib={cfg.iconLib} color="#fff" size={18} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
          {cfg.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: configured ? '#00D4AA22' : `${colors.muted}`, borderColor: configured ? '#00D4AA55' : colors.border }]}>
          <View style={[styles.statusDot, { backgroundColor: configured ? '#00D4AA' : colors.mutedForeground }]} />
          <Text style={[styles.statusText, { color: configured ? '#00D4AA' : colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            {configured ? 'Configured' : 'Not set'}
          </Text>
        </View>
      </View>

      {/* Note (TikTok) */}
      {'note' in cfg && cfg.note && (
        <View style={[styles.noteRow, { backgroundColor: `${cfg.color}18`, borderColor: `${cfg.color}35` }]}>
          <Ionicons name="information-circle-outline" size={14} color={cfg.color} />
          <Text style={[styles.noteText, { color: cfg.color, fontFamily: 'Poppins_400Regular' }]}>{cfg.note}</Text>
        </View>
      )}

      {/* Fields */}
      {cfg.fields.map((field) => (
        <View key={field.key} style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
            {field.label}
          </Text>
          <Text style={[styles.fieldHint, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            {field.hint}
          </Text>
          <View style={[styles.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.mutedForeground}
              value={apiKeys[platformKey][field.key]}
              onChangeText={(v) => setApiKey(platformKey, field.key, v)}
              secureTextEntry={field.secret && !showSecrets[field.key]}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            {field.secret && (
              <TouchableOpacity onPress={() => setShowSecrets((p) => ({ ...p, [field.key]: !p[field.key] }))} style={styles.eyeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name={showSecrets[field.key] ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {/* Guide toggle */}
      <TouchableOpacity onPress={() => setShowGuide((p) => !p)} style={styles.guideToggle} activeOpacity={0.7}>
        <Ionicons name="help-circle-outline" size={16} color={cfg.color} />
        <Text style={[styles.guideToggleText, { color: cfg.color, fontFamily: 'Poppins_600SemiBold' }]}>
          How to get these keys
        </Text>
        <Ionicons name={showGuide ? 'chevron-up' : 'chevron-down'} size={14} color={cfg.color} />
      </TouchableOpacity>

      {showGuide && (
        <View style={[styles.guideBox, { backgroundColor: `${cfg.color}10`, borderColor: `${cfg.color}25` }]}>
          {cfg.guide.steps.map((step, i) => (
            <Text key={i} style={[styles.guideStep, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}>
              {step}
            </Text>
          ))}
          <TouchableOpacity onPress={() => Linking.openURL(cfg.guide.url)} style={[styles.guideLink, { borderColor: `${cfg.color}40` }]} activeOpacity={0.8}>
            <Ionicons name="open-outline" size={14} color={cfg.color} />
            <Text style={[styles.guideLinkText, { color: cfg.color, fontFamily: 'Poppins_600SemiBold' }]}>
              Open {cfg.guide.url.replace('https://', '')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionRow}>
        {configured && (
          <TouchableOpacity onPress={handleClear} style={[styles.clearBtn, { borderColor: colors.border }]} activeOpacity={0.75}>
            <Text style={[styles.clearBtnText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Clear</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: cfg.color, flex: configured ? 1 : undefined, width: configured ? undefined : '100%' }]} activeOpacity={0.85}>
          <Text style={[styles.saveBtnText, { fontFamily: 'Poppins_700Bold' }]}>
            {saving ? 'Saving...' : configured ? 'Update' : 'Save Keys'}
          </Text>
          {!saving && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 40 : insets.bottom + 24;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
              API <Text style={{ color: colors.primary }}>KEYS</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
              For real publishing to each platform
            </Text>
          </View>
        </View>

        {/* Intro card */}
        <LinearGradient colors={['#FFE60015', '#FF3CAC12']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.infoCard, { borderColor: `${colors.primary}30` }]}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
              Personal Use — Stored on Device
            </Text>
            <Text style={[styles.infoDesc, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
              Keys are saved privately on this device only. They are never sent to any server. Without keys, Postly organizes your schedule locally — real publishing requires these credentials.
            </Text>
          </View>
        </LinearGradient>

        {/* Platform sections */}
        <PlatformSection platformKey="facebook" />
        <PlatformSection platformKey="youtube" />
        <PlatformSection platformKey="tiktok" />

        {/* Full guide link */}
        <TouchableOpacity
          onPress={() => Alert.alert('Full Setup Guide', 'See docs/SOCIAL_OAUTH.md in your project for the complete step-by-step guide for each platform.')}
          style={[styles.fullGuide, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          <Text style={[styles.fullGuideText, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
            Read full OAuth setup guide
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
          Postly v1.0.0 · Personal Edition
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: -4 },
  infoCard: { flexDirection: 'row', gap: 12, borderRadius: 18, borderWidth: 1, padding: 16, alignItems: 'flex-start' },
  infoTitle: { fontSize: 13, marginBottom: 4 },
  infoDesc: { fontSize: 12, lineHeight: 18 },
  section: { borderRadius: 22, borderWidth: 1, padding: 18, gap: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  platformIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 16, flex: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 10, letterSpacing: 0.3, textTransform: 'uppercase' },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, borderRadius: 10, borderWidth: 1, padding: 10 },
  noteText: { fontSize: 11, lineHeight: 16, flex: 1 },
  fieldGroup: { gap: 5 },
  fieldLabel: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  fieldHint: { fontSize: 11, lineHeight: 16, marginBottom: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 14, paddingVertical: 12 },
  eyeBtn: { padding: 4 },
  guideToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2 },
  guideToggleText: { fontSize: 13, flex: 1 },
  guideBox: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  guideStep: { fontSize: 12, lineHeight: 20 },
  guideLink: { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, paddingTop: 10, marginTop: 4 },
  guideLinkText: { fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  clearBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { fontSize: 13 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  saveBtnText: { color: '#fff', fontSize: 14 },
  fullGuide: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 16 },
  fullGuideText: { flex: 1, fontSize: 14 },
  version: { fontSize: 12, textAlign: 'center', paddingTop: 4 },
});
