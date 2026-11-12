// Minimal host chrome for isolated screenshots; production code uses Paseo's UI kit.
import React from 'react';
import { Pressable, View, Text, TextInput as NativeTextInput } from 'react-native-web';
import { Inbox, Plus, Search, X, Check, CheckCheck, ChevronDown, ChevronUp, ChevronRight, CircleCheck, ArrowLeft } from 'lucide-react';
export { defineTranslations, useTranslation, PluginTranslationRuntime, PluginTranslationProvider } from '../../node_modules/@getpaseo/plugin/dist/client/translations.js';
import { demoApi, demoRpc } from './demo-data.js';
const icons = { Inbox, Plus, Search, X, Check, CheckCheck, ChevronDown, ChevronUp, ChevronRight, CircleCheck, ArrowLeft };
export function Icon({ name, size = 16, color = 'currentColor' }) {
  const Component = icons[name] ?? Inbox;
  return <Component size={size} color={color} strokeWidth={1.7} style={{ flexShrink: 0 }} />;
}
export const usePaseo = () => demoApi;
export const useRpc = contract => React.useMemo(() => input => demoRpc(contract.name, input), [contract.name]);
const seen = {};
const readySettings = { status: 'ready', revision: 'sample', values: { seen }, saving: false,
  save: async () => { throw new Error('Sample media is read-only.'); } };
export const useSettings = () => readySettings;
export function SidebarRow({ icon, label, trailing, onPress }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, margin: 12, paddingHorizontal: 10,
    minHeight: 36, borderRadius: 7, backgroundColor: '#28312d' }}>
    <Pressable onPress={onPress} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Icon name={icon} size={18} color="#dfe7e2" /><Text style={{ color: '#e9eeeb', fontSize: 14 }}>{label}</Text>
    </Pressable>{trailing}
  </View>;
}
export const TextInput = NativeTextInput;
export const SettingsCard = ({ children }) => <View>{children}</View>;
export const SettingsSelect = ({ label }) => <Text>{label}</Text>;
export const Modal = Object.assign(({ children }) => <View>{children}</View>, { Content: ({ children }) => <View>{children}</View> });
