import {
  generateHomePositionText,
  HOME_POSITION_LEVELS,
  TIME_LIMIT,
  JAPANESE_WORDS,
  getAllJapaneseWords,
  getNextJapaneseWord
} from '../lib/typing-utils';

describe('Typing App Core Functions', () => {
  describe('generateHomePositionText', () => {
    it('should generate text from pattern and repeat count', () => {
      const result = generateHomePositionText(0); // Level 1: fj
      expect(result).toContain('fj');
      expect(result.split(' ').length).toBe(15);
    });

    it('should handle different levels', () => {
      const level2 = generateHomePositionText(1); // Level 2: fjdk
      expect(level2).toContain('fjdk');

      const level3 = generateHomePositionText(2); // Level 3: fjdkls
      expect(level3).toContain('fjdkls');
    });

    it('should trim trailing spaces', () => {
      const result = generateHomePositionText(0);
      expect(result.endsWith(' ')).toBe(false);
      expect(result.startsWith(' ')).toBe(false);
    });
  });

  describe('HOME_POSITION_LEVELS', () => {
    it('should have 7 levels', () => {
      expect(HOME_POSITION_LEVELS).toHaveLength(7);
    });

    it('should have required properties for each level', () => {
      HOME_POSITION_LEVELS.forEach((level) => {
        expect(level).toHaveProperty('level');
        expect(level).toHaveProperty('name');
        expect(level).toHaveProperty('pattern');
        expect(level).toHaveProperty('repeat');
        expect(level).toHaveProperty('description');
        expect(level).toHaveProperty('emoji');
      });
    });

    it('should have levels numbered from 1 to 7', () => {
      HOME_POSITION_LEVELS.forEach((level, index) => {
        expect(level.level).toBe(index + 1);
      });
    });
  });

  describe('TIME_LIMIT', () => {
    it('should be 30 seconds', () => {
      expect(TIME_LIMIT).toBe(30);
    });
  });

  // TDD: Japanese words tests
  describe('Japanese Words', () => {
    describe('JAPANESE_WORDS', () => {
      it('should have easy words (2 characters)', () => {
        expect(JAPANESE_WORDS.easy).toBeDefined();
        expect(JAPANESE_WORDS.easy.length).toBeGreaterThan(0);
        JAPANESE_WORDS.easy.forEach((word) => {
          expect(word.length).toBe(2);
        });
      });

      it('should have medium words (3-4 characters)', () => {
        expect(JAPANESE_WORDS.medium).toBeDefined();
        expect(JAPANESE_WORDS.medium.length).toBeGreaterThan(0);
        JAPANESE_WORDS.medium.forEach((word) => {
          expect(word.length).toBeGreaterThanOrEqual(3);
          expect(word.length).toBeLessThanOrEqual(4);
        });
      });

      it('should have hard words (4+ characters)', () => {
        expect(JAPANESE_WORDS.hard).toBeDefined();
        expect(JAPANESE_WORDS.hard.length).toBeGreaterThan(0);
      });
    });

    describe('getAllJapaneseWords', () => {
      it('should return all words sorted by length', () => {
        const words = getAllJapaneseWords();
        expect(words.length).toBeGreaterThan(0);

        // Check that words are sorted by length
        for (let i = 0; i < words.length - 1; i++) {
          expect(words[i].length).toBeLessThanOrEqual(words[i + 1].length);
        }
      });

      it('should start with 2-character words', () => {
        const words = getAllJapaneseWords();
        expect(words[0].length).toBe(2);
      });
    });

    describe('getNextJapaneseWord', () => {
      it('should return next word in the list', () => {
        const words = ['すし', 'みそ', 'さば'];
        expect(getNextJapaneseWord('すし', words)).toBe('みそ');
        expect(getNextJapaneseWord('みそ', words)).toBe('さば');
      });

      it('should loop back to first word when reaching end', () => {
        const words = ['すし', 'みそ', 'さば'];
        expect(getNextJapaneseWord('さば', words)).toBe('すし');
      });

      it('should return first word when current word not found', () => {
        const words = ['すし', 'みそ', 'さば'];
        expect(getNextJapaneseWord('invalid', words)).toBe('すし');
      });
    });
  });
});
