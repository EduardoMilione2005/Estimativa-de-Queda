/**
 * @param {{x:number, y:number, z:number}}
 * @returns {number}
 */
export function magnitude({ x, y, z }) {
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
export function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
