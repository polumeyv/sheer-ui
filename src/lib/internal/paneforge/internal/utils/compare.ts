import { PRECISION } from '../constants.js';

/**
 * Compares two numbers for equality with a given fractional precision.
 */
export const areNumbersAlmostEqual = (actual: number, expected: number, digits = PRECISION) =>
	actual.toFixed(digits) === expected.toFixed(digits);
/**
 * Compares two numbers with a given tolerance.
 *
 * @returns `-1` if `actual` is less than `expected`, `0` if they are equal,
 * and `1` if `actual` is greater than `expected`.
 */
export const compareNumbersWithTolerance = (actual: number, expected: number, digits = PRECISION) =>
	Math.sign(Number(actual.toFixed(digits)) - Number(expected.toFixed(digits)));
