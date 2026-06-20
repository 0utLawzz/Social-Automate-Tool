import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLibrary } from '@/context/LibraryContext';
import { useColors } from '@/hooks/useColors';
import { MediaItem } from '@/types';

const { width } = Dimensions.get('window');
const COLS = 3;
const ITEM_SIZE = (width - 40 - (COLS - 1) * 4) / COLS;

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mediaItems, addMediaItem, deleteMediaItem } = useLibrary();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 120 : 100;

  const handleAdd = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const type = asset.type === 'video' ? 'video' : 'image';
      addMediaItem(asset.uri, type);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDelete = (item: MediaItem) => {
    Alert.alert('Remove from Library?', 'This will not delete the file from your device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deleteMediaItem(item.id);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
              MEDIA <Text style={{ color: colors.primary }}>LIB</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAdd}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={22} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>

        <View style={[styles.decorBar, { backgroundColor: colors.primary }]} />

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>{mediaItems.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Total</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
              {mediaItems.filter((m) => m.type === 'image').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Images</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground, fontFamily: 'Poppins_900Black' }]}>
              {mediaItems.filter((m) => m.type === 'video').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Videos</Text>
          </View>
        </View>

        {/* Grid */}
        {mediaItems.length === 0 ? (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <Ionicons name="images-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground, fontFamily: 'Poppins_700Bold' }]}>
              Your library is empty
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
              Add photos and videos to reuse them across posts and platforms.
            </Text>
            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color={colors.primaryForeground} />
              <Text style={[styles.emptyBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>
                Add Media
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {mediaItems.map((item) => (
              <TouchableOpacity key={item.id} onLongPress={() => handleDelete(item)} style={styles.gridItem} activeOpacity={0.9}>
                <Image source={{ uri: item.uri }} style={[styles.gridImg, { width: ITEM_SIZE, height: ITEM_SIZE }]} resizeMode="cover" />
                {item.type === 'video' && (
                  <View style={styles.videoOverlay}>
                    <Ionicons name="play-circle" size={24} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Add button tile */}
            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.addTile, { width: ITEM_SIZE, height: ITEM_SIZE, backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.75}
            >
              <Ionicons name="add" size={28} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        )}

        {mediaItems.length > 0 && (
          <Text style={[styles.hint, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]}>
            Long-press any item to remove it.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 36, letterSpacing: -1 },
  addBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  decorBar: { height: 4, width: 60, borderRadius: 2, transform: [{ rotate: '-2deg' }], marginTop: -12 },
  statsRow: { flexDirection: 'row', borderRadius: 20, borderWidth: 1, padding: 16 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 24 },
  statLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, marginHorizontal: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  gridItem: { borderRadius: 10, overflow: 'hidden', position: 'relative' },
  gridImg: { borderRadius: 10 },
  videoOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000040' },
  addTile: { borderRadius: 10, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  empty: { borderRadius: 24, borderWidth: 1, borderStyle: 'dashed', padding: 40, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, marginTop: 8 },
  emptyDesc: { fontSize: 13, lineHeight: 20, textAlign: 'center' },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24, marginTop: 8 },
  emptyBtnText: { fontSize: 14 },
  hint: { fontSize: 12, textAlign: 'center' },
});
