# Native Integration Stubs for Permissions and Services

This document outlines the native integration stubs required for the Android app "Offline OTP Shield" built with React Native using Expo.

## Permissions

The app will require specific Android permissions for SMS interception and storage.

### Required Permissions in `app.json`

```json
{
  "android": {
    "permissions": [
      "READ_SMS",
      "RECEIVE_SMS",
      "WRITE_EXTERNAL_STORAGE",
      "INTERNET"
    ]
  }
}
```

### Permissions Handling Code

Permissions will be requested at runtime using Expo's `Permissions` API:

```ts
import * as Permissions from "expo-permissions";

export const requestSmsPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.SMS);
  return status === "granted";
};
```

---

## SMS Interception

SMS messages must be intercepted natively when they arrive. Expo will use a custom native module for `SMSRetriever` API.

### Native Stub

```ts
import { NativeModules } from "react-native";

const { SMSInterceptor } = NativeModules;

export const startSmsInterception = async () => {
  SMSInterceptor.activate();
};
```

Expo custom module support must include wrapping Java files for integration.

### Android Native Module (Example)

#### File: `SMSInterceptor.java`

```java
package com.offlineotpshield;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SMSInterceptor extends ReactContextBaseJavaModule {

  @ReactMethod
  public void activate() {
    IntentFilter filter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
    getReactApplicationContext().registerReceiver(new SMSReceiver(), filter);
  }
}
```
