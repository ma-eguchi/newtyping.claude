export const HOME_POSITION_LEVELS = [
  { level: 1, name: "レベル1: FとJ", pattern: "fj", repeat: 15, description: "人差し指の基本位置を覚えよう！", emoji: "☝️" },
  { level: 2, name: "レベル2: F,J,D,K", pattern: "fjdk", repeat: 12, description: "中指のポジションを追加！", emoji: "✌️" },
  { level: 3, name: "レベル3: F,J,D,K,L,S", pattern: "fjdkls", repeat: 10, description: "薬指のポジションを追加！", emoji: "🤟" },
  { level: 4, name: "レベル4: F,J,D,K,L,S,A,;", pattern: "fjdklsa;", repeat: 8, description: "小指のポジションを追加してホームポジション完成！", emoji: "🖐️" },
  { level: 5, name: "レベル5: ホームポジション上段", pattern: "qwertyuiop", repeat: 6, description: "ホームポジションから指を上に伸ばす練習！", emoji: "⬆️" },
  { level: 6, name: "レベル6: ホームポジション下段", pattern: "zxcvbnm", repeat: 8, description: "ホームポジションから指を下に伸ばす練習！", emoji: "⬇️" },
  { level: 7, name: "レベル7: 数字", pattern: "1234567890", repeat: 6, description: "数字キーの練習！", emoji: "🔢" },
];

export const TIME_LIMIT = 30; // 30秒制限

export const generateHomePositionText = (level: number): string => {
  const levelConfig = HOME_POSITION_LEVELS[level];
  return (levelConfig.pattern + " ").repeat(levelConfig.repeat).trim();
};

// Japanese word lists by difficulty (sorted by character count)
export const JAPANESE_WORDS = {
  easy: ["すし", "みそ", "さば", "いか", "たこ", "かに", "えび", "のり", "さけ", "とろ"],
  medium: ["さしみ", "たまご", "わさび", "かつお", "うどん"],
  hard: ["てんぷら", "やきそば", "とんかつ", "すきやき"],
  veryHard: ["おこのみやき", "きょうりゅう", "しゃぶしゃぶ", "じゅうどうぶ"],
};

export const getAllJapaneseWords = (): string[] => {
  return [
    ...JAPANESE_WORDS.easy,
    ...JAPANESE_WORDS.medium,
    ...JAPANESE_WORDS.hard,
    ...JAPANESE_WORDS.veryHard,
  ].sort((a, b) => a.length - b.length);
};

export const getNextJapaneseWord = (currentWord: string, wordList: string[]): string => {
  const currentIndex = wordList.indexOf(currentWord);
  if (currentIndex === -1 || currentIndex >= wordList.length - 1) {
    return wordList[0];
  }
  return wordList[currentIndex + 1];
};
