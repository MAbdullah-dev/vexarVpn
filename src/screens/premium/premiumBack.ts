export function premiumHardwareBack(input: {
  legalOpen: boolean;
  canGoBack: boolean;
}): 'close-legal' | 'previous' | 'home' {
  if (input.legalOpen) {
    return 'close-legal';
  }
  if (input.canGoBack) {
    return 'previous';
  }
  return 'home';
}
