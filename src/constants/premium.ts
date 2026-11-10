export type PlanId = 'year' | 'month' | 'week' | 'day';

export type SubscriptionPlan = {
  id: PlanId;
  title: string;
  price: string;
  period: string;
  detail: string;
  badge: string;
  featured: boolean;
};

export const defaultPlanId: PlanId = 'year';

export const illustrativePricingNote =
  'Illustrative demo pricing. Selecting a plan is not a purchase, and nothing is billed.';

export const purchaseUnavailableNotice =
  'Purchases are not available in this build. No trial has started, and Premium access was not granted.';

export const restoreUnavailableNotice =
  'There are no purchases to restore. Billing is not connected.';

export const billingDisconnectedNote =
  'Billing is not connected. Nothing renews in this demo.';

export const subscriptionPlans: readonly SubscriptionPlan[] = [
  {
    id: 'year',
    title: '1 Year Access',
    price: '$4.99',
    period: '/ month',
    detail: 'Sample annual total $59.88. Nothing is billed.',
    badge: 'Sample year',
    featured: true,
  },
  {
    id: 'month',
    title: '1 Month Pass',
    price: '$11.99',
    period: '/ month',
    detail: 'Sample monthly price. Nothing renews in this demo.',
    badge: 'Sample month',
    featured: false,
  },
  {
    id: 'week',
    title: '1 Week Pass',
    price: '$3.99',
    period: '/ week',
    detail: 'Sample weekly price. Nothing is billed.',
    badge: 'Sample week',
    featured: false,
  },
  {
    id: 'day',
    title: '1 Day Micro-Pass',
    price: '$1.49',
    period: '/ 24 hours',
    detail: 'Sample one-day price. This demo does not protect Wi-Fi.',
    badge: 'Sample day',
    featured: false,
  },
];

export const premiumBenefits = [
  {
    title: '85+ worldwide locations and 1,420+ nodes',
    detail: 'Planned. This demo does not add locations or streaming access.',
  },
  {
    title: '10Gbps RAM-only infrastructure',
    detail: 'Planned. This demo does not provide that infrastructure.',
  },
  {
    title: 'Streaming and gaming dedicated IP pools',
    detail: 'Planned. This demo does not assign a dedicated IP.',
  },
  {
    title: 'Multi-hop cascade and Tor-over-VPN',
    detail: 'Planned. This demo does not route traffic through extra hops.',
  },
  {
    title: 'Priority support',
    detail: 'Planned. Help is not available in this build.',
  },
] as const;

export function findSubscriptionPlan(id: PlanId): SubscriptionPlan {
  const plan = subscriptionPlans.find(item => item.id === id);
  return plan ?? subscriptionPlans[0];
}

export function purchaseCtaLabel(planId: PlanId): string {
  findSubscriptionPlan(planId);
  return 'PURCHASES UNAVAILABLE';
}
