import { useRef } from 'react';

import { useVpnSession } from '../../hooks';
import { simulatedVpn } from '../../services/vpn';
import { useAppStore } from '../../store';
import { resolveHomeToggle } from './connectionPresentation';

export function useHomeActions() {
  const selectedServerId = useAppStore(state => state.selectedServerId);
  const vpn = useVpnSession();
  const inFlight = useRef(false);

  const toggle = async () => {
    if (inFlight.current) {
      return;
    }
    const decision = resolveHomeToggle({
      state: simulatedVpn.getSession().state,
      selectedServerId: useAppStore.getState().selectedServerId,
    });
    if (decision.type === 'ignore') {
      return;
    }

    inFlight.current = true;
    try {
      if (decision.type === 'disconnect') {
        await vpn.disconnect();
        return;
      }
      if (decision.type === 'need-server') {
        await vpn.connect(' ');
        return;
      }
      useAppStore.getState().rememberRecent(decision.serverId);
      await vpn.connect(decision.serverId);
    } finally {
      inFlight.current = false;
    }
  };

  const chooseServer = (serverId: string) => {
    const store = useAppStore.getState();
    store.selectServer(serverId);
    store.rememberRecent(serverId);
  };

  return {
    session: vpn.session,
    now: vpn.now,
    selectedServerId,
    toggle,
    chooseServer,
  };
}
