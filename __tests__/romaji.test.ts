import { hiraganaToRomaji, checkRomajiInput } from '../lib/romaji-utils';

describe('Romaji Conversion', () => {
  describe('hiraganaToRomaji', () => {
    it('should convert basic hiragana to Hepburn romaji', () => {
      expect(hiraganaToRomaji('すし')).toBe('sushi');
      expect(hiraganaToRomaji('みそ')).toBe('miso');
      expect(hiraganaToRomaji('さば')).toBe('saba');
    });

    it('should handle shi/chi/tsu correctly', () => {
      expect(hiraganaToRomaji('し')).toBe('shi');
      expect(hiraganaToRomaji('ち')).toBe('chi');
      expect(hiraganaToRomaji('つ')).toBe('tsu');
    });

    it('should handle fu correctly', () => {
      expect(hiraganaToRomaji('ふ')).toBe('fu');
    });

    it('should handle longer words', () => {
      expect(hiraganaToRomaji('さしみ')).toBe('sashimi');
      expect(hiraganaToRomaji('わさび')).toBe('wasabi');
      expect(hiraganaToRomaji('てんぷら')).toBe('tempura');
    });

    it('should handle small tsu (っ) as double consonant', () => {
      expect(hiraganaToRomaji('がっこう')).toBe('gakkou');
      expect(hiraganaToRomaji('きっぷ')).toBe('kippu');
    });

    it('should handle long vowels with う', () => {
      expect(hiraganaToRomaji('そう')).toBe('sou');
      expect(hiraganaToRomaji('こう')).toBe('kou');
    });
  });

  describe('checkRomajiInput', () => {
    it('should accept Hepburn romaji', () => {
      expect(checkRomajiInput('sushi', 'すし')).toBe(true);
      expect(checkRomajiInput('shi', 'し')).toBe(true);
      expect(checkRomajiInput('chi', 'ち')).toBe(true);
      expect(checkRomajiInput('fu', 'ふ')).toBe(true);
    });

    it('should accept Kunrei romaji as alternative', () => {
      expect(checkRomajiInput('susi', 'すし')).toBe(true);  // si instead of shi
      expect(checkRomajiInput('si', 'し')).toBe(true);
      expect(checkRomajiInput('ti', 'ち')).toBe(true);      // ti instead of chi
      expect(checkRomajiInput('tu', 'つ')).toBe(true);      // tu instead of tsu
      expect(checkRomajiInput('hu', 'ふ')).toBe(true);      // hu instead of fu
    });

    it('should reject incorrect input', () => {
      expect(checkRomajiInput('wrong', 'すし')).toBe(false);
      expect(checkRomajiInput('abc', 'みそ')).toBe(false);
    });

    it('should handle partial input', () => {
      expect(checkRomajiInput('su', 'すし')).toBe(true);    // partial match
      expect(checkRomajiInput('s', 'すし')).toBe(true);     // single char
      expect(checkRomajiInput('x', 'すし')).toBe(false);    // wrong start
    });

    it('should accept mixed Hepburn and Kunrei', () => {
      // User can type "susi" or "sushi" or even "susi" (mix)
      expect(checkRomajiInput('susi', 'すし')).toBe(true);
      expect(checkRomajiInput('sushi', 'すし')).toBe(true);
    });
  });
});
