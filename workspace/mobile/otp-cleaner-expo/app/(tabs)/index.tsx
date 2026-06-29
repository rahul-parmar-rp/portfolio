import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { parseOtpFromText, type SenderRules } from "@/src/utils/engine";
import {
  deleteInboxMessage,
  hasSmsDeletePermission,
  hasSmsModule,
  hasSmsPermission,
  listInboxMessages,
  requestSmsDeletePermission,
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

const DEFAULT_RULES = [
  "Custom sender rule has highest priority.",
  "Regex rule: otp|code near a 4-8 digit number.",
];

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
    sender: "SWIGGY",
    text: "Hungry? Flat 60% OFF up to 120. Use code YUMMY60 today.",
    sourceKind: "demo",
  },
  {
    id: "4",
    sender: "PAYTM",
    text: "Cashback Alert! Recharge now and get up to 100 cashback.",
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
    // Keep training usable even if storage fails in a limited runtime.
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("unknown");
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    hasSmsModule()
      ? "Offline mode: all parsing and rules run locally on this device."
      : "This build does not include the native SMS module. Use an Android development build.",
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
    return showDemoSection
      ? [...parsedLiveRows, ...parsedDemoRows]
      : parsedLiveRows;
  }, [showDemoSection, parsedLiveRows, parsedDemoRows]);

  const otpRows = useMemo(
    () => visibleRows.filter((message) => Boolean(message.token)),
    [visibleRows],
  );
  const nonOtpRows = useMemo(
    () => visibleRows.filter((message) => !message.token),
    [visibleRows],
  );

  const filteredRows = useMemo(() => {
    if (listMode === "otp") return otpRows;
    if (listMode === "nonOtp") return nonOtpRows;
    return visibleRows;
  }, [listMode, nonOtpRows, otpRows, visibleRows]);

  const activeCustomRules = useMemo(() => Object.entries(rules), [rules]);

  async function loadInbox() {
    if (!hasSmsModule()) {
      setStatusMessage(
        "Native SMS module is missing in this build. Install Android dev build, not Expo Go.",
      );
      return;
    }

    setIsLoadingInbox(true);
    setStatusMessage("Loading inbox from device storage...");

    try {
      const messages = await listInboxMessages(80);
      const nextMessages: Message[] = messages.map((message) => ({
        id: message.id,
        sender: message.sender,
        text: message.body,
        date: message.date,
        sourceKind: "live",
      }));

      setLiveMessages(nextMessages);
      setSelectedIds([]);
      setStatusMessage(
        nextMessages.length > 0
          ? `Loaded ${nextMessages.length} messages from local inbox.`
          : "Inbox is readable, but no messages were found.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to read local inbox.";
      setStatusMessage(message);
    } finally {
      setIsLoadingInbox(false);
    }
  }

  const enableSmsAccess = async () => {
    if (!hasSmsModule()) {
      setPermissionState("denied");
      setStatusMessage("Build without native SMS module cannot access inbox.");
      return;
    }

    const granted = await requestSmsPermission();
    setPermissionState(granted ? "granted" : "denied");

    if (!granted) {
      setStatusMessage("READ_SMS denied. Allow it to read inbox offline.");
      return;
    }

    setStatusMessage("READ_SMS granted. Reloading inbox...");
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

  const toggleSelection = (messageId: string) => {
    setSelectedIds((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId],
    );
  };

  const selectAllParsed = () => {
    const parsedIds = filteredRows
      .filter((message) => message.token)
      .map((message) => message.id);
    setSelectedIds(parsedIds);
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const deleteMessages = async (idsToDelete: string[]) => {
    const targets = visibleRows.filter(
      (message) => idsToDelete.includes(message.id) && message.token,
    );

    if (targets.length === 0) {
      setStatusMessage("No parsed OTP messages selected for delete.");
      return;
    }

    const liveTargets = targets.filter(
      (message) => message.sourceKind === "live",
    );
    const demoTargets = targets.filter(
      (message) => message.sourceKind === "demo",
    );

    if (demoTargets.length > 0) {
      const demoIds = new Set(demoTargets.map((message) => message.id));
      setDemoMessages((prev) =>
        prev.filter((message) => !demoIds.has(message.id)),
      );
    }

    if (liveTargets.length > 0) {
      let canDelete = await hasSmsDeletePermission();
      if (!canDelete) {
        canDelete = await requestSmsDeletePermission();
      }

      if (!canDelete) {
        setStatusMessage(
          "WRITE_SMS denied. Could not delete inbox messages. App will reload inbox.",
        );
        await loadInbox();
        clearSelection();
        return;
      }

      let deleted = 0;
      let failed = 0;

      for (const message of liveTargets) {
        try {
          await deleteInboxMessage(message.id);
          deleted += 1;
        } catch {
          failed += 1;
        }
      }

      await loadInbox();

      if (failed > 0) {
        setStatusMessage(
          `Deleted ${deleted} message(s). ${failed} failed. Some devices require this app as default SMS app for delete.`,
        );
      } else {
        setStatusMessage(`Deleted ${deleted} OTP message(s) from inbox.`);
      }
    }

    clearSelection();
  };

  const askDeleteConfirmation = (idsToDelete: string[]) => {
    const count = idsToDelete.length;
    Alert.alert(
      "Confirm delete",
      `Delete ${count} selected OTP message(s)? This attempts real inbox delete for live messages.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteMessages(idsToDelete);
          },
        },
      ],
    );
  };

  const renderMessageCard = (item: ParsedMessage) => {
    const isSelected = selectedIds.includes(item.id);
    const canTrain = item.source !== "custom";

    return (
      <View key={`${item.sourceKind}-${item.id}`} style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sender}>{item.sender}</Text>
          <View style={styles.inlineRow}>
            <Text style={styles.messageBadge}>
              {item.sourceKind === "live" ? "device" : "demo"}
            </Text>
            <Text
              style={[
                styles.parseBadge,
                item.source === "custom"
                  ? styles.customBadge
                  : styles.regexBadge,
              ]}
            >
              {item.source}
            </Text>
          </View>
        </View>

        <Text style={styles.body}>{item.text}</Text>

        <View style={styles.tokenRow}>
          <Text style={styles.tokenLabel}>Parsed token</Text>
          <Text
            style={[
              styles.tokenValue,
              item.token ? styles.tokenFound : styles.tokenMissing,
            ]}
          >
            {item.token ?? "Not found"}
          </Text>
        </View>

        <View style={styles.cardActionRow}>
          {canTrain ? (
            <Pressable
              style={styles.button}
              onPress={() => {
                setSelectedMessage(item);
                setHighlightedWordIndex(null);
              }}
            >
              <Text style={styles.buttonText}>Train Engine</Text>
            </Pressable>
          ) : (
            <Text style={styles.helperText}>Custom rule already applied</Text>
          )}

          {selectionMode && item.token ? (
            <Pressable
              style={[styles.selectChip, isSelected && styles.selectChipActive]}
              onPress={() => toggleSelection(item.id)}
            >
              <Text
                style={[
                  styles.selectChipText,
                  isSelected && styles.selectChipTextActive,
                ]}
              >
                {isSelected ? "Selected" : "Select"}
              </Text>
            </Pressable>
          ) : null}

          {item.token && !selectionMode ? (
            <Pressable
              style={styles.iconButton}
              onPress={() => askDeleteConfirmation([item.id])}
            >
              <Ionicons name="trash-outline" size={18} color="#cf2d2d" />
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <Text style={styles.header}>Offline OTP Shield</Text>
        <Text style={styles.subHeader}>
          Fully offline parsing and local rules
        </Text>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.button}
            onPress={() => void enableSmsAccess()}
          >
            <Text style={styles.buttonText}>Enable SMS Access</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => void loadInbox()}>
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
            style={[
              styles.filterChip,
              listMode === "all" && styles.filterChipActive,
            ]}
            onPress={() => setListMode("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                listMode === "all" && styles.filterChipTextActive,
              ]}
            >
              All ({visibleRows.length})
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterChip,
              listMode === "otp" && styles.filterChipActive,
            ]}
            onPress={() => setListMode("otp")}
          >
            <Text
              style={[
                styles.filterChipText,
                listMode === "otp" && styles.filterChipTextActive,
              ]}
            >
              OTP Parsed ({otpRows.length})
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterChip,
              listMode === "nonOtp" && styles.filterChipActive,
            ]}
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

        <View style={styles.bulkRow}>
          <Pressable
            style={styles.altButton}
            onPress={() => {
              if (selectionMode) {
                clearSelection();
              } else {
                setSelectionMode(true);
              }
            }}
          >
            <Text style={styles.altButtonText}>
              {selectionMode ? "Exit Select" : "Select Messages"}
            </Text>
          </Pressable>

          {selectionMode ? (
            <>
              <Pressable style={styles.altButton} onPress={selectAllParsed}>
                <Text style={styles.altButtonText}>Select All Parsed</Text>
              </Pressable>
              <Pressable
                style={styles.deleteBulkButton}
                onPress={() => askDeleteConfirmation(selectedIds)}
              >
                <Text style={styles.deleteBulkButtonText}>
                  Delete Selected ({selectedIds.length})
                </Text>
              </Pressable>
            </>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Messages</Text>
        {filteredRows.length === 0 ? (
          <Text style={styles.emptyText}>
            {listMode === "all"
              ? "No messages available in this view."
              : listMode === "otp"
                ? "No parsed OTP messages in this view."
                : "No non-OTP messages in this view."}
          </Text>
        ) : (
          filteredRows.map(renderMessageCard)
        )}

        <Text style={styles.sectionTitle}>Active Rules</Text>
        <Text style={styles.ruleGroupLabel}>Default Regex Rules</Text>
        {DEFAULT_RULES.map((rule) => (
          <View key={rule} style={styles.ruleRow}>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}

        <Text style={styles.ruleGroupLabel}>Custom Sender Rules</Text>
        {activeCustomRules.length === 0 ? (
          <Text style={styles.emptyText}>No custom sender rules yet.</Text>
        ) : (
          activeCustomRules.map(([sender, index]) => (
            <View key={sender} style={styles.ruleRow}>
              <Text style={styles.ruleText}>{sender}</Text>
              <Text style={styles.ruleText}>word #{index + 1}</Text>
            </View>
          ))
        )}
      </ScrollView>

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
  },
  pageContent: {
    padding: 12,
    gap: 8,
    paddingBottom: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  bulkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 2,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  altButton: {
    borderWidth: 1,
    borderColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },
  altButtonText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 12,
  },
  deleteBulkButton: {
    borderWidth: 1,
    borderColor: "#cf2d2d",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },
  deleteBulkButtonText: {
    color: "#cf2d2d",
    fontWeight: "600",
    fontSize: 12,
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
  card: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginTop: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  sender: {
    fontWeight: "700",
    fontSize: 14,
  },
  messageBadge: {
    fontSize: 10,
    color: "#555",
    textTransform: "uppercase",
  },
  parseBadge: {
    fontSize: 10,
    color: "#fff",
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 3,
    textTransform: "uppercase",
  },
  customBadge: {
    backgroundColor: "#246b45",
  },
  regexBadge: {
    backgroundColor: "#2d4db5",
  },
  body: {
    color: "#333",
    fontSize: 13,
  },
  tokenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  tokenLabel: {
    fontSize: 12,
    color: "#555",
  },
  tokenValue: {
    fontWeight: "700",
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tokenFound: {
    color: "#0f5132",
    backgroundColor: "#d1e7dd",
  },
  tokenMissing: {
    color: "#664d03",
    backgroundColor: "#fff3cd",
  },
  cardActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#555",
  },
  selectChip: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectChipActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  selectChipText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
  selectChipTextActive: {
    color: "#fff",
  },
  iconButton: {
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: "#f1b5b5",
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleGroupLabel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  ruleRow: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  ruleText: {
    fontSize: 13,
    color: "#333",
  },
  emptyText: {
    color: "#666",
    marginTop: 2,
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
