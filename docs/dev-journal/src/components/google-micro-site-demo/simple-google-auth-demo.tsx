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

export default function SimpleGoogleAuthDemo({
  legacy = false,
}: {
  legacy?: boolean;
}) {
  const storageKey = legacy ? "legacy" : "main";
  const [clientId, setClientId] = usePersistentState(
    `google-demo-simple-client-${storageKey}-v2`,
    "",
  );
  const [accounts, setAccounts] = usePersistentState<DemoAccount[]>(
    `google-demo-simple-accounts-${storageKey}-v2`,
    [],
  );
  const [initialized, setInitialized] = useState(false);
  const [selected, setSelected] = useState("");

  const account =
    accounts.find((entry) => entry.id === selected) ?? accounts[0];
  const payload = useMemo(() => {
    if (!account) {
      return "Add an account to inspect the JWT payload.";
    }

    const profile =
      sampleProfiles.find((entry) => entry.email === account.email) ??
      sampleProfiles[0];
    return JSON.stringify(buildJwtPayload(profile), null, 2);
  }, [account]);

  function saveAndInit() {
    setInitialized(true);
  }

  function signIn() {
    const next = addNextAccount(accounts, ["openid", "email", "profile"]);
    setAccounts(next);
    setSelected(next[next.length - 1]?.id ?? "");
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>
          {legacy ? "Legacy Reconstruction" : "Interactive Sign-In Demo"}
        </span>
        <h2>
          {legacy
            ? "Lightweight sign-in flow for the empty legacy file"
            : "Minimal Google sign-in with local account storage"}
        </h2>
        <p>
          {legacy
            ? "The original google-sign-in file was empty, so this reconstruction focuses on the clear intended behavior: client ID setup, simple sign-in, and account list rendering."
            : "This keeps the micro-site intentionally small: save client ID, initialize GIS, sign in, and inspect the local account list without broader API scopes."}
        </p>
      </div>
      <div className={styles.layout}>
        <section className={styles.pane}>
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
            <div className={styles.toolbar}>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={saveAndInit}
                type="button"
              >
                Save and init
              </button>
              <button className={styles.button} onClick={signIn} type="button">
                Simulate sign-in
              </button>
              <span
                className={`${styles.statusPill} ${initialized ? styles.success : styles.warning}`}
              >
                {initialized ? "GIS initialized" : "GIS idle"}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.callout}>
              This path is identity-only. It keeps the smallest possible
              browser-side shape and avoids Gmail, Drive, and Photos scopes.
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.accountGrid}>
              {accounts.length === 0 ? (
                <div className={styles.card}>No accounts connected.</div>
              ) : (
                accounts.map((entry) => (
                  <AccountCard
                    account={entry}
                    key={entry.id}
                    onRemove={() =>
                      setAccounts(
                        accounts.filter(
                          (accountEntry) => accountEntry.id !== entry.id,
                        ),
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
              onChange={(event) => setSelected(event.target.value)}
              value={selected || account?.id || ""}
            >
              {accounts.length === 0 ? (
                <option value="">No account</option>
              ) : (
                accounts.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
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
          {account ? (
            <div className={styles.section}>
              <div className={styles.resultTitle}>Token preview</div>
              <div className={styles.panel}>
                <pre className={styles.code}>{account.token}</pre>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
