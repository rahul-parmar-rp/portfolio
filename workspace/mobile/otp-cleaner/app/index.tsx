import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  PermissionsAndroid,
  Alert,
  StyleSheet,
} from "react-native";
import { readAllSMS, deleteSMSById } from "../services/sms";
import { isOTPMessage } from "../utils/otp";

export default function Index() {
  const [otpMessages, setOtpMessages] = useState<any[]>([]);

  useEffect(() => {
    requestPermissionsAndLoad();
  }, []);

  const requestPermissionsAndLoad = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.WRITE_SMS,
      ]);

      // proceed to load SMS regardless of exact grant state; reading may still fail
      loadSMS();
    } catch (err) {
      console.warn("Permission request error", err);
      loadSMS();
    }
  };

  const loadSMS = async () => {
    try {
      const messages = await readAllSMS();
      const filtered = messages.filter((msg: any) => isOTPMessage(msg.body));
      setOtpMessages(filtered);
    } catch (err) {
      console.error("Failed to read SMS", err);
      const message = (err && (err as any).message) || String(err);
      Alert.alert("Error", `Failed to read SMS: ${message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSMSById(id);
      // reload list
      loadSMS();
    } catch (err) {
      console.warn("Delete failed", err);
      Alert.alert(
        "Delete failed",
        "Android may require your app to be default SMS app to delete messages.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Scan SMS" onPress={loadSMS} />

      <FlatList
        data={otpMessages}
        keyExtractor={(item) =>
          item._id
            ? item._id.toString()
            : item.date?.toString() || Math.random().toString()
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.sender}>{item.address}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Button
              title="Delete"
              onPress={() => handleDelete(item._id || item._idStr || item.id)}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 20 }}>
            <Text>No OTP messages found. Press "Scan SMS" to try.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  sender: { fontWeight: "600", marginBottom: 6 },
  body: { marginBottom: 8 },
});
