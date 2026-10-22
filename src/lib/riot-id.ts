export function cleanRiotId(value: string): string {
  return value.trim().replace(/\s+#/, "#");
}

export function isValidRiotId(value: string): boolean {
    const separator = value.lastIndexOf("#");

    return (
      separator > 0 &&
      separator < value.length - 1 &&
      value.trim() === value &&
      !value.includes("\n")
    );
  }

export function extractRiotId(qrValue: string): string | null {
  const value = qrValue.trim();
  
  if (/* /^[^#\s]+#[^#\s]+$/u.test(value) */ isValidRiotId(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.toLowerCase() === "qrlogin.riotgames.com") {
      const friendCode = url.searchParams.get("friendCode");

      if (friendCode && friendCode.includes("#")) {
        return cleanRiotId(friendCode.trim());
      }
    }
  } catch {
    const match = value.match(/[?&]friendCode=([^&#]*)/i);

    if (match) {
      try {
        const decoded = decodeURIComponent(match[1].replace(/\+/g, " "));
        if (decoded.includes("#")) return cleanRiotId(decoded);
      } catch {
        return null;
      }
    }
  }

  return null;
}