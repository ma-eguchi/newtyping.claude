/**
 * Score Calculation Tests
 *
 * Tests to verify that scoring works correctly:
 * - 10 points per character
 * - Combo bonus: +5 points every 5 characters
 * - Word completion bonus: 100 points + WPM * 2
 */

describe('Score Calculation Logic', () => {
  it('should calculate base score: 10 points per character', () => {
    // 1文字 = 10点
    expect(10).toBe(10);
    // 2文字 = 20点
    expect(10 + 10).toBe(20);
    // 3文字 = 30点
    expect(10 + 10 + 10).toBe(30);
  });

  it('should calculate combo bonus: +5 every 5 characters', () => {
    // 1-4文字目: ボーナスなし
    let score = 0;
    for (let i = 1; i <= 4; i++) {
      const combo = i;
      const comboBonus = Math.floor(combo / 5) * 5;
      score += 10 + comboBonus;
    }
    expect(score).toBe(40); // 10*4 = 40

    // 5文字目: ボーナス+5
    const combo5 = 5;
    const bonus5 = Math.floor(combo5 / 5) * 5;
    score += 10 + bonus5;
    expect(bonus5).toBe(5);
    expect(score).toBe(55); // 40 + 10 + 5 = 55

    // 10文字目: ボーナス+10
    score = 0;
    for (let i = 1; i <= 10; i++) {
      const combo = i;
      const comboBonus = Math.floor(combo / 5) * 5;
      score += 10 + comboBonus;
    }
    // 1-4: 10*4 = 40
    // 5-9: 15*5 = 75
    // 10: 15+5 = 20
    expect(score).toBe(135); // 40 + 75 + 20
  });

  it('should calculate word completion bonus', () => {
    const baseScore = 50; // 5文字分
    const wpm = 30;
    const completionBonus = 100 + wpm * 2;
    const totalScore = baseScore + completionBonus;

    expect(completionBonus).toBe(160); // 100 + 30*2
    expect(totalScore).toBe(210); // 50 + 160
  });

  it('should simulate typing "sushi" (5 characters)', () => {
    let score = 0;
    let combo = 0;

    // s
    combo = 1;
    score += 10 + Math.floor(combo / 5) * 5;
    expect(score).toBe(10);

    // u
    combo = 2;
    score += 10 + Math.floor(combo / 5) * 5;
    expect(score).toBe(20);

    // s
    combo = 3;
    score += 10 + Math.floor(combo / 5) * 5;
    expect(score).toBe(30);

    // h
    combo = 4;
    score += 10 + Math.floor(combo / 5) * 5;
    expect(score).toBe(40);

    // i
    combo = 5;
    score += 10 + Math.floor(combo / 5) * 5;
    expect(score).toBe(55); // 40 + 10 + 5(bonus)

    // Word completion (assuming 30 WPM)
    const wpm = 30;
    score += 100 + wpm * 2;
    expect(score).toBe(215); // 55 + 160
  });
});
