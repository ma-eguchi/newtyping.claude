// ローマ字変換マッピング（ヘボン式）
const HIRAGANA_TO_ROMAJI_MAP: { [key: string]: string } = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'っ': '',  // 促音は次の子音を重ねる
};

// 訓令式の代替表記
const KUNREI_ALTERNATIVES: { [key: string]: string[] } = {
  'shi': ['si'],
  'chi': ['ti'],
  'tsu': ['tu'],
  'fu': ['hu'],
  'ji': ['zi'],
  'sha': ['sya'],
  'shu': ['syu'],
  'sho': ['syo'],
  'cha': ['tya'],
  'chu': ['tyu'],
  'cho': ['tyo'],
  'ja': ['zya'],
  'ju': ['zyu'],
  'jo': ['zyo'],
};

/**
 * ひらがなをヘボン式ローマ字に変換
 */
export const hiraganaToRomaji = (hiragana: string): string => {
  let result = '';
  let i = 0;

  while (i < hiragana.length) {
    // 2文字の組み合わせを先にチェック（拗音）
    if (i < hiragana.length - 1) {
      const twoChar = hiragana.substring(i, i + 2);
      if (HIRAGANA_TO_ROMAJI_MAP[twoChar]) {
        result += HIRAGANA_TO_ROMAJI_MAP[twoChar];
        i += 2;
        continue;
      }
    }

    // 促音（っ）の処理
    if (hiragana[i] === 'っ' && i < hiragana.length - 1) {
      const nextChar = hiragana[i + 1];
      const nextRomaji = HIRAGANA_TO_ROMAJI_MAP[nextChar] || '';
      if (nextRomaji) {
        result += nextRomaji[0]; // 次の子音を重ねる
      }
      i++;
      continue;
    }

    // 「ん」の処理（ヘボン式: b, p, m の前では m）
    if (hiragana[i] === 'ん') {
      if (i < hiragana.length - 1) {
        const nextChar = hiragana[i + 1];
        const nextRomaji = HIRAGANA_TO_ROMAJI_MAP[nextChar] || '';
        // b, p, m で始まる場合は「m」
        if (nextRomaji && (nextRomaji[0] === 'b' || nextRomaji[0] === 'p' || nextRomaji[0] === 'm')) {
          result += 'm';
        } else {
          result += 'n';
        }
      } else {
        result += 'n';
      }
      i++;
      continue;
    }

    // 1文字の変換
    const oneChar = hiragana[i];
    result += HIRAGANA_TO_ROMAJI_MAP[oneChar] || oneChar;
    i++;
  }

  return result;
};

/**
 * ローマ字入力が正しいかチェック（ヘボン式・訓令式両対応）
 */
export const checkRomajiInput = (userInput: string, targetHiragana: string): boolean => {
  const expectedRomaji = hiraganaToRomaji(targetHiragana);

  // 完全一致チェック
  if (userInput === expectedRomaji) {
    console.log('[Romaji] Exact match (Hepburn):', userInput, '===', expectedRomaji);
    return true;
  }

  // 部分一致チェック（途中入力）
  if (expectedRomaji.startsWith(userInput)) {
    console.log('[Romaji] Partial match (Hepburn):', expectedRomaji, 'starts with', userInput);
    return true;
  }

  // 訓令式の代替入力チェック
  let alternativeRomaji = expectedRomaji;
  for (const [hepburn, kunreiList] of Object.entries(KUNREI_ALTERNATIVES)) {
    for (const kunrei of kunreiList) {
      alternativeRomaji = alternativeRomaji.replace(new RegExp(hepburn, 'g'), kunrei);
    }
  }

  console.log('[Romaji] Alternative (Kunrei):', alternativeRomaji, 'from', expectedRomaji);

  if (userInput === alternativeRomaji || alternativeRomaji.startsWith(userInput)) {
    console.log('[Romaji] Match (Kunrei):', userInput, 'matches', alternativeRomaji);
    return true;
  }

  // 混合パターンのチェック（より複雑な入力に対応）
  // 例: "sushi" の "si" + "shi" = "sishi" のような混合入力
  console.log('[Romaji] Checking mixed pattern...');
  let pos = 0;
  let inputPos = 0;
  const hiraganaChars = targetHiragana.split('');

  while (inputPos < userInput.length && pos < hiraganaChars.length) {
    // 2文字の組み合わせチェック
    if (pos < hiraganaChars.length - 1) {
      const twoChar = hiraganaChars.slice(pos, pos + 2).join('');
      const romaji = HIRAGANA_TO_ROMAJI_MAP[twoChar];
      if (romaji) {
        const alternatives = [romaji, ...(KUNREI_ALTERNATIVES[romaji] || [])];
        let matched = false;
        for (const alt of alternatives) {
          if (userInput.substring(inputPos).startsWith(alt)) {
            console.log('[Romaji] Matched 2-char:', twoChar, '->', alt);
            inputPos += alt.length;
            pos += 2;
            matched = true;
            break;
          }
        }
        if (matched) continue;
      }
    }

    // 1文字チェック
    const oneChar = hiraganaChars[pos];
    const romaji = HIRAGANA_TO_ROMAJI_MAP[oneChar];
    if (romaji) {
      const alternatives = [romaji, ...(KUNREI_ALTERNATIVES[romaji] || [])];
      let matched = false;
      for (const alt of alternatives) {
        if (userInput.substring(inputPos).startsWith(alt)) {
          console.log('[Romaji] Matched 1-char:', oneChar, '->', alt);
          inputPos += alt.length;
          pos++;
          matched = true;
          break;
        }
      }
      if (matched) continue;
    }

    // マッチしない場合は false
    console.log('[Romaji] No match at pos:', pos, 'inputPos:', inputPos);
    return false;
  }

  // 入力が途中まで正しければ true
  const result = inputPos === userInput.length;
  console.log('[Romaji] Mixed pattern result:', result, 'inputPos:', inputPos, 'userInput.length:', userInput.length);
  return result;
};
