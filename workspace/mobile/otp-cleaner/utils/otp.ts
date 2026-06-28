const OTP_REGEX = /\b\d{4,8}\b/;

export const isOTPMessage = (body: string) => {
  if (!body) return false;

  const lower = body.toLowerCase();

  const hasKeyword =
    lower.includes("otp") ||
    lower.includes("verification") ||
    lower.includes("code");

  return hasKeyword && OTP_REGEX.test(body);
};
