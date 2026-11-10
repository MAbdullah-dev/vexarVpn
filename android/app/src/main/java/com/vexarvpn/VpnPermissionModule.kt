package com.vexarvpn

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Asks Android to prepare this app as a VPN client.
 *
 * [VpnService.prepare] only shows the system consent dialog, or returns null
 * when consent already exists. It does not create a tunnel or mark a session
 * connected.
 */
class VpnPermissionModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  private var pending: Promise? = null

  override fun getName(): String = NAME

  override fun initialize() {
    super.initialize()
    reactApplicationContext.addActivityEventListener(activityListener)
  }

  override fun invalidate() {
    reactApplicationContext.removeActivityEventListener(activityListener)
    pending?.reject("CANCELLED", "VPN permission request ended before Android returned.")
    pending = null
    super.invalidate()
  }

  @ReactMethod
  fun prepare(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "VPN permission needs a foreground Android activity.")
      return
    }

    val intent =
        try {
          VpnService.prepare(activity)
        } catch (error: RuntimeException) {
          promise.reject("PREPARE_FAILED", error.message, error)
          return
        }

    if (intent == null) {
      promise.resolve(GRANTED)
      return
    }

    if (pending != null) {
      promise.reject("IN_PROGRESS", "A VPN permission request is already open.")
      return
    }

    pending = promise
    try {
      reactApplicationContext.startActivityForResult(intent, REQUEST_CODE, null)
    } catch (error: RuntimeException) {
      pending = null
      promise.reject("DIALOG_FAILED", error.message, error)
    }
  }

  private val activityListener =
      object : ActivityEventListener {
        override fun onActivityResult(
            activity: Activity,
            requestCode: Int,
            resultCode: Int,
            data: Intent?,
        ) {
          if (requestCode != REQUEST_CODE) {
            return
          }
          val promise = pending ?: return
          pending = null
          // Cancelling the system dialog is not a permanent denial. Android
          // will show the same consent dialog again on a later prepare() call.
          promise.resolve(if (resultCode == Activity.RESULT_OK) GRANTED else DEFERRED)
        }

        override fun onNewIntent(intent: Intent) = Unit
      }

  companion object {
    const val NAME = "VpnPermission"
    private const val REQUEST_CODE = 4816
    const val GRANTED = "granted"
    const val DEFERRED = "deferred"
  }
}
