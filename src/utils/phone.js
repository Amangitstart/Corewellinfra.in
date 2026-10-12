// Phone number checking. Accepts what real visitors type:
//   Indian numbers:  98765 43210, 098765 43210, +91 98765-43210, 91 9876543210
//   Landlines with an STD code (10 digits after the leading 0)
//   International numbers that start with + (8 to 15 digits)

export function normalizePhone(input) {
  let raw = String(input ?? '').trim().replace(/[\s().-]/g, '');
  if (raw.startsWith('00')) raw = '+' + raw.slice(2); // 0044... -> +44...
  if (!/^\+?\d+$/.test(raw)) return { ok: false };

  if (raw.startsWith('+')) {
    const digits = raw.slice(1);
    if (digits.startsWith('91') && digits.length === 12) return indian(digits.slice(2));
    if (digits.startsWith('91')) return { ok: false }; // +91 must be followed by 10 digits
    if (digits.length >= 8 && digits.length <= 15 && digits[0] !== '0') {
      return { ok: true, value: '+' + digits, display: '+' + digits };
    }
    return { ok: false };
  }

  let digits = raw;
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return indian(digits);
}

function indian(ten) {
  // 10 digits starting with 2-9 covers mobiles (6-9) and landlines with an STD code.
  if (/^[2-9]\d{9}$/.test(ten)) return { ok: true, value: ten, display: '+91 ' + ten };
  return { ok: false };
}
