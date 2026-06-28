export type SenderRules = Record<string, number>;

export type ParseResult = {
  token: string | null;
  source: "custom" | "regex" | "none";
};

export function parseOtpFromText(
  sender: string,
  text: string,
  rules: SenderRules,
): ParseResult {
  const words = text.trim().split(/\s+/).filter(Boolean);

  // Layer 1: highest-priority custom rule by sender.
  const customIndex = rules[sender];
  if (
    typeof customIndex === "number" &&
    customIndex >= 0 &&
    customIndex < words.length
  ) {
    return {
      token: words[customIndex],
      source: "custom",
    };
  }

  // Layer 2: fallback regex for 4-8 digits near OTP/code keywords.
  const match = text.match(
    /(?:otp|code)\D{0,20}(\d{4,8})|(\d{4,8})\D{0,20}(?:otp|code)/i,
  );
  const token = match?.[1] ?? match?.[2] ?? null;

  if (token) {
    return {
      token,
      source: "regex",
    };
  }

  return {
    token: null,
    source: "none",
  };
}
