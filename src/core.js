// Core conversion logic for simple-number-words.
//
// The library deliberately supports only safe integers in the range
// Number.MIN_SAFE_INTEGER..Number.MAX_SAFE_INTEGER. Beyond that range
// JavaScript numbers cannot represent every integer exactly, so any
// conversion would be guessing at the caller's intent. We throw instead.

const SMALL = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy',
  'eighty', 'ninety'
];

// Scale names are grouped in threes. The largest group we can ever reach is
// "quadrillion" because MAX_SAFE_INTEGER is just under 10^16.
const SCALES = [
  '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'
];

/**
 * Convert a non-negative integer below 1000 to words.
 *
 * @param {number} n integer in [0, 999]
 * @returns {string}
 */
function underThousand(n) {
  if (n < 20) {
    return SMALL[n];
  }
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)];
    const r = n % 10;
    return r === 0 ? t : `${t}-${SMALL[r]}`;
  }
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const head = `${SMALL[hundreds]} hundred`;
  return rest === 0 ? head : `${head} ${underThousand(rest)}`;
}

/**
 * Convert an integer to its English words.
 *
 * The function accepts any safe integer, including zero and negatives.
 * Negative numbers are rendered with a leading "negative". Hyphens appear
 * only inside the 21-99 range (e.g. "twenty-one"), which is the common
 * written convention.
 *
 * @param {number} value
 * @returns {string}
 * @throws {TypeError} if value is not a number
 * @throws {RangeError} if value is not a safe integer
 */
export function toWords(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('toWords expects a finite number');
  }
  if (!Number.isSafeInteger(value)) {
    throw new RangeError('toWords expects a safe integer');
  }
  if (value === 0) {
    return 'zero';
  }
  if (value < 0) {
    return `negative ${toWords(-value)}`;
  }

  const groups = [];
  let remaining = value;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const parts = [];
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    const group = groups[i];
    if (group === 0) {
      continue;
    }
    const scale = SCALES[i];
    parts.push(scale ? `${underThousand(group)} ${scale}` : underThousand(group));
  }

  return parts.join(' ');
}
