import { useEffect, useState, type ReactNode } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '../../components/AppText';
import { FloatingTabBar } from '../../components/FloatingTabBar';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { APP_VERSION } from '../../constants/profile';
import { placeholderTabs, productTabAction } from '../../navigation/productTabs';
import type { RootStackParamList } from '../../navigation/types';
import { useAppStore } from '../../store';
import type { ProfileSettings } from '../../types/profile';
import { colors, radius, spacing } from '../../theme';
import { HomeHeader } from '../home/HomeHeader';
import { AccountCard } from './AccountCard';
import { ChoiceEditor, NameEditor } from './PreferenceEditor';
import {
  ABOUT_NOTICE,
  accountPresentation,
  addLocalName,
  defenseCopy,
  diagnosticChoices,
  dnsChoices,
  dnsIntro,
  dnsLabel,
  HELP_NOTICE,
  languageChoices,
  languageLabel,
  listSubtitle,
  localNameNotice,
  logoutCopy,
  NOTIFICATIONS_NOTICE,
  PROFILE_HERE_NOTICE,
  profileBackAction,
  protocolChoices,
  protocolIntro,
  protocolLabel,
  removeLocalName,
  savedCount,
  splitIntro,
  themeChoices,
  themeLabel,
  trustedIntro,
  type ProfileDetail,
} from './profileModel';
import { SettingsLink, SettingsToggle } from './SettingRow';

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const sessionStatus = useAppStore(state => state.sessionStatus);
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const setSplitTunnelApps = useAppStore(state => state.setSplitTunnelApps);
  const setTrustedNetworks = useAppStore(state => state.setTrustedNetworks);
  const logOut = useAppStore(state => state.logOut);
  const [detail, setDetail] = useState<ProfileDetail | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const account = accountPresentation(sessionStatus);
  const logout = logoutCopy(sessionStatus);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (profileBackAction(detail !== null) === 'profile') {
        setDetail(null);
        return true;
      }
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [detail, navigation]);

  const open = (next: ProfileDetail) => {
    setNotice(null);
    setDetail(next);
  };

  const saveNames = (
    kind: 'network' | 'app',
    current: readonly string[],
    raw: string,
    commit: (names: string[]) => void,
  ): boolean => {
    const next = addLocalName(current, raw);
    setNotice(localNameNotice(next.result, kind));
    if (next.result === 'added') {
      commit(next.names);
      return true;
    }
    return false;
  };

  return (
    <Screen>
      <View style={styles.header}>
        <HomeHeader
          section="PROFILE"
          onPremium={() => navigation.navigate('Premium')}
          onNotifications={() => setNotice(NOTIFICATIONS_NOTICE)}
          onProfile={() => setNotice(PROFILE_HERE_NOTICE)}
        />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {notice ? (
          <View style={styles.notice}>
            <AppText variant="bodySm" color={colors.onSurfaceVariant}>
              {notice}
            </AppText>
          </View>
        ) : null}
        {detail === null ? (
          <ProfileList
            account={account}
            settings={settings}
            logoutLabel={logout.label}
            logoutAccessibility={logout.accessibilityLabel}
            logoutCaption={logout.caption}
            onManage={() => navigation.navigate('Premium')}
            onToggle={(key, value) => {
              updateSettings({ [key]: value });
              setNotice(defenseCopy[key].notice);
            }}
            onOpen={open}
            onHelp={() => setNotice(HELP_NOTICE)}
            onAbout={() => setNotice(ABOUT_NOTICE)}
            onLogout={logOut}
          />
        ) : null}
        {detail === 'protocol' ? (
          <ChoiceEditor
            title="VPN Protocol"
            body={protocolIntro}
            choices={protocolChoices}
            selected={settings.protocol}
            onSelect={protocol => updateSettings({ protocol })}
            onBack={() => setDetail(null)}
          />
        ) : null}
        {detail === 'dns' ? (
          <ChoiceEditor
            title="Private DNS Resolver"
            body={dnsIntro}
            choices={dnsChoices}
            selected={settings.dnsResolver}
            onSelect={dnsResolver => updateSettings({ dnsResolver })}
            onBack={() => setDetail(null)}
          />
        ) : null}
        {detail === 'theme' ? (
          <ChoiceEditor
            title="App Theme"
            body="This preference is saved on the device. Obsidian Dark is the active theme."
            choices={themeChoices}
            selected={settings.theme}
            onSelect={theme => updateSettings({ theme })}
            onBack={() => setDetail(null)}
          />
        ) : null}
        {detail === 'language' ? (
          <ChoiceEditor
            title="Language"
            body="This preference is saved on the device. The app text stays in English."
            choices={languageChoices}
            selected={settings.language}
            onSelect={language => updateSettings({ language })}
            onBack={() => setDetail(null)}
          />
        ) : null}
        {detail === 'diagnostics' ? (
          <ChoiceEditor
            title="Diagnostic Telemetry"
            body="This preference is saved on the device. This build has no telemetry upload."
            choices={diagnosticChoices}
            selected={settings.diagnosticTelemetry}
            onSelect={diagnosticTelemetry => updateSettings({ diagnosticTelemetry })}
            onBack={() => setDetail(null)}
          />
        ) : null}
        {detail === 'trusted' ? (
          <NameEditor
            title="Trusted Wi-Fi Networks"
            body={trustedIntro}
            names={settings.trustedNetworkNames}
            empty="No trusted networks saved."
            inputLabel="Trusted network name"
            addLabel="Add trusted network"
            onAdd={raw =>
              saveNames('network', settings.trustedNetworkNames, raw, setTrustedNetworks)
            }
            onRemove={name =>
              setTrustedNetworks(removeLocalName(settings.trustedNetworkNames, name))
            }
            onBack={() => setDetail(null)}
          />
        ) : null}
        {detail === 'split' ? (
          <NameEditor
            title="Split Tunneling"
            body={splitIntro}
            names={settings.splitTunnelAppIds}
            empty="No app names saved."
            inputLabel="Split tunnel app name"
            addLabel="Add split tunnel app"
            onAdd={raw =>
              saveNames('app', settings.splitTunnelAppIds, raw, setSplitTunnelApps)
            }
            onRemove={name =>
              setSplitTunnelApps(removeLocalName(settings.splitTunnelAppIds, name))
            }
            onBack={() => setDetail(null)}
          />
        ) : null}
      </ScrollView>
      <FloatingTabBar
        active="profile"
        unavailable={placeholderTabs}
        onChange={next => {
          const action = productTabAction(next);
          if (action === 'profile') {
            setDetail(null);
            return;
          }
          if (action === 'home') {
            navigation.navigate('Home');
            return;
          }
          if (action === 'servers') {
            navigation.navigate('Servers');
            return;
          }
          navigation.navigate('Speed');
        }}
      />
    </Screen>
  );
}

function ProfileList({
  account,
  settings,
  logoutLabel,
  logoutAccessibility,
  logoutCaption,
  onManage,
  onToggle,
  onOpen,
  onHelp,
  onAbout,
  onLogout,
}: {
  account: ReturnType<typeof accountPresentation>;
  settings: ProfileSettings;
  logoutLabel: string;
  logoutAccessibility: string;
  logoutCaption: string;
  onManage: () => void;
  onToggle: (
    key: 'autoConnect' | 'killSwitch' | 'threatBlocker',
    value: boolean,
  ) => void;
  onOpen: (detail: ProfileDetail) => void;
  onHelp: () => void;
  onAbout: () => void;
  onLogout: () => void;
}) {
  return (
    <View style={styles.stack}>
      <AccountCard
        name={account.name}
        badge={account.badge}
        summary={account.summary}
        signIn={account.signIn}
        onManage={onManage}
        stats={[
          { icon: 'person', label: 'Session', value: account.sessionValue },
          { icon: 'lock', label: 'Sign-in', value: 'Unavailable' },
          { icon: 'workspace_premium', label: 'Plan', value: 'None' },
        ]}
      />
      <Section
        icon="security"
        title="Core Cyber Defense"
        trailing="Saved on this device">
        <SettingsToggle
          icon="sync_saved_locally"
          title={defenseCopy.autoConnect.title}
          subtitle={defenseCopy.autoConnect.subtitle}
          value={settings.autoConnect}
          onValueChange={value => onToggle('autoConnect', value)}
        />
        <Divider />
        <SettingsToggle
          icon="power_settings_new"
          title={defenseCopy.killSwitch.title}
          subtitle={defenseCopy.killSwitch.subtitle}
          badge="STRICT"
          value={settings.killSwitch}
          onValueChange={value => onToggle('killSwitch', value)}
        />
        <Divider />
        <SettingsLink
          icon="call_split"
          title="Split Tunneling"
          subtitle={listSubtitle(
            settings.splitTunnelAppIds,
            'No app names saved.',
          )}
          trailing={savedCount(settings.splitTunnelAppIds.length)}
          accessibilityLabel="Edit split tunneling"
          onPress={() => onOpen('split')}
        />
        <Divider />
        <SettingsLink
          icon="alt_route"
          title="VPN Protocol"
          subtitle={`${protocolLabel(settings)}. Saved preference. No tunnel is started.`}
          trailing="UDP"
          accessibilityLabel="Edit VPN protocol"
          onPress={() => onOpen('protocol')}
        />
        <Divider />
        <SettingsLink
          icon="dns"
          title="Private DNS Resolver"
          subtitle={`${dnsLabel(settings)}. Device DNS is unchanged.`}
          accessibilityLabel="Edit DNS preference"
          actionIcon="edit"
          onPress={() => onOpen('dns')}
        />
        <Divider />
        <SettingsToggle
          icon="shield_lock"
          title={defenseCopy.threatBlocker.title}
          subtitle={defenseCopy.threatBlocker.subtitle}
          value={settings.threatBlocker}
          onValueChange={value => onToggle('threatBlocker', value)}
        />
        <Divider />
        <SettingsLink
          icon="wifi_tethering"
          title="Trusted Wi-Fi Networks"
          subtitle={listSubtitle(
            settings.trustedNetworkNames,
            'None saved.',
          )}
          trailing={savedCount(settings.trustedNetworkNames.length)}
          accessibilityLabel="Edit trusted networks"
          onPress={() => onOpen('trusted')}
        />
      </Section>
      <Section icon="tune" title="Preferences & Privacy">
        <SettingsLink
          icon="dark_mode"
          title="App Theme"
          subtitle={themeLabel(settings)}
          accessibilityLabel="Edit app theme"
          onPress={() => onOpen('theme')}
        />
        <Divider />
        <SettingsLink
          icon="translate"
          title="Language"
          subtitle={languageLabel(settings)}
          accessibilityLabel="Edit language"
          onPress={() => onOpen('language')}
        />
        <Divider />
        <SettingsLink
          icon="analytics"
          title="Diagnostic Telemetry"
          subtitle="Stored on this device"
          accessibilityLabel="Edit diagnostic telemetry"
          onPress={() => onOpen('diagnostics')}
        />
        <Divider />
        <SettingsLink
          icon="support_agent"
          title="Help & Support"
          subtitle="Not available in this build"
          accessibilityLabel="Help and support"
          onPress={onHelp}
        />
        <Divider />
        <SettingsLink
          icon="info"
          title="About VEXRAVPN"
          subtitle={`v${APP_VERSION}`}
          accessibilityLabel="About VEXRAVPN"
          onPress={onAbout}
        />
      </Section>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={logoutAccessibility}
        onPress={onLogout}
        style={styles.logout}>
        <Icon name="logout" size={20} color={colors.error} />
        <AppText variant="labelLg" color={colors.error}>
          {logoutLabel}
        </AppText>
      </Pressable>
      <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.caption}>
        {logoutCaption}
      </AppText>
    </View>
  );
}

function Section({
  icon,
  title,
  trailing,
  children,
}: {
  icon: string;
  title: string;
  trailing?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionTitle}>
          <Icon name={icon} size={18} color={colors.primary} />
          <AppText variant="labelLg" color={colors.onSurfaceVariant}>
            {title}
          </AppText>
        </View>
        {trailing ? (
          <AppText variant="labelSm" color={colors.primary}>
            {trailing}
          </AppText>
        ) : null}
      </View>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  notice: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.md,
  },
  stack: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  group: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHighest,
  },
  logout: {
    minHeight: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHighest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  caption: {
    textAlign: 'center',
  },
});
