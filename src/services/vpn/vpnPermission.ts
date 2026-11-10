import { NativeModules } from 'react-native';

export type AndroidVpnPermissionResult = 'granted' | 'deferred';

type VpnPermissionNative = {
  prepare: () => Promise<string | null>;
};

/**
 * Maps VpnService.prepare() and the system dialog result.
 * null means Android already has consent for this app.
 * Anything other than an explicit grant, including cancelling the dialog,
 * stays deferred so the request can be shown again later.
 */
export function interpretVpnPrepareResult(
  result: string | null | undefined,
): AndroidVpnPermissionResult {
  if (result === null || result === 'granted') {
    return 'granted';
  }
  return 'deferred';
}

/**
 * Calls Android VpnService.prepare().
 * A granted result means this app may ask Android for a VPN interface later.
 * It does not open a tunnel and it does not change the demo session.
 */
export async function requestAndroidVpnPermission(): Promise<AndroidVpnPermissionResult> {
  const native = NativeModules.VpnPermission as VpnPermissionNative | undefined;
  if (!native?.prepare) {
    throw new Error('Android VPN permission is not available in this build.');
  }
  const result = await native.prepare();
  return interpretVpnPrepareResult(result);
}
