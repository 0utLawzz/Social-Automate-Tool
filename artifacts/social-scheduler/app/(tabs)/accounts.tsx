import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';
import {
  Account,
  Platform as SocialPlatform,
  PLATFORM_COLORS,
  PLATFORM_HINTS,
  PLATFORM_NAMES,
} from '@/types';

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function PlatformIcon({ platform, size }: { platform: SocialPlatform; size: number }) {
  const color = '#fff';
  if (platform === 'facebook') return <FontAwesome name="facebook" size={size} color={color} />;
  if (platform === 'youtube') return <FontAwesome name="youtube-play" size={size} color={color} />;
  return <MaterialCommunityIcons name="music-note" size={size} color={color} />;
}

interface ConnectModalProps {
  visible: boolean;
  account: Account | null;
  onClose: () => void;
  onConnect: (id: string, username: string, handle: string, followers: number) => void;
}

function ConnectModal({ visible, account, onClose, onConnect }: ConnectModalProps) {
  const colors = useColors();
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');
  const [followersStr, setFollowersStr] = useState('');

  const platformColor = account ? PLATFORM_COLORS[account.platform] : colors.primary;

  const handleConnect = () => {
    if (!username.trim()) {
      Alert.alert('Missing info', 'Please enter your account name.');
      return;
    }
    const followers = parseInt(followersStr.replace(/[^0-9]/g, ''), 10) || 0;
    const finalHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim() || username.trim()}`;
    onConnect(account!.id, username.trim(), finalHandle, followers);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUsername('');
    setHandle('');
    setFollowersStr('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.overlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={modalStyles.keyboardView}>
        <View style={[modalStyles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {account && (
            <>
              <View style={modalStyles.handle} />
              <View style={[modalStyles.iconWrap, { backgroundColor: platformColor }]}>
                <PlatformIcon platform={account.platform} size={28} />
              </View>
              <Text style={[modalStyles.title, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                Connect {PLATFORM_NAMES[account.platform]}
              </Text>
              <Text style={[modalStyles.hint, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                {PLATFORM_HINTS[account.platform]}
              </Text>

              <View style={modalStyles.fields}>
                <View style={modalStyles.field}>
                  <Text style={[modalStyles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                    ACCOUNT NAME
                  </Text>
                  <TextInput
                    style={[modalStyles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
                    placeholder={`Your ${PLATFORM_NAMES[account.platform]} name`}
                    placeholderTextColor={colors.mutedForeground}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>

                <View style={modalStyles.field}>
                  <Text style={[modalStyles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                    HANDLE / USERNAME
                  </Text>
                  <TextInput
                    style={[modalStyles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
                    placeholder="@yourusername"
                    placeholderTextColor={colors.mutedForeground}
                    value={handle}
                    onChangeText={setHandle}
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <View style={modalStyles.field}>
                  <Text style={[modalStyles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
                    FOLLOWERS (optional)
                  </Text>
                  <TextInput
                    style={[modalStyles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
                    placeholder="e.g. 5000"
                    placeholderTextColor={colors.mutedForeground}
                    value={followersStr}
                    onChangeText={setFollowersStr}
                    keyboardType="numeric"
                    returnKeyType="done"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleConnect}
                style={[modalStyles.connectBtn, { backgroundColor: platformColor }]}
                activeOpacity={0.85}
              >
                <Text style={[modalStyles.connectBtnText, { fontFamily: 'Poppins_700Bold' }]}>
                  Connect {PLATFORM_NAMES[account.platform]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={modalStyles.cancelBtn}>
                <Text style={[modalStyles.cancelText, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000080' },
  keyboardView: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#555', marginBottom: 4 },
  iconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, textAlign: 'center' },
  hint: { fontSize: 13, textAlign: 'center', marginTop: -8, lineHeight: 19 },
  fields: { width: '100%', gap: 14 },
  field: { gap: 6 },
  fieldLabel: { fontSize: 11, letterSpacing: 1.5 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  connectBtn: { width: '100%', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  connectBtnText: { color: '#fff', fontSize: 15 },
  cancelBtn: { paddingVertical: 8 },
  cancelText: { fontSize: 14 },
});

export default function AccountsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { accounts, posts, connectAccount, disconnectAccount } = usePosts();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 120 : 100;

  const [modalAccount, setModalAccount] = useState<Account | null>(null);

  const connected = accounts.filter((a) => a.connected);
  const totalFollowers = connected.reduce((sum, a) => sum + a.followers, 0);
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  const handleDisconnect = (account: Account) => {
    Alert.alert(
      `Disconnect ${PLATFORM_NAMES[account.platform]}?`,
      'You can reconnect at any time.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            disconnectAccount(account.id);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConnectModal
        visible={!!modalAccount}
        account={modalAccount}
        onClose={() => setModalAccount(null)}
        onConnect={connectAccount}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
            YOUR <Text style={{ color: colors.accent }}>CREW</Text>
          </Text>
        </View>
        <View style={[styles.decorBar, { backgroundColor: colors.accent }]} />

        {/* Summary — only when some connected */}
        {connected.length > 0 && (
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
                  Reach
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
        )}

        {/* Accounts list */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            Platforms
          </Text>

          {accounts.map((account) => {
            const pColor = PLATFORM_COLORS[account.platform];
            return (
              <View
                key={account.id}
                style={[
                  styles.accountCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: account.connected ? pColor : colors.border,
                    borderWidth: account.connected ? 1.5 : 1,
                  },
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: pColor }]}>
                  <PlatformIcon platform={account.platform} size={22} />
                </View>

                <View style={styles.accountInfo}>
                  <Text style={[styles.platformName, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                    {PLATFORM_NAMES[account.platform]}
                  </Text>
                  {account.connected ? (
                    <>
                      <Text style={[styles.accountHandle, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                        {account.handle}
                      </Text>
                      {account.followers > 0 && (
                        <Text style={[styles.accountFollowers, { color: colors.accent, fontFamily: 'Poppins_600SemiBold' }]}>
                          {formatFollowers(account.followers)} followers
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text style={[styles.notConnected, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                      Not connected
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() =>
                    account.connected ? handleDisconnect(account) : setModalAccount(account)
                  }
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: account.connected ? 'transparent' : pColor,
                      borderColor: account.connected ? colors.border : pColor,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      {
                        color: account.connected ? colors.mutedForeground : '#fff',
                        fontFamily: 'Poppins_700Bold',
                      },
                    ]}
                  >
                    {account.connected ? 'Disconnect' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Format guide */}
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

        <View style={[styles.note, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={18} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            Your account info is saved privately on your device. Real OAuth publishing will be available once API credentials are set up.
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
  decorBar: {
    height: 4,
    width: 60,
    borderRadius: 2,
    transform: [{ rotate: '-1.5deg' }],
    marginTop: -14,
  },
  summaryCard: { borderRadius: 24, borderWidth: 1, padding: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center', gap: 4, flex: 1 },
  summaryValue: { fontSize: 28 },
  summaryLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center' },
  divider: { width: 1, height: 40 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20 },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  iconWrap: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  accountInfo: { flex: 1, gap: 2 },
  platformName: { fontSize: 15 },
  accountHandle: { fontSize: 12 },
  accountFollowers: { fontSize: 12, marginTop: 2 },
  notConnected: { fontSize: 12 },
  actionBtn: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  actionBtnText: { fontSize: 12 },
  formatRow: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  formatPlatform: { fontSize: 14 },
  formatChips: { flexDirection: 'row', gap: 6 },
  formatChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  formatChipText: { fontSize: 11 },
  formatHint: { fontSize: 12 },
  note: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'flex-start',
  },
  noteText: { fontSize: 12, lineHeight: 18, flex: 1 },
});
