import React, { useMemo, useState } from "react";

import {
  DemoAccount,
  addNextAccount,
  buildOauthUrl,
  formatBytes,
  usePersistentState,
} from "./shared";
import styles from "./styles.module.css";

const fullScopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/photoslibrary.readonly",
];

const legacyScopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

function AccountCard({
  account,
  onRemove,
}: {
  account: DemoAccount;
  onRemove: () => void;
}) {
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
        {account.scopes.slice(0, 3).map((scope) => (
          <span className={styles.tag} key={scope}>
            {scope.split("/").pop()}
          </span>
        ))}
      </div>
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

export default function GoogleOAuthManagerDemo({
  legacy = false,
}: {
  legacy?: boolean;
}) {
  const storageKey = legacy ? "legacy" : "main";
  const scopes = legacy ? legacyScopes : fullScopes;
  const [clientId, setClientId] = usePersistentState(
    `google-demo-manager-client-${storageKey}-v2`,
    "",
  );
  const [redirectUri, setRedirectUri] = usePersistentState(
    `google-demo-manager-redirect-${storageKey}-v2`,
    "http://localhost:3001/google/google-multi-account-manager",
  );
  const [accounts, setAccounts] = usePersistentState<DemoAccount[]>(
    `google-demo-manager-accounts-${storageKey}-v2`,
    [],
  );
  const [selectedId, setSelectedId] = useState("");
  const [resultTitle, setResultTitle] = useState("Service output");
  const [resultBody, setResultBody] = useState(
    "Choose an account, then run Gmail, Drive, or Photos actions like the original manager demo.",
  );

  const oauthUrl = useMemo(
    () =>
      buildOauthUrl(
        clientId,
        redirectUri,
        scopes,
        "token",
        legacy ? "consent" : "select_account",
      ),
    [clientId, redirectUri, scopes, legacy],
  );
  const selectedAccount =
    accounts.find((account) => account.id === selectedId) ?? accounts[0];

  function addAccount() {
    const next = addNextAccount(accounts, scopes);
    setAccounts(next);
    setSelectedId(next[next.length - 1]?.id ?? "");
  }

  function runAction(action: string) {
    const outputs: Record<string, { title: string; body: string }> = {
      labels: {
        title: "Gmail labels",
        body: JSON.stringify(
          { labels: ["INBOX", "STARRED", "SENT", "Archive", "Travel"] },
          null,
          2,
        ),
      },
      drafts: {
        title: "Gmail drafts",
        body: JSON.stringify(
          { drafts: [{ id: "draft-01" }, { id: "draft-02" }] },
          null,
          2,
        ),
      },
      profile: {
        title: "Gmail profile",
        body: JSON.stringify(
          {
            emailAddress: selectedAccount?.email,
            messagesTotal: 482,
            threadsTotal: 167,
          },
          null,
          2,
        ),
      },
      storage: {
        title: "Drive storage quota",
        body: JSON.stringify(
          {
            usage: formatBytes(29_118_334_982),
            usageInDrive: formatBytes(12_114_334_982),
            usageInDriveTrash: formatBytes(2_340_000),
            limit: formatBytes(214_748_364_800),
          },
          null,
          2,
        ),
      },
      albums: {
        title: "Google Photos albums",
        body: JSON.stringify(
          {
            albums: [
              { title: "Launch Week", mediaItemsCount: 48 },
              { title: "Receipts", mediaItemsCount: 12 },
              { title: "Travel 2026", mediaItemsCount: 134 },
            ],
          },
          null,
          2,
        ),
      },
      recent: {
        title: "Recent photos",
        body: JSON.stringify(
          {
            mediaItems: [
              { filename: "IMG_2011.JPG" },
              { filename: "IMG_2012.JPG" },
              { filename: "IMG_2013.MOV" },
            ],
          },
          null,
          2,
        ),
      },
      fullFetch: {
        title: "Full library fetch",
        body: JSON.stringify(
          {
            pagesFetched: 4,
            itemsLoaded: 327,
            note: "Testing mode only. Prefer Picker API or app-created content for new apps.",
          },
          null,
          2,
        ),
      },
    };

    const output = outputs[action];
    setResultTitle(output.title);
    setResultBody(output.body);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>
          {legacy ? "Legacy Variant" : "Interactive OAuth Manager"}
        </span>
        <h2>
          {legacy
            ? "Older Gmail/profile-focused manager"
            : "Gmail, Drive, and Photos from one browser-side dashboard"}
        </h2>
        <p>
          {legacy
            ? "This variant keeps the smaller scope set that appeared in the duplicate HTML copy."
            : "This version matches the original manager more closely: multiple accounts, service buttons, scope bundles, and operational notes for the Photos API."}
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
              <div className={styles.muted}>{scopes.length}</div>
            </div>
          </div>
          {!legacy ? (
            <div className={styles.section}>
              <div className={styles.callout}>
                Google Photos is the unstable edge of this tool. The original
                demo had to account for post-2025 Photos API restrictions,
                testing-mode behavior, and the need to prefer Picker or
                app-created flows for new products.
              </div>
            </div>
          ) : null}
          <div className={styles.twoUp}>
            <div className={styles.section}>
              <label className={styles.label}>Client ID</label>
              <input
                className={styles.input}
                onChange={(event) => setClientId(event.target.value)}
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
          </div>
          <div className={styles.section}>
            <div className={styles.toolbar}>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={addAccount}
                type="button"
              >
                Add account
              </button>
              <span className={styles.statusPill}>
                {legacy ? "Reduced scope set" : "Full scope set"}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>OAuth URL preview</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{oauthUrl}</pre>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>Scope bundle</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{scopes.join("\n")}</pre>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.accountGrid}>
              {accounts.length === 0 ? (
                <div className={styles.card}>No accounts connected yet.</div>
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
            <label className={styles.label}>Selected account</label>
            <select
              className={styles.select}
              onChange={(event) => setSelectedId(event.target.value)}
              value={selectedId || selectedAccount?.id || ""}
            >
              {accounts.length === 0 ? (
                <option value="">No account</option>
              ) : (
                accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.email}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className={styles.section}>
            <div className={styles.actions}>
              <button
                className={styles.button}
                onClick={() => runAction("labels")}
                type="button"
              >
                Gmail labels
              </button>
              <button
                className={styles.button}
                onClick={() => runAction("drafts")}
                type="button"
              >
                Gmail drafts
              </button>
              <button
                className={styles.button}
                onClick={() => runAction("profile")}
                type="button"
              >
                Gmail profile
              </button>
              {!legacy ? (
                <button
                  className={styles.button}
                  onClick={() => runAction("storage")}
                  type="button"
                >
                  Drive quota
                </button>
              ) : null}
              {!legacy ? (
                <button
                  className={styles.button}
                  onClick={() => runAction("albums")}
                  type="button"
                >
                  Photo albums
                </button>
              ) : null}
              {!legacy ? (
                <button
                  className={styles.button}
                  onClick={() => runAction("recent")}
                  type="button"
                >
                  Recent photos
                </button>
              ) : null}
              {!legacy ? (
                <button
                  className={styles.button}
                  onClick={() => runAction("fullFetch")}
                  type="button"
                >
                  Full fetch
                </button>
              ) : null}
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>{resultTitle}</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{resultBody}</pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
