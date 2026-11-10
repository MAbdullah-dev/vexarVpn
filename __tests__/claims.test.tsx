import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WelcomeScreen } from '../src/screens/onboarding/WelcomeScreen';
import { WhyVpnScreen } from '../src/screens/onboarding/WhyVpnScreen';
import { DEMO_BUILD_NOTE } from '../src/types/vpn';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      canGoBack: () => false,
    }),
  };
});

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function textOf(node: React.ReactElement): string {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>{node}</SafeAreaProvider>,
    );
  });
  const text = renderer.root
    .findAllByType(Text)
    .map(item => {
      const value = item.props.children;
      return Array.isArray(value) ? value.join('') : String(value ?? '');
    })
    .join('\n');
  ReactTestRenderer.act(() => {
    renderer.unmount();
  });
  return text;
}

describe('demo claims', () => {
  it('keeps the welcome and why screens from claiming a live tunnel', () => {
    const welcome = textOf(<WelcomeScreen />);
    expect(welcome).toContain(DEMO_BUILD_NOTE);
    expect(welcome).toContain('VEXRAVPN');
    expect(welcome).not.toContain('ChaCha20');
    expect(welcome).not.toContain('Zero-Log');
    expect(welcome).not.toContain('Guardian Net');

    const why = textOf(<WhyVpnScreen />);
    expect(why).toContain(DEMO_BUILD_NOTE);
    expect(why).toContain('NOT A LIVE TUNNEL');
    expect(why).not.toContain('PROTECTED');
    expect(why).not.toContain('CHACHA20');
    expect(why).not.toContain('10Gbps');
  });
});
