import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DEMO_SPEED_DISCLOSURE } from '../src/constants/speed';
import { SpeedTestScreen } from '../src/screens/speed/SpeedTestScreen';
import {
  filterDemoHistory,
  speedBackAction,
} from '../src/screens/speed/historyRange';
import {
  DemoSpeedTest,
  demoSpeedTest,
  type DemoSpeedRecord,
} from '../src/services/speed/DemoSpeedTest';
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

function renderSpeed(): ReactTestRenderer.ReactTestRenderer {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <SpeedTestScreen />
      </SafeAreaProvider>,
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

async function advance(ms: number) {
  await ReactTestRenderer.act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
}

async function finishDemo(phaseMs: number) {
  for (let step = 0; step < 8; step += 1) {
    await advance(phaseMs);
  }
}

async function pressTab(
  renderer: ReactTestRenderer.ReactTestRenderer,
  label: string,
) {
  const node = renderer.root
    .findAllByProps({ accessibilityRole: 'tab' })
    .find(item => item.props.accessibilityLabel === label);
  if (!node) {
    throw new Error(`Missing tab ${label}`);
  }
  await ReactTestRenderer.act(async () => {
    node.props.onPress();
  });
}

describe('speed test', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    resetAppStore();
    simulatedVpn.reset();
    demoSpeedTest.reset();
  });

  afterEach(() => {
    if (renderer) {
      ReactTestRenderer.act(() => {
        renderer?.unmount();
      });
    }
    renderer = undefined;
    demoSpeedTest.reset();
    simulatedVpn.reset();
    jest.useRealTimers();
  });

  it('walks the demo phases and ignores a second start', async () => {
    const test = new DemoSpeedTest(20);
    const seen: string[] = [];
    test.subscribe(snapshot => {
      seen.push(snapshot.run.phase);
    });
    const first = test.start();
    const second = test.start();
    expect(test.getSnapshot().run.phase).toBe('preparing');
    await advance(20);
    expect(test.getSnapshot().run.phase).toBe('download');
    await advance(20);
    await advance(20);
    await advance(20);
    expect(test.getSnapshot().run.phase).toBe('upload');
    await advance(20);
    await advance(20);
    await advance(20);
    expect(test.getSnapshot().run.phase).toBe('completing');
    await advance(20);
    await first;
    await second;
    expect(test.getSnapshot().run).toMatchObject({
      phase: 'completed',
      simulated: true,
      sampleDownloadMbps: 84.6,
      sampleUploadMbps: 24.8,
      samplePingMs: 17,
    });
    expect(test.getSnapshot().history).toHaveLength(1);
    expect(seen).toEqual(
      expect.arrayContaining([
        'idle',
        'preparing',
        'download',
        'upload',
        'completing',
        'completed',
      ]),
    );

    const again = test.start();
    expect(test.getSnapshot().run.phase).toBe('preparing');
    await finishDemo(20);
    await again;
    expect(test.getSnapshot().history).toHaveLength(2);
  });

  it('stops a failed demo without staying in a running phase', async () => {
    const test = new DemoSpeedTest(50);
    const pending = test.start();
    expect(test.isRunning()).toBe(true);
    test.fail('Demo script stopped.');
    await advance(50);
    await pending;
    expect(test.getSnapshot().run).toMatchObject({
      phase: 'failed',
      errorMessage: 'Demo script stopped.',
      simulated: true,
    });
    expect(test.isRunning()).toBe(false);

    const retry = test.start();
    expect(test.getSnapshot().run.phase).toBe('preparing');
    await finishDemo(50);
    await retry;
    expect(test.getSnapshot().run.phase).toBe('completed');
  });

  it('filters demo history and keeps an empty range empty', () => {
    const now = 1_700_000_000_000;
    const history: DemoSpeedRecord[] = [
      {
        id: 'new',
        completedAt: now - 60_000,
        sampleDownloadMbps: 84.6,
        sampleUploadMbps: 24.8,
        samplePingMs: 17,
      },
      {
        id: 'old',
        completedAt: now - 3 * 24 * 60 * 60 * 1000,
        sampleDownloadMbps: 84.6,
        sampleUploadMbps: 24.8,
        samplePingMs: 17,
      },
    ];
    expect(filterDemoHistory([], 'day', now)).toEqual([]);
    expect(filterDemoHistory(history, 'day', now).map(item => item.id)).toEqual([
      'new',
    ]);
    expect(filterDemoHistory(history, 'week', now).map(item => item.id)).toEqual([
      'new',
      'old',
    ]);
    expect(speedBackAction(false)).toBe('previous');
    expect(speedBackAction(true)).toBe('speed');
  });

  it('renders an idle demo and discloses sample results', () => {
    renderer = renderSpeed();
    const text = collectText(renderer);
    expect(text).toContain('VEXRAVPN');
    expect(text).toContain('Network Performance');
    expect(text).toContain('Demo session');
    expect(text).toContain(DEMO_SPEED_DISCLOSURE);
    expect(text).toContain('No demo tests in this range.');
    expect(text).toContain('START SPEED TEST');
    expect(text).not.toContain('Guardian Net');
    expect(text).not.toContain('WireGuard');
    expect(text).not.toContain('Zero-Knowledge');
    expect(demoSpeedTest.getSnapshot().run.phase).toBe('idle');
  });

  it('runs the on-screen demo without changing the vpn session or selected server', async () => {
    useAppStore.getState().selectServer('de-frankfurt-04');
    const pendingVpn = simulatedVpn.connect('de-frankfurt-04');
    await advance(900);
    await pendingVpn;
    renderer = renderSpeed();
    await pressLabel(renderer, 'Start demo speed test');
    expect(demoSpeedTest.getSnapshot().run.phase).toBe('preparing');
    await pressLabel(renderer, 'Demo speed test PREPARING DEMO');
    expect(demoSpeedTest.getSnapshot().run.phase).toBe('preparing');
    await finishDemo(350);
    expect(demoSpeedTest.getSnapshot().run.phase).toBe('completed');
    expect(demoSpeedTest.getSnapshot().history).toHaveLength(1);
    expect(collectText(renderer)).toContain('84.6');
    expect(collectText(renderer)).toContain('RUN DEMO AGAIN');
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'connected',
      serverId: 'de-frankfurt-04',
      simulated: true,
    });
    expect(useAppStore.getState().selectedServerId).toBe('de-frankfurt-04');
    expect(useAppStore.getState().vpnPermission).toBe('unknown');
  });

  it('shows a failed demo and lets it be retried', async () => {
    renderer = renderSpeed();
    let pending: Promise<void> = Promise.resolve();
    await ReactTestRenderer.act(async () => {
      pending = demoSpeedTest.start();
    });
    await ReactTestRenderer.act(async () => {
      demoSpeedTest.fail('Demo script stopped.');
    });
    await advance(350);
    await pending;
    expect(collectText(renderer)).toContain('DEMO FAILED');
    expect(collectText(renderer)).toContain('Demo script stopped.');
    expect(collectText(renderer)).toContain('RETRY DEMO');
    await pressLabel(renderer, 'Retry demo speed test');
    expect(demoSpeedTest.getSnapshot().run.phase).toBe('preparing');
    await finishDemo(350);
    expect(demoSpeedTest.getSnapshot().run.phase).toBe('completed');
    expect(collectText(renderer)).not.toContain('No demo tests in this range.');
  });

  it('returns to Home and Servers and opens Profile', async () => {
    renderer = renderSpeed();
    await pressLabel(renderer, 'Servers');
    expect(mockNavigate).toHaveBeenCalledWith('Servers');
    await pressTab(renderer, 'Profile');
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
    await pressLabel(renderer, 'Open Premium');
    expect(mockNavigate).toHaveBeenCalledWith('Premium');
    await pressLabel(renderer, 'Home');
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});
