/* eslint prefer-destructuring: 0 */

/**
 * num
 */
export const num = (val) => val.replace(/[^0-9]/, '');

/**
 * max
 */
export const max = (length) => (val) => val.slice(0, length);
