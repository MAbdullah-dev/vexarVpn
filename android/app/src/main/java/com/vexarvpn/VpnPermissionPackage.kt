package com.vexarvpn

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class VpnPermissionPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    if (name == VpnPermissionModule.NAME) {
      return VpnPermissionModule(reactContext)
    }
    return null
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
          VpnPermissionModule.NAME to
              ReactModuleInfo(
                  VpnPermissionModule.NAME,
                  VpnPermissionModule::class.java.name,
                  false,
                  false,
                  false,
                  false,
              ),
      )
    }
  }
}
