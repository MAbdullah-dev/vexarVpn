import type { VpnSession } from '../../types/vpn';

export interface VpnService {
  getSession(): VpnSession;
  subscribe(listener: (session: VpnSession) => void): () => void;
  connect(serverId: string): Promise<void>;
  disconnect(): Promise<void>;
  fail(message: string): void;
}
