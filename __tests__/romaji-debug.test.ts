import { hiraganaToRomaji, checkRomajiInput } from '../lib/romaji-utils';

describe('Romaji Input Debug Tests', () => {
  describe('すし (sushi)', () => {
    const target = 'すし';
    const expected = hiraganaToRomaji(target);

    it('should show expected romaji', () => {
      console.log(`\nひらがな: ${target}`);
      console.log(`期待されるローマ字: ${expected}`);
      expect(expected).toBe('sushi');
    });

    it('should accept Hepburn progressive input', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('su', target)).toBe(true);
      expect(checkRomajiInput('sus', target)).toBe(true);
      expect(checkRomajiInput('sush', target)).toBe(true);
      expect(checkRomajiInput('sushi', target)).toBe(true);
    });

    it('should accept Kunrei progressive input', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('su', target)).toBe(true);
      expect(checkRomajiInput('sus', target)).toBe(true);
      expect(checkRomajiInput('susi', target)).toBe(true);
    });
  });

  describe('ちず (chizu/tizu)', () => {
    const target = 'ちず';
    const expected = hiraganaToRomaji(target);

    it('should show expected romaji', () => {
      console.log(`\nひらがな: ${target}`);
      console.log(`期待されるローマ字: ${expected}`);
      expect(expected).toBe('chizu');
    });

    it('should accept Hepburn progressive input', () => {
      expect(checkRomajiInput('c', target)).toBe(true);
      expect(checkRomajiInput('ch', target)).toBe(true);
      expect(checkRomajiInput('chi', target)).toBe(true);
      expect(checkRomajiInput('chiz', target)).toBe(true);
      expect(checkRomajiInput('chizu', target)).toBe(true);
    });

    it('should accept Kunrei progressive input', () => {
      expect(checkRomajiInput('t', target)).toBe(true);
      expect(checkRomajiInput('ti', target)).toBe(true);
      expect(checkRomajiInput('tiz', target)).toBe(true);
      expect(checkRomajiInput('tizu', target)).toBe(true);
    });
  });

  describe('つな (tsuna/tuna)', () => {
    const target = 'つな';
    const expected = hiraganaToRomaji(target);

    it('should show expected romaji', () => {
      console.log(`\nひらがな: ${target}`);
      console.log(`期待されるローマ字: ${expected}`);
      expect(expected).toBe('tsuna');
    });

    it('should accept Hepburn progressive input', () => {
      expect(checkRomajiInput('t', target)).toBe(true);
      expect(checkRomajiInput('ts', target)).toBe(true);
      expect(checkRomajiInput('tsu', target)).toBe(true);
      expect(checkRomajiInput('tsun', target)).toBe(true);
      expect(checkRomajiInput('tsuna', target)).toBe(true);
    });

    it('should accept Kunrei progressive input', () => {
      expect(checkRomajiInput('t', target)).toBe(true);
      expect(checkRomajiInput('tu', target)).toBe(true);
      expect(checkRomajiInput('tun', target)).toBe(true);
      expect(checkRomajiInput('tuna', target)).toBe(true);
    });
  });
});
