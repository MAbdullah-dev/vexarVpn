import { useEffect, useState } from 'react';

import { simulatedVpn } from '../services/vpn';
import type { VpnSession } from '../types/vpn';

export function useVpnSession() {
  const [session, setSession] = useState<VpnSession>(simulatedVpn.getSession());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => simulatedVpn.subscribe(setSession), []);

  useEffect(() => {
    if (session.state !== 'connected') {
      return;
    }
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [session.state]);

  return {
    session,
    now,
    connect: (serverId: string) => simulatedVpn.connect(serverId),
    disconnect: () => simulatedVpn.disconnect(),
    fail: (message: string) => simulatedVpn.fail(message),
  };
}
