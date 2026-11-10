import type { TabKey } from '../components/FloatingTabBar';

export const placeholderTabs: readonly TabKey[] = [];

export function productTabAction(
  tab: TabKey,
): 'home' | 'servers' | 'speed' | 'profile' {
  return tab;
}
