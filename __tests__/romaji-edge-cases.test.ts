import { checkRomajiInput, hiraganaToRomaji } from '../lib/romaji-utils';

describe('Romaji Input Edge Cases - Empty String', () => {
  it('should accept empty string as valid partial input', () => {
    expect(checkRomajiInput('', 'すし')).toBe(true);
    expect(checkRomajiInput('', 'し')).toBe(true);
    expect(checkRomajiInput('', 'ち')).toBe(true);
  });

  it('should accept first character correctly', () => {
    // すし -> sushi/susi
    expect(checkRomajiInput('s', 'すし')).toBe(true);

    // し -> shi/si
    expect(checkRomajiInput('s', 'し')).toBe(true);

    // ち -> chi/ti
    expect(checkRomajiInput('c', 'ち')).toBe(true);
    expect(checkRomajiInput('t', 'ち')).toBe(true);

    // つ -> tsu/tu
    expect(checkRomajiInput('t', 'つ')).toBe(true);
  });

  it('should handle very first keystroke from empty', () => {
    const words = ['すし', 'みそ', 'さば', 'いか'];

    for (const word of words) {
      const romaji = hiraganaToRomaji(word);
      const firstChar = romaji[0];
      console.log(`Word: ${word}, Romaji: ${romaji}, First char: ${firstChar}`);
      expect(checkRomajiInput(firstChar, word)).toBe(true);
    }
  });
});
