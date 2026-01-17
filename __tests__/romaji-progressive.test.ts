import { checkRomajiInput, hiraganaToRomaji } from '../lib/romaji-utils';

describe('Progressive Romaji Input (Step by Step)', () => {
  describe('し (shi/si)', () => {
    const target = 'し';

    it('should accept Hepburn input progressively', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('sh', target)).toBe(true);
      expect(checkRomajiInput('shi', target)).toBe(true);
    });

    it('should accept Kunrei input progressively', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('si', target)).toBe(true);
    });
  });

  describe('ち (chi/ti)', () => {
    const target = 'ち';

    it('should accept Hepburn input progressively', () => {
      expect(checkRomajiInput('c', target)).toBe(true);
      expect(checkRomajiInput('ch', target)).toBe(true);
      expect(checkRomajiInput('chi', target)).toBe(true);
    });

    it('should accept Kunrei input progressively', () => {
      expect(checkRomajiInput('t', target)).toBe(true);
      expect(checkRomajiInput('ti', target)).toBe(true);
    });
  });

  describe('つ (tsu/tu)', () => {
    const target = 'つ';

    it('should accept Hepburn input progressively', () => {
      expect(checkRomajiInput('t', target)).toBe(true);
      expect(checkRomajiInput('ts', target)).toBe(true);
      expect(checkRomajiInput('tsu', target)).toBe(true);
    });

    it('should accept Kunrei input progressively', () => {
      expect(checkRomajiInput('t', target)).toBe(true);
      expect(checkRomajiInput('tu', target)).toBe(true);
    });
  });

  describe('ふ (fu/hu)', () => {
    const target = 'ふ';

    it('should accept Hepburn input progressively', () => {
      expect(checkRomajiInput('f', target)).toBe(true);
      expect(checkRomajiInput('fu', target)).toBe(true);
    });

    it('should accept Kunrei input progressively', () => {
      expect(checkRomajiInput('h', target)).toBe(true);
      expect(checkRomajiInput('hu', target)).toBe(true);
    });
  });

  describe('Mixed: すし (sushi/susi)', () => {
    const target = 'すし';

    it('should show expected romaji', () => {
      const expected = hiraganaToRomaji(target);
      console.log(`Target: ${target}, Expected: ${expected}`);
      expect(expected).toBe('sushi');
    });

    it('should accept Hepburn input progressively', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('su', target)).toBe(true);
      expect(checkRomajiInput('sus', target)).toBe(true);
      expect(checkRomajiInput('sush', target)).toBe(true);
      expect(checkRomajiInput('sushi', target)).toBe(true);
    });

    it('should accept Kunrei input progressively (susi)', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('su', target)).toBe(true);
      expect(checkRomajiInput('sus', target)).toBe(true);
      expect(checkRomajiInput('susi', target)).toBe(true);
    });

    it('should accept mixed input (sushi with kunrei shi -> si)', () => {
      // "sushi" の "shi" 部分を訓令式 "si" に変えた "susi"
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('su', target)).toBe(true);
      expect(checkRomajiInput('sus', target)).toBe(true);
      expect(checkRomajiInput('susi', target)).toBe(true);
    });
  });

  describe('Mixed: しゃ (sha/sya)', () => {
    const target = 'しゃ';

    it('should accept Hepburn input progressively', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('sh', target)).toBe(true);
      expect(checkRomajiInput('sha', target)).toBe(true);
    });

    it('should accept Kunrei input progressively', () => {
      expect(checkRomajiInput('s', target)).toBe(true);
      expect(checkRomajiInput('sy', target)).toBe(true);
      expect(checkRomajiInput('sya', target)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should reject completely wrong input', () => {
      expect(checkRomajiInput('x', 'し')).toBe(false);
      expect(checkRomajiInput('abc', 'し')).toBe(false);
      expect(checkRomajiInput('z', 'すし')).toBe(false);
    });

    it('should reject input that goes too far', () => {
      // "し" は "shi" または "si" なので、"shix" や "six" は間違い
      expect(checkRomajiInput('shix', 'し')).toBe(false);
      expect(checkRomajiInput('six', 'し')).toBe(false);
    });
  });
});
