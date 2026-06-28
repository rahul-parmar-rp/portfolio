import { NativeModules, PermissionsAndroid, Platform } from "react-native";

export type InboxSms = {
  id: string;
  sender: string;
  body: string;
  date: number;
};

type NativeSmsRecord = {
  _id?: number | string;
  address?: string;
  body?: string;
  date?: number | string;
};

type SmsNativeModule = {
  list: (
    filter: string,
    errorCallback: (error: string) => void,
    successCallback: (count: number, smsList: string) => void,
  ) => void;
};

const smsModule =
  Platform.OS === "android"
    ? (NativeModules.Sms as SmsNativeModule | undefined)
    : undefined;

export function hasSmsModule(): boolean {
  return Boolean(smsModule);
}

export async function hasSmsPermission(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
}

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    {
      title: "Allow SMS access",
      message:
        "Offline OTP Shield reads your local SMS inbox on-device to parse OTP codes offline.",
      buttonPositive: "Allow",
      buttonNegative: "Deny",
    },
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function listInboxMessages(maxCount = 25): Promise<InboxSms[]> {
  if (Platform.OS !== "android") {
    throw new Error("SMS inbox access is only available on Android.");
  }

  if (!smsModule) {
    throw new Error(
      "Native SMS module is unavailable in this build. Use an Android development build instead of Expo Go.",
    );
  }

  return new Promise((resolve, reject) => {
    smsModule.list(
      JSON.stringify({
        box: "inbox",
        indexFrom: 0,
        maxCount,
        sortOrder: "date DESC",
      }),
      (error) => {
        reject(new Error(error));
      },
      (_count, smsList) => {
        try {
          const records = JSON.parse(smsList) as NativeSmsRecord[];
          const messages = records.map((record) => ({
            id: String(record._id ?? Math.random()),
            sender: record.address?.trim() || "Unknown",
            body: record.body?.trim() || "",
            date: Number(record.date ?? Date.now()),
          }));

          resolve(messages.filter((message) => message.body.length > 0));
        } catch {
          reject(new Error("Unable to parse SMS inbox results."));
        }
      },
    );
  });
}
