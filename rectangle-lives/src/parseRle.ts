/**
 * function parseRle()
 *
 * Original code:
 *   "ca-formats" v0.0.0
 *   © 2018 Jamen Marz
 *   MIT license
 *   https://github.com/jamen/ca-formats
 *
 * Modification by FAL.
 *
 * @param s - The string value to be parsed.
 */
export default function parseRle(s: string): number[] {
  const str = s.replace(/^#.*$/g, '');
  const cells: number[] = [];
  let b = 0;
  let x = 0;
  let y = 0;

  for (let i = 0; i < str.length; i += 1) {
    const char = str[i];
    const rs = b < i && str.slice(b, i);
    const r = rs ? parseInt(rs, 10) : 1;
    if (char === 'o') {
      for (let p = 0; p < r; p += 1) {
        cells.push(x, y);
        x += 1;
      }
    } else if (char === 'b') {
      x += r;
    } else if (char === '$') {
      y += r;
      x = 0;
    } else if (char === 'x' || char === 'y') {
      i = str.indexOf('\n', i);
    }
    if (char === 'o' || char === 'b' || char === '$' || char === 'x' || char === 'y') {
      b = i + 1;
    }
  }

  return cells;
}
