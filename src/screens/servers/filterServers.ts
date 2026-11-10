import type { SampleServer, SampleServerCategory } from '../../constants/servers';

export type ServerFilter =
  | 'all'
  | 'fastest'
  | 'streaming'
  | 'gaming'
  | 'dedicated'
  | 'favorites';

export const serverFilters: readonly {
  id: ServerFilter;
  label: string;
  icon: string;
}[] = [
  { id: 'all', label: 'All Servers', icon: 'public' },
  { id: 'fastest', label: 'Lowest sample', icon: 'bolt' },
  { id: 'streaming', label: 'Streaming', icon: 'play_circle' },
  { id: 'gaming', label: 'Gaming', icon: 'sports_esports' },
  { id: 'dedicated', label: 'Dedicated sample', icon: 'swap_calls' },
  { id: 'favorites', label: 'Favorites', icon: 'star' },
];

const categoryFilters: Record<
  Exclude<ServerFilter, 'all' | 'favorites'>,
  SampleServerCategory
> = {
  fastest: 'fastest',
  streaming: 'streaming',
  gaming: 'gaming',
  dedicated: 'dedicated',
};

export function filterSampleServers(input: {
  servers: readonly SampleServer[];
  query: string;
  filter: ServerFilter;
  favoriteIds: readonly string[];
}): SampleServer[] {
  const query = input.query.trim().toLowerCase();
  const matched = input.servers.filter(server => {
    const matchesQuery =
      query.length === 0 ||
      server.country.toLowerCase().includes(query) ||
      server.city.toLowerCase().includes(query) ||
      server.name.toLowerCase().includes(query);
    if (!matchesQuery) {
      return false;
    }
    if (input.filter === 'favorites') {
      return input.favoriteIds.includes(server.id);
    }
    if (input.filter === 'all') {
      return true;
    }
    return server.categories.includes(categoryFilters[input.filter]);
  });

  if (input.filter !== 'fastest') {
    return matched;
  }
  return [...matched].sort(
    (left, right) => left.sampleLatencyMs - right.sampleLatencyMs,
  );
}

export function serversBackAction(
  showingPlaceholder: boolean,
): 'explorer' | 'home' {
  return showingPlaceholder ? 'explorer' : 'home';
}
