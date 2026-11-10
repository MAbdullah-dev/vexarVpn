import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { legalCopy } from '../src/constants/legal';
import {
  illustrativePricingNote,
  purchaseUnavailableNotice,
  restoreUnavailableNotice,
  subscriptionPlans,
} from '../src/constants/premium';
import { HomeScreen } from '../src/screens/home/HomeScreen';
import { premiumHardwareBack } from '../src/screens/premium/premiumBack';
import { PremiumScreen } from '../src/screens/premium/PremiumScreen';
import { ProfileScreen } from '../src/screens/profile/ProfileScreen';
import { billingState } from '../src/services/billing/billing';
import { simulatedVpn } from '../src/services/vpn';
import { resetAppStore, useAppStore } from '../src/store';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      canGoBack: () => true,
    }),
  };
});

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function flatten(value: unknown): string {
  if (value == null || typeof value === 'boolean') {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(flatten).join('');
  }
  return '';
}

function collectText(renderer: ReactTestRenderer.ReactTestRenderer): string {
  return renderer.root
    .findAllByType(Text)
    .map(node => flatten(node.props.children))
    .join('\n');
}

function renderScreen(
  node: React.ReactElement,
): ReactTestRenderer.ReactTestRenderer {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>{node}</SafeAreaProvider>,
    );
  });
  return renderer;
}

async function pressLabel(
  renderer: ReactTestRenderer.ReactTestRenderer,
  label: string,
) {
  const node = renderer.root.findByProps({ accessibilityLabel: label });
  await ReactTestRenderer.act(async () => {
    node.props.onPress();
  });
}

describe('premium subscription', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    resetAppStore();
    simulatedVpn.reset();
  });

  afterEach(() => {
    if (renderer) {
      ReactTestRenderer.act(() => {
        renderer?.unmount();
      });
    }
    renderer = undefined;
    simulatedVpn.reset();
    jest.useRealTimers();
  });

  it('renders the Premium screen with illustrative plans', () => {
    renderer = renderScreen(<PremiumScreen />);
    const text = collectText(renderer);
    expect(text).toContain('VEXRAVPN');
    expect(text).toContain('Premium Subscription');
    expect(text).toContain('VEXRAVPN Premium');
    expect(text).toContain(illustrativePricingNote);
    expect(text).toContain('Planned. This demo does not add locations or streaming access.');
    for (const plan of subscriptionPlans) {
      expect(text).toContain(plan.title);
      expect(text).toContain(plan.price);
      expect(text).toContain(plan.period);
    }
    expect(text).not.toContain('Guardian Net');
    expect(text).not.toContain('Server Details');
    expect(text).not.toContain('No Logs Audit');
    expect(text).not.toContain('UNLOCK GUARDIAN');
  });

  it('selects a plan without purchasing it', async () => {
    useAppStore.getState().continueAsGuest();
    useAppStore.getState().selectServer('de-frankfurt-04');
    renderer = renderScreen(<PremiumScreen />);
    const year = renderer.root.findByProps({
      accessibilityLabel:
        'Select 1 Year Access. Illustrative price $4.99 / month',
    });
    const month = renderer.root.findByProps({
      accessibilityLabel:
        'Select 1 Month Pass. Illustrative price $11.99 / month',
    });
    expect(year.props.accessibilityState).toEqual({ selected: true });
    expect(month.props.accessibilityState).toEqual({ selected: false });
    expect(collectText(renderer)).toContain('PURCHASES UNAVAILABLE');
    expect(collectText(renderer)).not.toContain('FREE TRIAL');

    await pressLabel(
      renderer,
      'Select 1 Month Pass. Illustrative price $11.99 / month',
    );
    expect(
      renderer.root.findByProps({
        accessibilityLabel:
          'Select 1 Month Pass. Illustrative price $11.99 / month',
      }).props.accessibilityState,
    ).toEqual({ selected: true });
    expect(
      renderer.root.findByProps({
        accessibilityLabel:
          'Select 1 Year Access. Illustrative price $4.99 / month',
      }).props.accessibilityState,
    ).toEqual({ selected: false });
    expect(collectText(renderer)).toContain('PURCHASES UNAVAILABLE');
    expect(collectText(renderer)).not.toContain('ACTIVATE NOW');
    expect(useAppStore.getState().sessionStatus).toBe('guest');
    expect(useAppStore.getState().selectedServerId).toBe('de-frankfurt-04');
    expect(billingState.purchasesEnabled).toBe(false);
  });

  it('keeps purchases, restore, terms, and privacy unavailable', async () => {
    renderer = renderScreen(<PremiumScreen />);
    await pressLabel(
      renderer,
      'PURCHASES UNAVAILABLE. Purchases are not available.',
    );
    expect(collectText(renderer)).toContain(purchaseUnavailableNotice);
    expect(collectText(renderer)).not.toContain('Purchase complete');
    expect(collectText(renderer)).not.toContain('Premium active');
    expect(billingState).toEqual({
      connection: 'disconnected',
      purchasesEnabled: false,
      trialsEnabled: false,
      restoreEnabled: false,
    });
    expect(useAppStore.getState().sessionStatus).toBe('signed_out');

    await pressLabel(renderer, 'Restore purchases');
    expect(collectText(renderer)).toContain(restoreUnavailableNotice);

    await pressLabel(renderer, 'Terms of service');
    expect(collectText(renderer)).toContain(legalCopy.termsTitle);
    expect(collectText(renderer)).toContain('not published');
    await pressLabel(renderer, 'Privacy policy');
    expect(collectText(renderer)).toContain(legalCopy.privacyTitle);
    expect(collectText(renderer)).toContain('not published yet');
  });

  it('returns to the previous screen from Back', async () => {
    expect(
      premiumHardwareBack({ legalOpen: true, canGoBack: true }),
    ).toBe('close-legal');
    expect(
      premiumHardwareBack({ legalOpen: false, canGoBack: true }),
    ).toBe('previous');
    expect(
      premiumHardwareBack({ legalOpen: false, canGoBack: false }),
    ).toBe('home');

    renderer = renderScreen(<PremiumScreen />);
    await pressLabel(renderer, 'Back');
    expect(mockGoBack).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith('Home');
  });

  it('opens Premium from Home and from the Profile subscription card', async () => {
    renderer = renderScreen(<HomeScreen />);
    await pressLabel(renderer, 'Open Premium');
    expect(mockNavigate).toHaveBeenCalledWith('Premium');

    ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
    renderer = renderScreen(<ProfileScreen />);
    await pressLabel(renderer, 'Open Premium subscription');
    expect(mockNavigate).toHaveBeenCalledWith('Premium');
  });
});
