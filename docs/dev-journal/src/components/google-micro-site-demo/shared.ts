import { useEffect, useState } from "react";

export type Profile = {
  id: string;
  name: string;
  email: string;
  locale: string;
};

export type DemoAccount = {
  id: string;
  name: string;
  email: string;
  locale: string;
  pictureSeed: string;
  token: string;
  addedAt: number;
  expiresAt: number;
  scopes: string[];
};

export const sampleProfiles: Profile[] = [
  {
    id: "maya",
    name: "Maya Patel",
    email: "maya.patel.demo@gmail.com",
    locale: "en",
  },
  {
    id: "arjun",
    name: "Arjun Singh",
    email: "arjun.singh.demo@gmail.com",
    locale: "en-IN",
  },
  {
    id: "lucia",
    name: "Lucia Costa",
    email: "lucia.costa.demo@gmail.com",
    locale: "pt-BR",
  },
];

export function encodeBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  if (typeof globalThis.btoa === "function") {
    return globalThis
      .btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  return value.replace(/\s+/g, "-");
}

export function buildJwtPayload(profile: Profile) {
  return {
    iss: "https://accounts.google.com",
    sub: `${profile.id}-sub`,
    aud: "docs-demo.apps.googleusercontent.com",
    email: profile.email,
    email_verified: true,
    name: profile.name,
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=2563eb&color=fff`,
    locale: profile.locale,
    iat: 1716900000,
    exp: 1716903600,
  };
}

export function buildFakeJwt(profile: Profile) {
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = encodeBase64Url(JSON.stringify(buildJwtPayload(profile)));
  return `${header}.${payload}.signature-preview`;
}

export function createAccount(profile: Profile, scopes: string[]) {
  return {
    id: profile.email,
    name: profile.name,
    email: profile.email,
    locale: profile.locale,
    pictureSeed: profile.name,
    token: buildFakeJwt(profile),
    addedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 50,
    scopes,
  } satisfies DemoAccount;
}

export function addNextAccount(accounts: DemoAccount[], scopes: string[]) {
  const nextProfile = sampleProfiles[accounts.length % sampleProfiles.length];
  const nextAccount = createAccount(nextProfile, scopes);
  const index = accounts.findIndex((account) => account.id === nextAccount.id);

  if (index >= 0) {
    const copy = [...accounts];
    copy[index] = nextAccount;
    return copy;
  }

  return [...accounts, nextAccount];
}

export function buildOauthUrl(
  clientId: string,
  redirectUri: string,
  scopes: string[],
  responseType: "token" | "id_token",
  prompt: string,
) {
  const params = new URLSearchParams({
    client_id: clientId || "your-client-id.apps.googleusercontent.com",
    redirect_uri: redirectUri || "http://localhost:3001/google-demo",
    response_type: responseType,
    scope: scopes.join(" "),
    include_granted_scopes: "true",
    prompt,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Decode the payload of a JWT without verifying the signature.
 * Used client-side only to inspect the identity claims returned by GIS.
 * Returns null if the token is malformed.
 */
export function decodeJwtPayload(
  token: string,
): Record<string, string & number> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Base64url → base64 → JSON
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json) as Record<string, string & number>;
  } catch {
    return null;
  }
}

export function buildRfc2822(
  toEmail: string,
  subject: string,
  message: string,
) {
  return [
    `To: ${toEmail || "recipient@example.com"}`,
    `Subject: ${subject || "Demo Subject"}`,
    "",
    message || "Hello from the Dev Journal demo.",
  ].join("\r\n");
}

export function formatDate(value: number) {
  return new Date(value).toLocaleString();
}

export function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const sized = bytes / 1024 ** exponent;
  return `${sized.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        setValue(JSON.parse(saved) as T);
      }
    } catch {
      return;
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [hydrated, key, value]);

  return [value, setValue] as const;
}
