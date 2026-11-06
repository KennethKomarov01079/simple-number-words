// Public entry point for simple-number-words.
//
// Keeping the re-export in a separate file makes the package surface
// explicit: consumers import from the package root, tests may import
// from either the root or the core module.

export { toWords } from './core.js';
