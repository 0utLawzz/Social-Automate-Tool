import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Platform as SocialPlatform } from '@/types';

interface BestTimeSlot {
  label: string;
  desc: string;
  scheduleKey: string;
}

const BEST_TIMES: Record<SocialPlatform, BestTimeSlot[]> = {
  facebook: [
    { label: 'Weekday Morning', desc: 'Mon–Fri · 9–11 AM', scheduleKey: 'tomorrow' },
    { label: 'Afternoon Peak', desc: 'Mon–Fri · 1–3 PM', scheduleKey: 'tonight' },
  ],
  youtube: [
    { label: 'Thu–Fri Noon', desc: '12–4 PM · High search', scheduleKey: 'tomorrow' },
    { label: 'Weekend Morning', desc: 'Sat–Sun · 9–11 AM', scheduleKey: 'next_week' },
  ],
  tiktok: [
    { label: 'Morning Rush', desc: 'Tue–Fri · 9–11 AM', scheduleKey: 'tomorrow' },
    { label: 'Evening Peak', desc: 'Tue–Sat · 7–9 PM', scheduleKey: 'tonight' },
  ],
};

interface Props {
  platforms: SocialPlatform[];
  onSelectTime: (scheduleKey: string) => void;
}

export function BestTimePicker({ platforms, onSelectTime }: Props) {
  const colors = useColors();

  if (platforms.length === 0) return null;

  const slots: { platform: SocialPlatform; slot: BestTimeSlot }[] = [];
  for (const p of platforms) {
    for (const slot of BEST_TIMES[p]) {
      slots.push({ platform: p, slot });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={14} color={colors.success} />
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
          BEST TIMES TO POST
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {slots.map(({ platform, slot }, i) => (
          <TouchableOpacity
            key={`${platform}-${i}`}
            onPress={() => onSelectTime(slot.scheduleKey)}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.75}
          >
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={[styles.slotLabel, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
              {slot.label}
            </Text>
            <Text style={[styles.slotDesc, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
              {slot.desc}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 11, letterSpacing: 1.5 },
  row: { flexDirection: 'row', gap: 10 },
  card: { borderRadius: 14, borderWidth: 1, padding: 12, minWidth: 130, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginBottom: 4 },
  slotLabel: { fontSize: 12 },
  slotDesc: { fontSize: 11 },
});
