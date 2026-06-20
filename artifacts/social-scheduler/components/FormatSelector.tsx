import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { AspectRatio, FORMAT_LABELS, Platform, PLATFORM_COLORS, PLATFORM_FORMATS } from '@/types';

interface Props {
  selected: AspectRatio;
  onSelect: (format: AspectRatio) => void;
  selectedPlatforms: Platform[];
}

const ALL_FORMATS: AspectRatio[] = ['9:16', '16:9', '1:1', '4:5'];

const RATIO_DIMS: Record<AspectRatio, { w: number; h: number }> = {
  '9:16': { w: 18, h: 32 },
  '16:9': { w: 32, h: 18 },
  '1:1': { w: 24, h: 24 },
  '4:5': { w: 24, h: 30 },
};

function isCompatible(format: AspectRatio, platform: Platform): boolean {
  return PLATFORM_FORMATS[platform].includes(format);
}

export function FormatSelector({ selected, onSelect, selectedPlatforms }: Props) {
  const colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ALL_FORMATS.map((format) => {
        const isSelected = selected === format;
        const dims = RATIO_DIMS[format];

        return (
          <TouchableOpacity
            key={format}
            onPress={() => onSelect(format)}
            style={[
              styles.item,
              {
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.preview}>
              <View
                style={[
                  styles.ratioRect,
                  {
                    width: dims.w,
                    height: dims.h,
                    borderColor: isSelected ? colors.primaryForeground : colors.mutedForeground,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? colors.primaryForeground : colors.foreground,
                  fontFamily: 'Poppins_700Bold',
                },
              ]}
            >
              {format}
            </Text>
            <Text
              style={[
                styles.sublabel,
                {
                  color: isSelected ? colors.primaryForeground : colors.mutedForeground,
                  fontFamily: 'Poppins_400Regular',
                },
              ]}
            >
              {FORMAT_LABELS[format]}
            </Text>

            {selectedPlatforms.length > 0 && (
              <View style={styles.compat}>
                {selectedPlatforms.map((p) => (
                  <View
                    key={p}
                    style={[
                      styles.compatDot,
                      {
                        backgroundColor: isCompatible(format, p)
                          ? PLATFORM_COLORS[p]
                          : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  item: {
    width: 80,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  preview: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioRect: {
    borderWidth: 2,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  sublabel: {
    fontSize: 10,
  },
  compat: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 2,
  },
  compatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
