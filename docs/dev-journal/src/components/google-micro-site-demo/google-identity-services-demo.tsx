import React, { useMemo, useState } from "react";

import {
  DemoAccount,
  addNextAccount,
  buildJwtPayload,
  sampleProfiles,
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
        <span className={`${styles.tag} ${styles.success}`}>JWT ID token</span>
        <span className={styles.tag}>{account.locale}</span>
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

export default function GoogleIdentityServicesDemo() {
  const [clientId, setClientId] = usePersistentState(
    "google-demo-gis-client-v2",
    "",
  );
  const [accounts, setAccounts] = usePersistentState<DemoAccount[]>(
    "google-demo-gis-accounts-v2",
    [],
  );
  const [initialized, setInitialized] = useState(false);
  const [oneTapStatus, setOneTapStatus] = useState(
    "Waiting for client initialization.",
  );
  const [selectedAccountId, setSelectedAccountId] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const payload = useMemo(() => {
    if (!selectedAccount) {
      return "Sign in to inspect the decoded JWT payload.";
    }

    const profile =
      sampleProfiles.find((entry) => entry.email === selectedAccount.email) ??
      sampleProfiles[0];
    return JSON.stringify(buildJwtPayload(profile), null, 2);
  }, [selectedAccount]);

  function initialize() {
    setInitialized(true);
    setOneTapStatus(
      "GIS initialized. Sign-In button rendered. One Tap prompt is now eligible.",
    );
  }

  function signIn() {
    const next = addNextAccount(accounts, ["openid", "email", "profile"]);
    setAccounts(next);
    setSelectedAccountId(next[next.length - 1]?.id ?? "");
    setOneTapStatus(
      `Signed in ${next[next.length - 1]?.email ?? "demo user"}.`,
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Interactive GIS Demo</span>
        <h2>Client ID setup, One Tap state, and JWT inspection</h2>
        <p>
          This follows the original GIS page structure more closely: setup,
          initialize, sign in, then inspect connected accounts and decoded
          identity payloads.
        </p>
      </div>
      <div className={styles.layout}>
        <section className={styles.pane}>
          <div className={styles.callout}>
            This tool is for authentication only. It uses ID tokens and does not
            request Gmail, Drive, or Photos access scopes.
          </div>
          <div className={styles.section}>
            <label className={styles.label}>Google OAuth Client ID</label>
            <input
              className={styles.input}
              onChange={(event) => setClientId(event.target.value)}
              placeholder="xxxxxxxx.apps.googleusercontent.com"
              value={clientId}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.toolbar}>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={initialize}
                type="button"
              >
                Save and initialize
              </button>
              <button className={styles.button} onClick={signIn} type="button">
                Simulate sign-in
              </button>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.summaryGrid}>
              <div className={styles.statusCard}>
                <strong>GIS state</strong>
                <span
                  className={`${styles.statusPill} ${initialized ? styles.success : styles.warning}`}
                >
                  {initialized ? "Initialized" : "Not initialized"}
                </span>
              </div>
              <div className={styles.statusCard}>
                <strong>Accounts</strong>
                <div className={styles.muted}>{accounts.length}</div>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>One Tap and button state</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{oneTapStatus}</pre>
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
              onChange={(event) => setSelectedAccountId(event.target.value)}
              value={selectedAccountId || selectedAccount?.id || ""}
            >
              {accounts.length === 0 ? (
                <option value="">No account</option>
              ) : (
                accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className={styles.section}>
            <div className={styles.resultTitle}>Decoded JWT payload</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{payload}</pre>
            </div>
          </div>
          {selectedAccount ? (
            <div className={styles.section}>
              <div className={styles.resultTitle}>Token preview</div>
              <div className={styles.panel}>
                <pre className={styles.code}>{selectedAccount.token}</pre>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
