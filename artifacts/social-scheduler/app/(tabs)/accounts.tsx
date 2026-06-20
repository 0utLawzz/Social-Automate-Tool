import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform,
  ScrollView, StyleSheet, Switch, Text, TextInput,
  TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePosts } from '@/context/PostsContext';
import { useThemePreference } from '@/context/ThemeContext';
import { useColors } from '@/hooks/useColors';
import {
  Account, Platform as SocialPlatform, PLATFORM_COLORS,
  PLATFORM_HINTS, PLATFORM_NAMES, ThemePreference,
} from '@/types';

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function PlatformIcon({ platform, size }: { platform: SocialPlatform; size: number }) {
  if (platform === 'facebook') return <FontAwesome name="facebook" size={size} color="#fff" />;
  if (platform === 'youtube') return <FontAwesome name="youtube-play" size={size} color="#fff" />;
  return <MaterialCommunityIcons name="music-note" size={size} color="#fff" />;
}

function ConnectModal({ visible, account, onClose, onConnect }: {
  visible: boolean; account: Account | null;
  onClose: () => void; onConnect: (id: string, username: string, handle: string, followers: number) => void;
}) {
  const colors = useColors();
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');
  const [followersStr, setFollowersStr] = useState('');

  const handleConnect = () => {
    if (!username.trim()) { Alert.alert('Missing info', 'Please enter your account name.'); return; }
    const followers = parseInt(followersStr.replace(/[^0-9]/g, ''), 10) || 0;
    const finalHandle = handle.trim() ? (handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`) : `@${username.trim().replace(/\s+/g, '').toLowerCase()}`;
    onConnect(account!.id, username.trim(), finalHandle, followers);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUsername(''); setHandle(''); setFollowersStr('');
    onClose();
  };

  const pColor = account ? PLATFORM_COLORS[account.platform] : colors.primary;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}><View style={modal.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={modal.kav}>
        <View style={[modal.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {account && (
            <>
              <View style={modal.handle} />
              <View style={[modal.iconWrap, { backgroundColor: pColor }]}>
                <PlatformIcon platform={account.platform} size={28} />
              </View>
              <Text style={[modal.title, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                Connect {PLATFORM_NAMES[account.platform]}
              </Text>
              <Text style={[modal.hint, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                {PLATFORM_HINTS[account.platform]}
              </Text>
              <View style={modal.fields}>
                {[
                  { label: 'ACCOUNT NAME', value: username, setter: setUsername, placeholder: `Your ${PLATFORM_NAMES[account.platform]} name`, caps: 'words' as const, keyboard: 'default' as const },
                  { label: 'HANDLE / USERNAME', value: handle, setter: setHandle, placeholder: '@yourusername', caps: 'none' as const, keyboard: 'default' as const },
                  { label: 'FOLLOWERS (optional)', value: followersStr, setter: setFollowersStr, placeholder: 'e.g. 5000', caps: 'none' as const, keyboard: 'numeric' as const },
                ].map((f) => (
                  <View key={f.label} style={modal.field}>
                    <Text style={[modal.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>{f.label}</Text>
                    <TextInput style={[modal.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
                      placeholder={f.placeholder} placeholderTextColor={colors.mutedForeground}
                      value={f.value} onChangeText={f.setter} autoCapitalize={f.caps} keyboardType={f.keyboard} returnKeyType="next" />
                  </View>
                ))}
              </View>
              <TouchableOpacity onPress={handleConnect} style={[modal.connectBtn, { backgroundColor: pColor }]} activeOpacity={0.85}>
                <Text style={[modal.connectText, { fontFamily: 'Poppins_700Bold' }]}>Connect {PLATFORM_NAMES[account.platform]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={modal.cancelBtn}>
                <Text style={[modal.cancelText, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const modal = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000080' },
  kav: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, padding: 24, gap: 16, alignItems: 'center' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#555', marginBottom: 4 },
  iconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, textAlign: 'center' },
  hint: { fontSize: 13, textAlign: 'center', marginTop: -8, lineHeight: 19 },
  fields: { width: '100%', gap: 14 },
  field: { gap: 6 },
  fieldLabel: { fontSize: 11, letterSpacing: 1.5 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  connectBtn: { width: '100%', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  connectText: { color: '#fff', fontSize: 15 },
  cancelBtn: { paddingVertical: 8 },
  cancelText: { fontSize: 14 },
});

const THEME_OPTIONS: { key: ThemePreference; label: string; icon: string }[] = [
  { key: 'dark', label: 'Dark', icon: 'moon' },
  { key: 'light', label: 'Light', icon: 'sunny' },
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

export default function AccountsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { accounts, posts, connectAccount, disconnectAccount } = usePosts();
  const { theme, setTheme } = useThemePreference();
  const [modalAccount, setModalAccount] = useState<Account | null>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 120 : 100;

  const connected = accounts.filter((a) => a.connected);
  const totalFollowers = connected.reduce((s, a) => s + a.followers, 0);
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  const handleDisconnect = (acc: Account) => {
    Alert.alert(`Disconnect ${PLATFORM_NAMES[acc.platform]}?`, 'You can reconnect at any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disconnect', style: 'destructive', onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); disconnectAccount(acc.id); } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConnectModal visible={!!modalAccount} account={modalAccount} onClose={() => setModalAccount(null)} onConnect={connectAccount} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
            YOUR <Text style={{ color: colors.accent }}>CREW</Text>
          </Text>
        </View>
        <View style={[styles.decorBar, { backgroundColor: colors.accent }]} />

        {/* Summary */}
        {connected.length > 0 && (
          <LinearGradient colors={['#FF3CAC20', '#F5E64220']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.summaryCard, { borderColor: colors.accent }]}>
            <View style={styles.summaryRow}>
              {[{ val: connected.length, lbl: 'Connected', color: colors.primary }, { val: formatFollowers(totalFollowers), lbl: 'Reach', color: colors.accent }, { val: scheduledCount, lbl: 'Queued', color: colors.foreground }].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryVal, { color: s.color, fontFamily: 'Poppins_900Black' }]}>{s.val}</Text>
                    <Text style={[styles.summaryLbl, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>{s.lbl}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </LinearGradient>
        )}

        {/* Accounts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Platforms</Text>
          {accounts.map((acc) => {
            const pColor = PLATFORM_COLORS[acc.platform];
            return (
              <View key={acc.id} style={[styles.accountCard, { backgroundColor: colors.card, borderColor: acc.connected ? pColor : colors.border, borderWidth: acc.connected ? 1.5 : 1 }]}>
                <View style={[styles.iconWrap, { backgroundColor: pColor }]}>
                  <PlatformIcon platform={acc.platform} size={22} />
                </View>
                <View style={styles.accInfo}>
                  <Text style={[styles.accPlatform, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>{PLATFORM_NAMES[acc.platform]}</Text>
                  {acc.connected
                    ? <><Text style={[styles.accHandle, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>{acc.handle}</Text>
                        {acc.followers > 0 && <Text style={[styles.accFollowers, { color: colors.accent, fontFamily: 'Poppins_600SemiBold' }]}>{formatFollowers(acc.followers)} followers</Text>}</>
                    : <Text style={[styles.accHandle, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>Not connected</Text>
                  }
                </View>
                <TouchableOpacity onPress={() => acc.connected ? handleDisconnect(acc) : setModalAccount(acc)}
                  style={[styles.actionBtn, { backgroundColor: acc.connected ? 'transparent' : pColor, borderColor: acc.connected ? colors.border : pColor }]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.actionText, { color: acc.connected ? colors.mutedForeground : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                    {acc.connected ? 'Disconnect' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Appearance</Text>
          <View style={[styles.themeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.themeRow}>
              {THEME_OPTIONS.map((opt) => {
                const active = theme === opt.key;
                return (
                  <TouchableOpacity key={opt.key} onPress={() => { Haptics.selectionAsync(); setTheme(opt.key); }}
                    style={[styles.themeBtn, { backgroundColor: active ? colors.primary : colors.secondary, borderColor: active ? colors.primary : colors.border }]}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={opt.icon as any} size={18} color={active ? colors.primaryForeground : colors.mutedForeground} />
                    <Text style={[styles.themeBtnText, { color: active ? colors.primaryForeground : colors.mutedForeground, fontFamily: 'Poppins_700Bold' }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Format guide */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Format Guide</Text>
          {[
            { p: 'TikTok', f: ['9:16'], h: 'Vertical only' },
            { p: 'YouTube', f: ['16:9', '9:16'], h: 'Landscape + Shorts' },
            { p: 'Facebook', f: ['1:1', '4:5', '16:9', '9:16'], h: 'All formats' },
          ].map((row) => (
            <View key={row.p} style={[styles.fmtRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.fmtPlatform, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>{row.p}</Text>
              <View style={styles.fmtChips}>
                {row.f.map((f) => <View key={f} style={[styles.fmtChip, { backgroundColor: colors.secondary }]}><Text style={[styles.fmtChipText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>{f}</Text></View>)}
              </View>
              <Text style={[styles.fmtHint, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>{row.h}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.note, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={18} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            Account info is saved privately on your device. Real OAuth posting will be available once platform API credentials are configured.
          </Text>
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
  decorBar: { height: 4, width: 60, borderRadius: 2, transform: [{ rotate: '-1.5deg' }], marginTop: -14 },
  summaryCard: { borderRadius: 24, borderWidth: 1, padding: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center', gap: 4, flex: 1 },
  summaryVal: { fontSize: 28 },
  summaryLbl: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center' },
  divider: { width: 1, height: 40 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20 },
  accountCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 16, gap: 14 },
  iconWrap: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  accInfo: { flex: 1, gap: 2 },
  accPlatform: { fontSize: 15 },
  accHandle: { fontSize: 12 },
  accFollowers: { fontSize: 12, marginTop: 2 },
  actionBtn: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  actionText: { fontSize: 12 },
  themeCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  themeRow: { flexDirection: 'row', gap: 10 },
  themeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 14, paddingVertical: 12 },
  themeBtnText: { fontSize: 13 },
  fmtRow: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  fmtPlatform: { fontSize: 14 },
  fmtChips: { flexDirection: 'row', gap: 6 },
  fmtChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  fmtChipText: { fontSize: 11 },
  fmtHint: { fontSize: 12 },
  note: { flexDirection: 'row', gap: 10, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: 'flex-start' },
  noteText: { fontSize: 12, lineHeight: 18, flex: 1 },
});
