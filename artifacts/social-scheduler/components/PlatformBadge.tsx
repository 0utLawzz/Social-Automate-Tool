import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Platform, PLATFORM_COLORS } from '@/types';

interface Props {
  platform: Platform;
  size?: 'sm' | 'md';
}

export function PlatformBadge({ platform, size = 'sm' }: Props) {
  const dim = size === 'sm' ? 24 : 32;
  const iconSize = size === 'sm' ? 12 : 16;
  const color = PLATFORM_COLORS[platform];

  const icon = () => {
    if (platform === 'facebook') {
      return <FontAwesome name="facebook" size={iconSize} color="#fff" />;
    }
    if (platform === 'youtube') {
      return <FontAwesome name="youtube-play" size={iconSize} color="#fff" />;
    }
    return <MaterialCommunityIcons name="music-note" size={iconSize} color="#fff" />;
  };

  return (
    <View
      style={[
        styles.badge,
        { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: color },
      ]}
    >
      {icon()}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
