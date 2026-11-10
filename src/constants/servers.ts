import type { FlagCode } from '../assets/images';

/**
 * One catalog of sample routes for Home and Server Explorer.
 * Latency, load, and tags are layout placeholders, not live measurements.
 */
export type SampleServerCategory =
  | 'fastest'
  | 'streaming'
  | 'gaming'
  | 'dedicated';

export type SampleServer = {
  id: string;
  name: string;
  country: string;
  city: string;
  location: string;
  flag: FlagCode;
  sampleLatencyMs: number;
  sampleLoadPercent: number;
  label: string;
  tag: string;
  categories: readonly SampleServerCategory[];
  featuredOnHome: boolean;
};

export const sampleServers: readonly SampleServer[] = [
  {
    id: 'de-frankfurt-04',
    name: 'Node DE-08',
    country: 'Germany',
    city: 'Frankfurt',
    location: 'Frankfurt #04',
    flag: 'de',
    sampleLatencyMs: 17,
    sampleLoadPercent: 12,
    label: 'Sample route',
    tag: 'Sample streaming',
    categories: ['streaming', 'fastest'],
    featuredOnHome: true,
  },
  {
    id: 'nl-amsterdam-12',
    name: 'Node NL-03',
    country: 'Netherlands',
    city: 'Amsterdam',
    location: 'Amsterdam #12',
    flag: 'nl',
    sampleLatencyMs: 23,
    sampleLoadPercent: 24,
    label: 'Sample route',
    tag: 'Sample route',
    categories: ['dedicated', 'fastest'],
    featuredOnHome: true,
  },
  {
    id: 'us-new-york-01',
    name: 'Node US-EAST-01',
    country: 'United States',
    city: 'New York',
    location: 'New York #01',
    flag: 'us',
    sampleLatencyMs: 84,
    sampleLoadPercent: 38,
    label: 'Sample route',
    tag: 'Sample route',
    categories: ['streaming'],
    featuredOnHome: false,
  },
  {
    id: 'gb-london-04',
    name: 'Node UK-LDN-04',
    country: 'United Kingdom',
    city: 'London',
    location: 'London #04',
    flag: 'gb',
    sampleLatencyMs: 31,
    sampleLoadPercent: 19,
    label: 'Sample route',
    tag: 'Sample route',
    categories: ['fastest', 'streaming'],
    featuredOnHome: false,
  },
  {
    id: 'jp-tokyo-09',
    name: 'Node JP-TYO-09',
    country: 'Japan',
    city: 'Tokyo',
    location: 'Tokyo #09',
    flag: 'jp',
    sampleLatencyMs: 142,
    sampleLoadPercent: 54,
    label: 'Sample route',
    tag: 'Sample latency',
    categories: ['gaming'],
    featuredOnHome: false,
  },
  {
    id: 'sg-singapore-02',
    name: 'Node SG-02',
    country: 'Singapore',
    city: 'Singapore',
    location: 'Singapore #02',
    flag: 'sg',
    sampleLatencyMs: 48,
    sampleLoadPercent: 28,
    label: 'Sample route',
    tag: 'Sample gaming',
    categories: ['gaming', 'fastest'],
    featuredOnHome: true,
  },
];

export const homeSampleServers = sampleServers.filter(
  server => server.featuredOnHome,
);

export const SAMPLE_ADDRESS = '198.51.100.24';
export const SAMPLE_DOWNLOAD_MBPS = '84.6';
export const SAMPLE_UPLOAD_MBPS = '24.8';
export const SAMPLE_FIGURES_NOTE = 'Sample figures. Not a live measurement.';
export const SAMPLE_ADDRESS_NOTE = 'Sample IP. Not this device.';

export function findSampleServer(id: string | null): SampleServer | undefined {
  if (!id) {
    return undefined;
  }
  return sampleServers.find(server => server.id === id);
}
