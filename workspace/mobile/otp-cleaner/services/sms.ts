import SmsAndroid from "react-native-get-sms-android";

const nativeMissingError = new Error(
  "react-native-get-sms-android native module not found. Make sure the library is installed and the app is rebuilt (npx expo prebuild && npx expo run:android).",
);

export const readAllSMS = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!SmsAndroid || typeof SmsAndroid.list !== "function") {
      return reject(nativeMissingError);
    }

    const filter = {
      box: "inbox",
      // you can add more filters like address, indexFrom, maxCount
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: any) => reject(fail),
      (count: number, smsList: string) => {
        try {
          const arr = JSON.parse(smsList);
          resolve(arr);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
};

export const deleteSMSById = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!SmsAndroid || typeof SmsAndroid.delete !== "function") {
      return reject(nativeMissingError);
    }

    SmsAndroid.delete(
      id,
      (fail: any) => reject(fail),
      (success: any) => resolve(),
    );
  });
};

export const isSmsNativeAvailable = () =>
  Boolean(SmsAndroid && typeof SmsAndroid.list === "function");
