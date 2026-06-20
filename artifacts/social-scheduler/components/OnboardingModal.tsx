import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const ONBOARDING_KEY = '@postly_onboarded_v1';
const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'flash' as const,
    title: 'Welcome to Postly',
    desc: 'Your social posts, all platforms, one powerful app. Schedule, organize and track everything.',
  },
  {
    icon: 'people' as const,
    title: 'Connect Your Accounts',
    desc: 'Link Facebook, YouTube and TikTok. Postly keeps your handles and audience data in one place.',
  },
  {
    icon: 'calendar' as const,
    title: 'Schedule with Precision',
    desc: 'Pick the perfect format for each platform — 9:16 for TikTok, 16:9 for YouTube — and schedule at the best time.',
  },
  {
    icon: 'bar-chart' as const,
    title: 'Track Your Analytics',
    desc: 'See your reach, post history, and performance across platforms from your home dashboard.',
  },
];

interface Props {
  onDone: () => void;
}

export function OnboardingModal({ onDone }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const goTo = (index: number) => {
    Haptics.selectionAsync();
    Animated.spring(translateX, { toValue: -index * width, useNativeDriver: true, tension: 80, friction: 12 }).start();
    setStep(index);
  };

  const next = () => {
    if (step < SLIDES.length - 1) {
      goTo(step + 1);
    } else {
      onDone();
    }
  };

  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <Modal visible transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: colors.background }]}>
        {/* Slides */}
        <View style={styles.slidesContainer}>
          <Animated.View style={[styles.slidesRow, { transform: [{ translateX }] }]}>
            {SLIDES.map((slide, i) => (
              <View key={i} style={[styles.slide, { width }]}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                  <Ionicons name={slide.icon} size={44} color={colors.primaryForeground} />
                </View>
                <Text style={[styles.slideTitle, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
                  {slide.title}
                </Text>
                <Text style={[styles.slideDesc, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
                  {slide.desc}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === step ? colors.primary : colors.border,
                    width: i === step ? 24 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Buttons */}
        <View style={[styles.buttons, { paddingBottom: botPad + 24 }]}>
          <TouchableOpacity onPress={onDone} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
              Skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={next}
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.nextText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>
              {step === SLIDES.length - 1 ? "Let's Go" : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export async function shouldShowOnboarding(): Promise<boolean> {
  const v = await AsyncStorage.getItem(ONBOARDING_KEY);
  return v !== 'done';
}

export async function markOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'done');
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  slidesContainer: { flex: 1, overflow: 'hidden', width: '100%', justifyContent: 'center' },
  slidesRow: { flexDirection: 'row' },
  slide: { alignItems: 'center', padding: 40, gap: 20 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  slideTitle: { fontSize: 28, textAlign: 'center', letterSpacing: -0.5 },
  slideDesc: { fontSize: 15, lineHeight: 24, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 32 },
  dot: { height: 8, borderRadius: 4 },
  buttons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, width: '100%' },
  skipBtn: { padding: 12 },
  skipText: { fontSize: 15 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  nextText: { fontSize: 15 },
});
