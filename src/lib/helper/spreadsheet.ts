import { sheets_v4 } from 'googleapis';
import { getColorByCode } from './color';

const ALPHABET_COUNT = 26;

export function getAlphabetByColumn(column: number) {
  let prefix = '';
  if (column >= ALPHABET_COUNT) {
    prefix += getAlphabetByColumn((column - ALPHABET_COUNT - (column % ALPHABET_COUNT)) / ALPHABET_COUNT);
  }

  return prefix + String.fromCharCode(0x41 + (column % ALPHABET_COUNT));
}

export function getColumnByAlphabet(str: string) {
  let col = 0;
  for (let i = 0; i < str.length; ++i) {
    col += Math.pow(ALPHABET_COUNT, str.length - 1 - i) * (str.charCodeAt(i) - 0x40);
  }

  return col - 1;
}

export function parseAddressStr(str: string) {
  if (!/^[A-Z]+[0-9]*$/.test(str)) {
    return {};
  }

  const n = str.match(/[0-9]*$/)?.join('');
  return {
    column: str.match(/^[A-Z]+/)?.join(''),
    row: n && Number(n),
  };
}

export class RangeInfo {
  public readonly range: string;
  public readonly name: string;
  public readonly startColumn: string;
  public readonly startRow: number;
  public readonly endColumn: string;
  public readonly endRow: number;

  constructor(range: string) {
    this.range = range;

    const pair = range.split('!');

    this.name = pair.length >= 1 ? pair[0] : '';
    const address = pair.length >= 2 ? pair[1] : 'A1:Z1000';

    const addressPair = address.split(':');
    {
      const info = parseAddressStr(addressPair.length >= 1 ? addressPair[0] : '');
      this.startColumn = info.column || 'A';
      this.startRow = (info.row || 1) - 1;
    }
    {
      const info = parseAddressStr(
        addressPair.length >= 2 ? addressPair[1] : `${this.startColumn}${this.startRow + 1}`
      );
      this.endColumn = info.column || 'Z';
      this.endRow = (info.row || 1000) - 1;
    }
  }

  public calcDistance(other: RangeInfo) {
    if (this.name !== other.name) {
      return Number.MAX_SAFE_INTEGER;
    }

    const f = (posA: { x: number; y: number }, posB: { x: number; y: number }) => {
      const dx = Math.abs(posB.x - posA.x);
      const dy = Math.abs(posB.y - posA.y);

      return Math.sqrt(dx * dx + dy * dy);
    };

    return (
      f(
        { x: getColumnByAlphabet(this.endColumn), y: this.endRow },
        { x: getColumnByAlphabet(other.endColumn), y: other.endRow }
      ) *
      f(
        { x: getColumnByAlphabet(this.startColumn), y: this.startRow },
        { x: getColumnByAlphabet(other.startColumn), y: other.startRow }
      )
    );
  }
}

export const code2Color = (code?: string): sheets_v4.Schema$Color | undefined => {
  if (!code) {
    return undefined;
  }

  const color = getColorByCode(code);
  return {
    red: color.red / 255,
    green: color.green / 255,
    blue: color.blue / 255,
    alpha: color.alpha / 255,
  };
};
