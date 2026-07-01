import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { DemoAccount, decodeJwtPayload, usePersistentState } from "./shared";
import styles from "./styles.module.css";

/** Load the GIS script once and call back when ready. */
function useGisScript(onLoad: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.accounts?.id) {
      onLoad();
      return;
    }
    const existing = document.getElementById("gsi-script");
    if (existing) {
      existing.addEventListener("load", onLoad);
      return () => existing.removeEventListener("load", onLoad);
    }
    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = onLoad;
    document.head.appendChild(script);
  }, [onLoad]);
}

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
        <span className={`${styles.tag} ${styles.success}`}>real JWT</span>
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
  const [gisReady, setGisReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [statusMsg, setStatusMsg] = useState("GIS script not yet loaded.");
  const [selected, setSelected] = useState("");
  const buttonRef = useRef<HTMLDivElement>(null);

  const account =
    accounts.find((entry) => entry.id === selected) ?? accounts[0];

  /** Called when GIS script tag fires onload */
  const handleScriptLoad = useCallback(() => {
    setGisReady(true);
    setStatusMsg("GIS script loaded. Enter your Client ID and click Init.");
  }, []);

  useGisScript(handleScriptLoad);

  /** Decode the real JWT credential returned by GIS and store the account. */
  const handleCredentialResponse = useCallback(
    (response: google.accounts.id.CredentialResponse): void => {
      const raw = response.credential;
      const claims = decodeJwtPayload(raw);
      if (!claims) {
        setStatusMsg("Could not decode JWT — invalid credential.");
        return;
      }
      const newAccount: DemoAccount = {
        id: claims.sub ?? claims.email,
        name: claims.name ?? claims.email,
        email: claims.email,
        locale: claims.locale ?? "en",
        pictureSeed: claims.name ?? claims.email,
        token: raw,
        addedAt: Date.now(),
        expiresAt: (claims.exp ?? 0) * 1000,
        scopes: ["openid", "email", "profile"],
      };
      setAccounts((prev) => {
        const idx = prev.findIndex((a) => a.id === newAccount.id);
        const next =
          idx >= 0
            ? prev.map((a, i) => (i === idx ? newAccount : a))
            : [...prev, newAccount];
        return next;
      });
      setSelected(newAccount.id);
      setStatusMsg(`Signed in as ${newAccount.email}`);
    },
    [setAccounts],
  );

  /** Initialize google.accounts.id with the supplied client ID. */
  function initGis() {
    if (!gisReady || !window.google?.accounts?.id) {
      setStatusMsg("GIS script not loaded yet — please wait.");
      return;
    }
    if (!clientId.trim()) {
      setStatusMsg("Enter a Client ID first.");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: clientId.trim(),
      callback: handleCredentialResponse,
      auto_select: false,
    });
    if (buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        shape: "rectangular",
        theme: "outline",
        text: "signin_with",
        size: "large",
      });
    }
    setInitialized(true);
    setStatusMsg("GIS initialized. Use the Google button below to sign in.");
  }

  /** Trigger One Tap prompt programmatically. */
  function promptOneTap() {
    if (!initialized) {
      setStatusMsg("Initialize GIS first.");
      return;
    }
    window.google?.accounts?.id.prompt(
      (notification: google.accounts.id.PromptMomentNotification) => {
        if (notification.isNotDisplayed()) {
          setStatusMsg(
            `One Tap not displayed: ${notification.getNotDisplayedReason()}`,
          );
        } else if (notification.isSkippedMoment()) {
          setStatusMsg(`One Tap skipped: ${notification.getSkippedReason()}`);
        } else if (notification.isDismissedMoment()) {
          setStatusMsg(
            `One Tap dismissed: ${notification.getDismissedReason()}`,
          );
        }
      },
    );
  }

  const payload = useMemo(() => {
    if (!account) return "Sign in to inspect the decoded JWT payload.";
    const claims = decodeJwtPayload(account.token);
    return claims ? JSON.stringify(claims, null, 2) : "Could not decode token.";
  }, [account]);

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>
          {legacy ? "Legacy Reconstruction" : "Interactive Sign-In Demo"}
        </span>
        <h2>
          {legacy
            ? "Lightweight sign-in flow (identity only)"
            : "Real Google Sign-In via GIS — identity only"}
        </h2>
        <p>
          {legacy
            ? "Client ID setup, GIS initialize, real sign-in button, and JWT inspection."
            : "This wires up the actual google.accounts.id library: load the GIS script, initialize with your Client ID, render the sign-in button, and decode the real JWT credential returned by Google."}
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
                disabled={!gisReady || !clientId.trim()}
                onClick={initGis}
                type="button"
              >
                Init GIS
              </button>
              <button
                className={styles.button}
                disabled={!initialized}
                onClick={promptOneTap}
                type="button"
              >
                One Tap prompt
              </button>
              <span
                className={`${styles.statusPill} ${initialized ? styles.success : styles.warning}`}
              >
                {initialized ? "GIS initialized" : "GIS idle"}
              </span>
            </div>
          </div>
          {/* GIS renders the real Sign In With Google button into this div */}
          <div className={styles.section}>
            <div ref={buttonRef} />
          </div>
          <div className={styles.section}>
            <div className={styles.callout}>{statusMsg}</div>
          </div>
          <div className={styles.section}>
            <div className={styles.callout}>
              Identity-only flow — no Gmail, Drive, or Photos scopes. You need a
              real OAuth Client ID with this page's origin added as an
              authorised JavaScript origin in Google Cloud Console.
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
                    onRemove={() => {
                      setAccounts(accounts.filter((a) => a.id !== entry.id));
                      if (selected === entry.id) setSelected("");
                    }}
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
              <div className={styles.resultTitle}>Raw credential (JWT)</div>
              <div className={styles.panel}>
                <pre
                  className={styles.code}
                  style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}
                >
                  {account.token}
                </pre>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
