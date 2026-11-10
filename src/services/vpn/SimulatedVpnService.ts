import {
  DEMO_SESSION_LABEL,
  type VpnSession,
} from '../../types/vpn';
import type { VpnService } from './VpnService';

const idleSession = (): VpnSession => ({
  state: 'disconnected',
  simulated: true,
  demoLabel: DEMO_SESSION_LABEL,
  serverId: null,
  connectedAt: null,
  errorMessage: null,
});

export class SimulatedVpnService implements VpnService {
  private session: VpnSession = idleSession();
  private listeners = new Set<(session: VpnSession) => void>();
  private generation = 0;

  constructor(private readonly transitionMs = 900) {}

  getSession(): VpnSession {
    return this.session;
  }

  subscribe(listener: (session: VpnSession) => void): () => void {
    this.listeners.add(listener);
    listener(this.session);
    return () => {
      this.listeners.delete(listener);
    };
  }

  reset(): void {
    this.generation += 1;
    this.session = idleSession();
    this.publish();
  }

  async connect(serverId: string): Promise<void> {
    if (
      this.session.state === 'connecting' ||
      this.session.state === 'disconnecting'
    ) {
      return;
    }

    const generation = ++this.generation;
    const trimmed = serverId.trim();
    if (!trimmed) {
      this.update({
        state: 'failed',
        serverId: null,
        connectedAt: null,
        errorMessage: 'Choose a server before starting a demo session.',
      });
      return;
    }

    this.update({
      state: 'connecting',
      serverId: trimmed,
      connectedAt: null,
      errorMessage: null,
    });
    await this.wait();
    if (generation !== this.generation) {
      return;
    }
    this.update({
      state: 'connected',
      serverId: trimmed,
      connectedAt: Date.now(),
      errorMessage: null,
    });
  }

  async disconnect(): Promise<void> {
    if (
      this.session.state === 'disconnected' ||
      this.session.state === 'disconnecting'
    ) {
      return;
    }
    const generation = ++this.generation;
    this.update({
      state: 'disconnecting',
      connectedAt: null,
      errorMessage: null,
    });
    await this.wait();
    if (generation !== this.generation) {
      return;
    }
    this.update(idleSession());
  }

  fail(message: string): void {
    this.generation += 1;
    this.update({
      state: 'failed',
      connectedAt: null,
      errorMessage: message,
    });
  }

  private wait(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, this.transitionMs);
    });
  }

  private update(patch: Partial<VpnSession> | VpnSession): void {
    this.session = {
      ...this.session,
      ...patch,
      simulated: true,
      demoLabel: DEMO_SESSION_LABEL,
    };
    this.publish();
  }

  private publish(): void {
    this.listeners.forEach(listener => listener(this.session));
  }
}

export const simulatedVpn = new SimulatedVpnService();
