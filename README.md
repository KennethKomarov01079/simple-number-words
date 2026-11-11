# simple-number-words

Convert safe integers to English words.

```js
import { toWords } from 'simple-number-words';

toWords(0);        // 'zero'
toWords(21);       // 'twenty-one'
toWords(101);      // 'one hundred one'
toWords(-1000);    // 'negative one thousand'
toWords(Number.MAX_SAFE_INTEGER);
// 'nine quadrillion seven trillion one hundred ninety-nine billion two hundred fifty-four million seven hundred forty thousand nine hundred ninety-one'
```

## Why this exists

Most number-to-words snippets on the web either stop at thousands or quietly
lose precision past 2^53. This library does neither: it covers every safe
integer JavaScript can represent, and it refuses anything outside that range
with a `RangeError` rather than returning a plausible-looking wrong answer.
The trade-off is that it does not attempt `BigInt` or arbitrary-precision
support. If you need those, convert the value to a safe integer first or use a
specialised library.

## The awkward edge

`Number.MAX_SAFE_INTEGER + 1` is still a number, and `toWords` throws on it.
That is intentional. Beyond the safe range, the value you pass in may not be
the integer you think it is, so the function declines to guess. Non-integers
and non-finite values throw as well.

## API

### `toWords(value: number): string`

Returns the English words for `value`. Hyphens appear only inside the 21-99
range (`twenty-one`), matching common written usage. Negative values are
prefixed with `negative`. Zero is `zero`.

Throws `TypeError` for non-numbers, `NaN`, and infinities. Throws
`RangeError` for non-integers and for integers outside the safe range.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

