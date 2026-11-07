import test from 'node:test';
import assert from 'node:assert/strict';

import { toWords } from '../src/index.js';

test('zero', () => {
  assert.equal(toWords(0), 'zero');
});

test('single digits', () => {
  assert.equal(toWords(1), 'one');
  assert.equal(toWords(9), 'nine');
});

test('teens are irregular', () => {
  assert.equal(toWords(10), 'ten');
  assert.equal(toWords(11), 'eleven');
  assert.equal(toWords(13), 'thirteen');
  assert.equal(toWords(19), 'nineteen');
});

test('tens without a unit are bare', () => {
  assert.equal(toWords(20), 'twenty');
  assert.equal(toWords(90), 'ninety');
});

test('compound tens are hyphenated', () => {
  assert.equal(toWords(21), 'twenty-one');
  assert.equal(toWords(42), 'forty-two');
  assert.equal(toWords(99), 'ninety-nine');
});

test('hundreds', () => {
  assert.equal(toWords(100), 'one hundred');
  assert.equal(toWords(101), 'one hundred one');
  assert.equal(toWords(110), 'one hundred ten');
  assert.equal(toWords(999), 'nine hundred ninety-nine');
});

test('thousands and above', () => {
  assert.equal(toWords(1000), 'one thousand');
  assert.equal(toWords(1001), 'one thousand one');
  assert.equal(toWords(1234), 'one thousand two hundred thirty-four');
  assert.equal(toWords(1000000), 'one million');
  assert.equal(toWords(1000001), 'one million one');
  assert.equal(toWords(1000000000), 'one billion');
});

test('zero groups are skipped', () => {
  assert.equal(toWords(1000000), 'one million');
  assert.equal(toWords(1000000001), 'one billion one');
  assert.equal(toWords(1001000), 'one million one thousand');
});

test('negative numbers', () => {
  assert.equal(toWords(-1), 'negative one');
  assert.equal(toWords(-21), 'negative twenty-one');
  assert.equal(toWords(-1000), 'negative one thousand');
});

test('maximum safe integer', () => {
  assert.equal(
    toWords(Number.MAX_SAFE_INTEGER),
    'nine quadrillion seven trillion one hundred ninety-nine billion ' +
      'two hundred fifty-four million seven hundred forty thousand ' +
      'nine hundred ninety-one'
  );
});

test('minimum safe integer', () => {
  assert.equal(
    toWords(Number.MIN_SAFE_INTEGER),
    'negative nine quadrillion seven trillion one hundred ninety-nine ' +
      'billion two hundred fifty-four million seven hundred forty ' +
      'thousand nine hundred ninety-one'
  );
});

test('rejects non-integers', () => {
  assert.throws(() => toWords(1.5), RangeError);
});

test('rejects unsafe integers', () => {
  assert.throws(() => toWords(Number.MAX_SAFE_INTEGER + 1), RangeError);
});

test('rejects non-numbers', () => {
  assert.throws(() => toWords('1'), TypeError);
  assert.throws(() => toWords(NaN), TypeError);
  assert.throws(() => toWords(Infinity), TypeError);
});
