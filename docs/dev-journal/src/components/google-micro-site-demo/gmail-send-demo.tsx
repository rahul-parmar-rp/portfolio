import React, { useMemo, useState } from "react";

import {
  DemoAccount,
  addNextAccount,
  buildOauthUrl,
  buildRfc2822,
  encodeBase64Url,
  formatDate,
  usePersistentState,
} from "./shared";
import styles from "./styles.module.css";

function AccountCard({
  account,
  onRemove,
}: {
  account: DemoAccount;
  onRemove: () => void;
}) {
  const expired = Date.now() >= account.expiresAt;

  return (
    <div className={styles.accountCard}>
      <div className={styles.accountHeader}>
        <div className={styles.avatar}>{account.name.charAt(0)}</div>
        <div>
          <strong>{account.name}</strong>
          <div className={styles.muted}>{account.email}</div>
        </div>
      </div>
      <div className={styles.tagRow}>
        <span
          className={`${styles.tag} ${expired ? styles.warning : styles.success}`}
        >
          {expired ? "Expired" : "Active"}
        </span>
      </div>
      <p className={styles.muted}>Added {formatDate(account.addedAt)}</p>
      <button
        className={`${styles.button} ${styles.danger}`}
        onClick={onRemove}
        type="button"
      >
        Remove account
      </button>
    </div>
  );
}

export default function GmailSendDemo() {
  const [clientId, setClientId] = usePersistentState(
    "google-demo-gmail-client-v2",
    "",
  );
  const [redirectUri, setRedirectUri] = usePersistentState(
    "google-demo-gmail-redirect-v2",
    "http://localhost:3001/google/gmail-send-multi-account",
  );
  const [accounts, setAccounts] = usePersistentState<DemoAccount[]>(
    "google-demo-gmail-accounts-v2",
    [],
  );
  const [configSaved, setConfigSaved] = useState(false);
  const [fromAccount, setFromAccount] = useState("");
  const [toEmail, setToEmail] = useState("recipient@example.com");
  const [subject, setSubject] = useState("Launch update");
  const [message, setMessage] = useState(
    "The docs migration is live and the interactive demo is wired in.",
  );
  const [sendState, setSendState] = useState<
    "idle" | "ready" | "sent" | "error"
  >("idle");
  const [sendLog, setSendLog] = useState<string[]>([
    "Save config to preview the OAuth URL.",
    "Add an account to populate the sender dropdown.",
  ]);

  const scopes = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];
  const oauthUrl = useMemo(
    () =>
      buildOauthUrl(clientId, redirectUri, scopes, "token", "select_account"),
    [clientId, redirectUri],
  );
  const rawEmail = useMemo(
    () => buildRfc2822(toEmail, subject, message),
    [message, subject, toEmail],
  );
  const encodedEmail = useMemo(() => encodeBase64Url(rawEmail), [rawEmail]);

  function saveConfig() {
    setConfigSaved(true);
    setSendState("ready");
    setSendLog([
      "Configuration saved.",
      `Client ID: ${clientId || "your-client-id.apps.googleusercontent.com"}`,
      `Redirect URI: ${redirectUri}`,
    ]);
  }

  function addAccount() {
    const next = addNextAccount(accounts, scopes);
    setAccounts(next);
    setFromAccount(next[next.length - 1]?.id ?? fromAccount);
    setSendLog((current) => [
      `Added ${next[next.length - 1]?.email ?? "demo account"}.`,
      ...current,
    ]);
  }

  function sendEmail() {
    const account = accounts.find((entry) => entry.id === fromAccount);

    if (!account) {
      setSendState("error");
      setSendLog(["Send blocked: select a sender account first.", ...sendLog]);
      return;
    }

    setSendState("sent");
    setSendLog([
      `POST /gmail/v1/users/me/messages/send as ${account.email}`,
      `To: ${toEmail}`,
      `Subject: ${subject}`,
      "Result: 200 OK (simulated)",
    ]);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Interactive Gmail Demo</span>
        <h2>Compose, encode, and simulate send</h2>
        <p>
          This version is shaped like the original micro-site: setup first,
          accounts second, then the actual email compose and send flow.
        </p>
      </div>
      <div className={styles.layout}>
        <section className={styles.pane}>
          <div className={styles.summaryGrid}>
            <div className={styles.statCard}>
              <strong>Accounts</strong>
              <div className={styles.muted}>{accounts.length}</div>
            </div>
            <div className={styles.statCard}>
              <strong>Scopes</strong>
              <div className={styles.muted}>{scopes.length} required</div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.callout}>
              Add your JavaScript origin in Google Cloud Console, keep the demo
              in testing mode, and request only the three send/profile scopes
              shown here.
            </div>
          </div>
          <div className={styles.section}>
            <label className={styles.label}>Client ID</label>
            <input
              className={styles.input}
              onChange={(event) => setClientId(event.target.value)}
              placeholder="your-client-id.apps.googleusercontent.com"
              value={clientId}
            />
          </div>
          <div className={styles.section}>
            <label className={styles.label}>Redirect URI</label>
            <input
              className={styles.input}
              onChange={(event) => setRedirectUri(event.target.value)}
              value={redirectUri}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.toolbar}>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={saveConfig}
                type="button"
              >
                Save config
              </button>
              <button
                className={styles.button}
                onClick={addAccount}
                type="button"
              >
                Add account
              </button>
              <span
                className={`${styles.statusPill} ${configSaved ? styles.success : styles.warning}`}
              >
                {configSaved ? "Config saved" : "Config pending"}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>OAuth authorize URL</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{oauthUrl}</pre>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.accountGrid}>
              {accounts.length === 0 ? (
                <div className={styles.card}>No authorized accounts yet.</div>
              ) : (
                accounts.map((account) => (
                  <AccountCard
                    account={account}
                    key={account.id}
                    onRemove={() =>
                      setAccounts(
                        accounts.filter((entry) => entry.id !== account.id),
                      )
                    }
                  />
                ))
              )}
            </div>
          </div>
        </section>
        <section className={styles.pane}>
          <div className={styles.section}>
            <label className={styles.label}>From account</label>
            <select
              className={styles.select}
              onChange={(event) => setFromAccount(event.target.value)}
              value={fromAccount}
            >
              <option value="">Select sender</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.email})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.twoUp}>
            <div className={styles.section}>
              <label className={styles.label}>To</label>
              <input
                className={styles.input}
                onChange={(event) => setToEmail(event.target.value)}
                value={toEmail}
              />
            </div>
            <div className={styles.section}>
              <label className={styles.label}>Subject</label>
              <input
                className={styles.input}
                onChange={(event) => setSubject(event.target.value)}
                value={subject}
              />
            </div>
          </div>
          <div className={styles.section}>
            <label className={styles.label}>Message</label>
            <textarea
              className={styles.textarea}
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
          </div>
          <div className={styles.section}>
            <button
              className={`${styles.button} ${styles.primary}`}
              onClick={sendEmail}
              type="button"
            >
              Send email
            </button>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>RFC 2822 preview</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{rawEmail}</pre>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>Encoded payload</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{encodedEmail}</pre>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>Send log</div>
            <div className={styles.panel}>
              <ul className={styles.list}>
                {sendLog.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className={styles.muted}>Current state: {sendState}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
