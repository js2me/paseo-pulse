import React from 'react';
import { createRoot } from 'react-dom/client';
import { View, Text, useWindowDimensions } from 'react-native-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InboxScreen } from '../../client/views/inbox/inbox-screen';
import { createInboxSidebar } from '../../client/views/sidebar/inbox-sidebar';
import { PluginTranslationProvider, PluginTranslationRuntime, Icon } from './host.jsx';
import { entries } from './demo-data.js';
import { demoApi, creationDemo } from './demo-data.js';
globalThis.__pulseDemo = creationDemo;
import { createSessionDirectoryStore } from '../../client/data/sessions/session-directory-store';
const directory = createSessionDirectoryStore(demoApi);
directory.start();
const runtime = new PluginTranslationRuntime({ getLocale: () => 'en', subscribe: () => () => {} });
const query = new QueryClient();
const sidebar = createInboxSidebar();
sidebar.update(entries);
const theme = { colors: { surface0: '#191e1b', surface1: '#222925', surface2: '#2b342f', foreground: '#fafafa',
  foregroundMuted: '#9fa8a2', border: '#313b35', accent: '#7ac693', accentForeground: '#15251a',
  statusSuccess: '#86cc9a', statusWarning: '#dfbc76', statusDanger: '#e5908c' } };
function Demo() {
  const compact = useWindowDimensions().width < 720;
  const [visible, setVisible] = React.useState(true);
  const [, updateHost] = React.useState(0);
  creationDemo.updateHost = () => updateHost(value => value + 1);
  creationDemo.setVisible = setVisible;
  const props = { host: { id: 'sample-host', label: 'Demo workspace' }, theme, layout: { compact, platform: 'web' },
    params: {}, navigation: { openNewWorkspace(input) {
      if (creationDemo.fail) throw new Error('Sample creation error');
      creationDemo.opened.push(input);
    }, openAgent(agent) { creationDemo.opened.push(agent); } } };
  return <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.surface0 }}>
    {!compact && <View style={{ width: 220, borderRightWidth: 1, borderColor: theme.colors.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 22 }}>
        <img src="/icon.svg" width="27" height="27" alt="Paseo Pulse" />
        <Text style={{ color: theme.colors.foreground, fontSize: 15, fontWeight: '600' }}>Paseo Pulse</Text>
      </View>
      <sidebar.Component {...props} currentScreen={{ screenId: 'inbox', params: {} }} openScreen={() => {}} />
      <Text style={{ color: theme.colors.foregroundMuted, fontSize: 11, margin: 22 }}>Demo workspace</Text>
    </View>}
    <View style={{ flex: 1, minWidth: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: compact ? 16 : 26,
        height: compact ? 54 : 60, borderBottomWidth: 1, borderColor: theme.colors.border }}>
        {compact && <Icon name="ArrowLeft" size={18} color={theme.colors.foregroundMuted} />}
        <Text style={{ color: theme.colors.foreground, fontSize: compact ? 18 : 16, fontWeight: '600' }}>Pulse</Text>
      </View>
      {visible && <InboxScreen {...props} directory={directory} />}
    </View>
  </View>;
}
createRoot(document.getElementById('root')).render(<PluginTranslationProvider runtime={runtime}>
  <QueryClientProvider client={query}><Demo /></QueryClientProvider>
</PluginTranslationProvider>);
