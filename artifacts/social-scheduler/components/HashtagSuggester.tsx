import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

const CATEGORY_HASHTAGS: Record<string, string[]> = {
  launch: ['#productlaunch', '#launch', '#newproduct', '#announcement', '#comingsoon'],
  creative: ['#creative', '#creativity', '#artist', '#design', '#art'],
  behind: ['#behindthescenes', '#bts', '#process', '#making', '#creator'],
  motivation: ['#motivation', '#mindset', '#inspiration', '#success', '#hustle'],
  business: ['#business', '#entrepreneur', '#startup', '#brand', '#marketing'],
  video: ['#video', '#content', '#contentcreator', '#videomaker', '#creator'],
  fashion: ['#fashion', '#style', '#ootd', '#outfit', '#fashionblogger'],
  food: ['#food', '#foodie', '#cooking', '#recipe', '#eats'],
  travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation'],
  fitness: ['#fitness', '#workout', '#gym', '#health', '#wellness'],
  music: ['#music', '#musician', '#song', '#artist', '#newmusic'],
  tech: ['#tech', '#technology', '#innovation', '#digital', '#future'],
};

const KEYWORD_MAP: Record<string, string> = {
  launch: 'launch', announc: 'launch', new: 'launch', release: 'launch',
  creative: 'creative', creat: 'creative', art: 'creative', design: 'creative',
  behind: 'behind', bts: 'behind', making: 'behind', process: 'behind',
  motivat: 'motivation', inspir: 'motivation', mindset: 'motivation',
  business: 'business', brand: 'business', market: 'business', entrepren: 'business',
  video: 'video', content: 'video',
  fashion: 'fashion', style: 'fashion', outfit: 'fashion', wear: 'fashion',
  food: 'food', cook: 'food', recipe: 'food', eat: 'food',
  travel: 'travel', trip: 'travel', adventure: 'travel', explor: 'travel',
  fit: 'fitness', workout: 'fitness', gym: 'fitness', health: 'fitness',
  music: 'music', song: 'music', artist: 'music',
  tech: 'tech', technol: 'tech', digital: 'tech', innovat: 'tech',
};

function suggestHashtags(text: string): string[] {
  if (!text.trim()) return [];
  const words = text.toLowerCase().split(/\W+/);
  const categories = new Set<string>();
  for (const word of words) {
    for (const [key, cat] of Object.entries(KEYWORD_MAP)) {
      if (word.startsWith(key)) categories.add(cat);
    }
  }
  const hashtags: string[] = [];
  for (const cat of categories) {
    hashtags.push(...(CATEGORY_HASHTAGS[cat] ?? []));
  }
  // Filter out hashtags already in the text
  return Array.from(new Set(hashtags)).filter((h) => !text.includes(h)).slice(0, 12);
}

interface Props {
  caption: string;
  onInsert: (tag: string) => void;
}

export function HashtagSuggester({ caption, onInsert }: Props) {
  const colors = useColors();
  const suggestions = useMemo(() => suggestHashtags(caption), [caption]);

  if (suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>
        SUGGESTED HASHTAGS
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {suggestions.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => onInsert(tag)}
            style={[styles.chip, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, { color: colors.accent, fontFamily: 'Poppins_600SemiBold' }]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontSize: 11, letterSpacing: 1.5 },
  row: { flexDirection: 'row', gap: 8 },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 12 },
});
