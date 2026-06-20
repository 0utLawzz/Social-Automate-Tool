import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Account, PLATFORM_COLORS, PLATFORM_NAMES } from '@/types';

interface Props {
  account: Account;
  onToggle: (id: string) => void;
}

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function PlatformIcon({ platform, size }: { platform: Account['platform']; size: number }) {
  const color = '#fff';
  if (platform === 'facebook') return <FontAwesome name="facebook" size={size} color={color} />;
  if (platform === 'youtube') return <FontAwesome name="youtube-play" size={size} color={color} />;
  return <MaterialCommunityIcons name="music-note" size={size} color={color} />;
}

export function AccountCard({ account, onToggle }: Props) {
  const colors = useColors();
  const platformColor = PLATFORM_COLORS[account.platform];

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(account.id);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: account.connected ? platformColor : colors.border,
          borderWidth: account.connected ? 1.5 : 1,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: platformColor }]}>
        <PlatformIcon platform={account.platform} size={22} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.platform, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
          {PLATFORM_NAMES[account.platform]}
        </Text>
        <Text style={[styles.handle, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
          {account.handle}
        </Text>
        {account.connected && (
          <Text style={[styles.followers, { color: colors.accent, fontFamily: 'Poppins_600SemiBold' }]}>
            {formatFollowers(account.followers)} followers
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.btn,
          {
            backgroundColor: account.connected ? 'transparent' : colors.primary,
            borderColor: account.connected ? colors.border : colors.primary,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.btnText,
            {
              color: account.connected ? colors.mutedForeground : colors.primaryForeground,
              fontFamily: 'Poppins_700Bold',
            },
          ]}
        >
          {account.connected ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 12,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  platform: {
    fontSize: 15,
  },
  handle: {
    fontSize: 12,
  },
  followers: {
    fontSize: 12,
    marginTop: 2,
  },
  btn: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  btnText: {
    fontSize: 12,
  },
});
