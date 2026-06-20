import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { usePosts } from '@/context/PostsContext';
import { useColors } from '@/hooks/useColors';
import { CaptionTemplate } from '@/types';

interface Props {
  onSelect: (text: string) => void;
  currentCaption?: string;
}

export function CaptionTemplates({ onSelect, currentCaption }: Props) {
  const colors = useColors();
  const { captionTemplates, addCaptionTemplate, deleteCaptionTemplate } = usePosts();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleSelect = (t: CaptionTemplate) => {
    Haptics.selectionAsync();
    onSelect(t.text);
    setOpen(false);
  };

  const handleSave = () => {
    if (!currentCaption?.trim()) { Alert.alert('Empty caption', 'Write something first.'); return; }
    if (!saveName.trim()) { Alert.alert('Name required', 'Give your template a name.'); return; }
    addCaptionTemplate(saveName.trim(), currentCaption.trim());
    setSaving(false);
    setSaveName('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = (t: CaptionTemplate) => {
    if (t.isDefault) { Alert.alert('Cannot delete', 'Default templates cannot be deleted.'); return; }
    Alert.alert('Delete template?', t.name, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCaptionTemplate(t.id) },
    ]);
  };

  return (
    <>
      <View style={styles.triggerRow}>
        <TouchableOpacity onPress={() => setOpen(true)} style={[styles.triggerBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]} activeOpacity={0.75}>
          <Ionicons name="document-text-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.triggerText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Templates</Text>
        </TouchableOpacity>
        {!!currentCaption?.trim() && (
          <TouchableOpacity onPress={() => setSaving(true)} style={[styles.triggerBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]} activeOpacity={0.75}>
            <Ionicons name="save-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.triggerText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Template picker modal */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sheetHandle} />
          <Text style={[styles.sheetTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Caption Templates</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.templateList}>
            {captionTemplates.map((t) => (
              <TouchableOpacity key={t.id} onPress={() => handleSelect(t)} style={[styles.templateCard, { backgroundColor: colors.background, borderColor: colors.border }]} activeOpacity={0.75}>
                <View style={styles.templateHeader}>
                  <Text style={[styles.templateName, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>{t.name}</Text>
                  {!t.isDefault && (
                    <TouchableOpacity onPress={() => handleDelete(t)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="trash-outline" size={15} color={colors.mutedForeground} />
                    </TouchableOpacity>
                  )}
                  {t.isDefault && <View style={[styles.defaultBadge, { backgroundColor: colors.muted }]}><Text style={[styles.defaultText, { color: colors.mutedForeground, fontFamily: 'Poppins_600SemiBold' }]}>Built-in</Text></View>}
                </View>
                <Text style={[styles.templatePreview, { color: colors.mutedForeground, fontFamily: 'Poppins_400Regular' }]} numberOfLines={2}>{t.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Save template modal */}
      <Modal visible={saving} transparent animationType="slide" onRequestClose={() => setSaving(false)}>
        <TouchableWithoutFeedback onPress={() => setSaving(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.saveSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sheetHandle} />
          <Text style={[styles.sheetTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>Save as Template</Text>
          <TextInput
            style={[styles.saveInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}
            placeholder="Template name (e.g. My Launch Post)"
            placeholderTextColor={colors.mutedForeground}
            value={saveName}
            onChangeText={setSaveName}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            autoFocus
          />
          <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
            <Text style={[styles.saveBtnText, { color: colors.primaryForeground, fontFamily: 'Poppins_700Bold' }]}>Save Template</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerRow: { flexDirection: 'row', gap: 8 },
  triggerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  triggerText: { fontSize: 12 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000070' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, padding: 24, maxHeight: '70%' },
  saveSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderBottomWidth: 0, padding: 24, gap: 16 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#555', alignSelf: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 18, marginBottom: 12 },
  templateList: { flexGrow: 0 },
  templateCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10, gap: 6 },
  templateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  templateName: { fontSize: 14 },
  templatePreview: { fontSize: 12, lineHeight: 18 },
  defaultBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  defaultText: { fontSize: 10 },
  saveInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  saveBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { fontSize: 15 },
});
