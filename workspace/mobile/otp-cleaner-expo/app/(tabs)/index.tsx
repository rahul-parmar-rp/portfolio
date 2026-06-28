import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { parseOtpFromText, type SenderRules } from "@/src/utils/engine";
import {
  hasSmsModule,
  hasSmsPermission,
  listInboxMessages,
  requestSmsPermission,
} from "@/src/utils/sms";

type Message = {
  id: string;
  sender: string;
  text: string;
  date?: number;
  sourceKind: "live" | "demo";
};

type ParsedMessage = Message & {
  token: string | null;
  source: "custom" | "regex" | "none";
};

type ListMode = "all" | "otp" | "nonOtp";

type PermissionState = "unknown" | "granted" | "denied";

const STORAGE_KEY = "offline_otp_shield_rules_v1";
let memoryRulesFallback: SenderRules = {};

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "HDFC",
    text: "Your OTP is 455612 for transfer request.",
    sourceKind: "demo",
  },
  {
    id: "2",
    sender: "AMAZON",
    text: "Use code 882211 to confirm your sign in.",
    sourceKind: "demo",
  },
  {
    id: "3",
    sender: "SBI",
    text: "SBI alert: token 987654 for payment.",
    sourceKind: "demo",
  },
  {
    id: "4",
    sender: "PAYTM",
    text: "Paytm OTP: 112233 valid for 10 minutes.",
    sourceKind: "demo",
  },
];

async function loadRulesFromStorage(): Promise<SenderRules> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryRulesFallback;

    const parsed = JSON.parse(raw) as SenderRules;
    memoryRulesFallback = parsed;
    return parsed;
  } catch {
    return memoryRulesFallback;
  }
}

async function saveRulesToStorage(rules: SenderRules): Promise<void> {
  memoryRulesFallback = rules;

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch {
    // No-op: keep in-memory rules working when native storage is unavailable.
  }
}

export default function OfflineOtpShieldScreen() {
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [demoMessages, setDemoMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [showDemoSection, setShowDemoSection] = useState(false);
  const [listMode, setListMode] = useState<ListMode>("all");
  const [rules, setRules] = useState<SenderRules>({});
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<
    number | null
  >(null);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("unknown");
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    hasSmsModule()
      ? "Tap Enable SMS Access to read your Android inbox offline."
      : "This build does not include the native SMS module. Use an Android development build instead of Expo Go.",
  );

  useEffect(() => {
    const loadRules = async () => {
      const storedRules = await loadRulesFromStorage();
      setRules(storedRules);
    };

    const syncPermission = async () => {
      if (!hasSmsModule()) {
        setPermissionState("denied");
        return;
      }

      const granted = await hasSmsPermission();
      setPermissionState(granted ? "granted" : "unknown");

      if (granted) {
        await loadInbox();
      }
    };

    void loadRules();
    void syncPermission();
  }, []);

  const parsedLiveRows = useMemo(() => {
    return liveMessages.map((message) => {
      const result = parseOtpFromText(message.sender, message.text, rules);
      return {
        ...message,
        token: result.token,
        source: result.source,
      };
    });
  }, [liveMessages, rules]);

  const parsedDemoRows = useMemo(() => {
    return demoMessages.map((message) => {
      const result = parseOtpFromText(message.sender, message.text, rules);
      return {
        ...message,
        token: result.token,
        source: result.source,
      };
    });
  }, [demoMessages, rules]);

  const visibleRows = useMemo(() => {
    return showDemoSection ? [...parsedLiveRows, ...parsedDemoRows] : parsedLiveRows;
  }, [showDemoSection, parsedLiveRows, parsedDemoRows]);

  const otpRows = useMemo(() => {
    return visibleRows.filter((message) => Boolean(message.token));
  }, [visibleRows]);

  const nonOtpRows = useMemo(() => {
    return visibleRows.filter((message) => !message.token);
  }, [visibleRows]);

  const filteredRows = useMemo(() => {
    if (listMode === "otp") return otpRows;
    if (listMode === "nonOtp") return nonOtpRows;
    return visibleRows;
  }, [listMode, nonOtpRows, otpRows, visibleRows]);

  async function loadInbox() {
    if (!hasSmsModule()) {
      setStatusMessage(
        "Native SMS module is missing in this build. Install and open the Android dev build, not Expo Go.",
      );
      return;
    }

    setIsLoadingInbox(true);
    setStatusMessage("Loading local SMS inbox...");

    try {
      const messages = await listInboxMessages(30);
      const nextMessages: Message[] = messages.map((message) => ({
        id: message.id,
        sender: message.sender,
        text: message.body,
        date: message.date,
        sourceKind: "live",
      }));

      setLiveMessages(nextMessages);
      setStatusMessage(
        nextMessages.length > 0
          ? `Loaded ${nextMessages.length} inbox messages from this device.`
          : "SMS permission is granted, but no inbox messages were found.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load SMS inbox.";
      setStatusMessage(message);
    } finally {
      setIsLoadingInbox(false);
    }
  }

  const enableSmsAccess = async () => {
    if (!hasSmsModule()) {
      setPermissionState("denied");
      setStatusMessage(
        "Expo Go cannot provide SMS inbox access. Build and install an Android development build for this app.",
      );
      return;
    }

    const granted = await requestSmsPermission();
    setPermissionState(granted ? "granted" : "denied");

    if (!granted) {
      setStatusMessage(
        "SMS permission was denied. Allow READ_SMS to load real OTP messages.",
      );
      return;
    }

    setStatusMessage("SMS permission granted. Loading inbox...");
    await loadInbox();
  };

  const trainWord = async (wordIndex: number) => {
    if (!selectedMessage) return;

    setHighlightedWordIndex(wordIndex);

    const nextRules: SenderRules = {
      ...rules,
      [selectedMessage.sender]: wordIndex,
    };

    setRules(nextRules);
    await saveRulesToStorage(nextRules);

    setTimeout(() => {
      setSelectedMessage(null);
      setHighlightedWordIndex(null);
    }, 120);
  };

  const ruleEntries = Object.entries(rules);

  const deleteMessage = (item: ParsedMessage) => {
    if (!item.token) return;

    if (item.sourceKind === "live") {
      setLiveMessages((prev) => prev.filter((message) => message.id !== item.id));
      return;
    }

    setDemoMessages((prev) => prev.filter((message) => message.id !== item.id));
  };

  const renderMessageCard = (item: ParsedMessage) => (
    <View key={`${item.sourceKind}-${item.id}`} style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.messageBadge}>
          {item.sourceKind === "live" ? "device" : "demo"}
        </Text>
      </View>
      <Text style={styles.body}>{item.text}</Text>
      <Text style={styles.token}>Parsed OTP: {item.token ?? "Not found"}</Text>
      <Text style={styles.source}>Engine source: {item.source}</Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          setSelectedMessage(item);
          setHighlightedWordIndex(null);
        }}
      >
        <Text style={styles.buttonText}>Train Engine</Text>
      </Pressable>

      {item.token ? (
        <Pressable
          style={styles.deleteButton}
          onPress={() => {
            deleteMessage(item);
          }}
        >
          <Text style={styles.deleteButtonText}>Delete OTP Message</Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHalf}>
        <Text style={styles.header}>Offline OTP Shield</Text>
        <Text style={styles.subHeader}>Live Inbox</Text>
        <View style={styles.actionRow}>
          <Pressable
            style={styles.button}
            onPress={() => void enableSmsAccess()}
          >
            <Text style={styles.buttonText}>Enable SMS Access</Text>
          </Pressable>
          <Pressable
            style={[styles.button, !hasSmsModule() && styles.buttonDisabled]}
            onPress={() => void loadInbox()}
          >
            <Text style={styles.buttonText}>
              {isLoadingInbox ? "Loading..." : "Refresh Inbox"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.altButton}
            onPress={() => setShowDemoSection((value) => !value)}
          >
            <Text style={styles.altButtonText}>
              {showDemoSection ? "Hide Demo" : "Show Demo"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.statusText}>
          Permission: {permissionState} | {statusMessage}
        </Text>

        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, listMode === "all" && styles.filterChipActive]}
            onPress={() => setListMode("all")}
          >
            <Text style={[styles.filterChipText, listMode === "all" && styles.filterChipTextActive]}>
              All ({visibleRows.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, listMode === "otp" && styles.filterChipActive]}
            onPress={() => setListMode("otp")}
          >
            <Text style={[styles.filterChipText, listMode === "otp" && styles.filterChipTextActive]}>
              OTP Parsed ({otpRows.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, listMode === "nonOtp" && styles.filterChipActive]}
            onPress={() => setListMode("nonOtp")}
          >
            <Text
              style={[
                styles.filterChipText,
                listMode === "nonOtp" && styles.filterChipTextActive,
              ]}
            >
              Not Parsed ({nonOtpRows.length})
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredRows.length === 0 ? (
            <Text style={styles.emptyText}>
              {listMode === "all"
                ? "No messages available for this view."
                : listMode === "otp"
                  ? "No parsed OTP messages in this view."
                  : "No non-OTP messages in this view."}
            </Text>
          ) : (
            filteredRows.map(renderMessageCard)
          )}
        </ScrollView>
      </View>

      <View style={styles.bottomHalf}>
        <Text style={styles.subHeader}>Active Rules</Text>
        <ScrollView contentContainerStyle={styles.rulesList}>
          {ruleEntries.length === 0 ? (
            <Text style={styles.emptyText}>No custom rules yet.</Text>
          ) : (
            ruleEntries.map(([sender, index]) => (
              <View key={sender} style={styles.ruleRow}>
                <Text style={styles.ruleText}>{sender}</Text>
                <Text style={styles.ruleText}>word #{index + 1}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        visible={!!selectedMessage}
        transparent
        animationType="none"
        onRequestClose={() => setSelectedMessage(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Tap the OTP word</Text>
            <View style={styles.wordsWrap}>
              {(selectedMessage?.text.split(/\s+/) ?? []).map((word, index) => (
                <Pressable
                  key={`${word}-${index}`}
                  style={[
                    styles.wordChip,
                    highlightedWordIndex === index && styles.wordChipActive,
                  ]}
                  onPress={() => {
                    void trainWord(index);
                  }}
                >
                  <Text style={styles.wordText}>{word}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedMessage(null)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    gap: 10,
  },
  topHalf: {
    flex: 1,
  },
  bottomHalf: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterChipActive: {
    borderColor: "#111",
    backgroundColor: "#111",
  },
  filterChipText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  statusText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  listContent: {
    gap: 8,
    paddingBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sender: {
    fontWeight: "700",
  },
  messageBadge: {
    fontSize: 11,
    color: "#555",
    textTransform: "uppercase",
  },
  body: {
    color: "#333",
  },
  token: {
    fontWeight: "600",
  },
  source: {
    color: "#666",
    fontSize: 12,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  deleteButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#cf2d2d",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#cf2d2d",
    fontWeight: "600",
  },
  altButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  altButtonText: {
    color: "#111",
    fontWeight: "600",
  },
  rulesList: {
    gap: 8,
    paddingBottom: 8,
  },
  ruleRow: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ruleText: {
    fontSize: 14,
  },
  emptyText: {
    color: "#666",
  },
  demoHeader: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  wordsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wordChip: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  wordChipActive: {
    backgroundColor: "#ffe38f",
    borderColor: "#d3ab2a",
  },
  wordText: {
    fontSize: 13,
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  closeText: {
    fontWeight: "600",
  },
});
