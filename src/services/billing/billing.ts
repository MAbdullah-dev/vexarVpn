export const billingState = {
  connection: 'disconnected',
  purchasesEnabled: false,
  trialsEnabled: false,
  restoreEnabled: false,
} as const;

export type BillingState = typeof billingState;
