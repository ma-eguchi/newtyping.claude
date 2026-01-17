"use client";

import { useState, useEffect, useRef } from "react";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog",
  "Practice makes perfect in typing speed and accuracy",
  "TypeScript is a superset of JavaScript with static typing",
  "Next.js is a powerful React framework for web applications",
  "Consistent practice improves your typing skills significantly",
];

const HOME_POSITION_LEVELS = [
  { level: 1, name: "レベル1: FとJ", pattern: "fj", repeat: 10 },
  { level: 2, name: "レベル2: F,J,D,K", pattern: "fjdk", repeat: 8 },
  { level: 3, name: "レベル3: F,J,D,K,L,S", pattern: "fjdkls", repeat: 6 },
  { level: 4, name: "レベル4: ホームポジション全て", pattern: "fjdkls;a", repeat: 5 },
  { level: 5, name: "レベル5: ランダム練習", pattern: "random", repeat: 20 },
];

const KEYBOARD_LAYOUT = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  [" "],
];

interface Score {
  date: string;
  wpm: number;
  accuracy: number;
  score: number;
  mode: string;
}

export default function Home() {
  const [mode, setMode] = useState<"select" | "normal" | "homeposition">("select");
  const [homePositionLevel, setHomePositionLevel] = useState(0);
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [rankings, setRankings] = useState<Score[]>([]);
  const [currentKey, setCurrentKey] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      loadRankings();
    }
  }, []);

  const loadRankings = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("typingRankings");
      if (saved) {
        setRankings(JSON.parse(saved));
      }
    }
  };

  const saveScore = (finalWpm: number, finalAccuracy: number, finalScore: number) => {
    const newScore: Score = {
      date: new Date().toLocaleString("ja-JP"),
      wpm: finalWpm,
      accuracy: finalAccuracy,
      score: finalScore,
      mode: mode === "homeposition" ? `ホームポジション Lv${homePositionLevel + 1}` : "通常モード",
    };
    const newRankings = [...rankings, newScore].sort((a, b) => b.score - a.score).slice(0, 10);
    setRankings(newRankings);
    if (typeof window !== "undefined") {
      localStorage.setItem("typingRankings", JSON.stringify(newRankings));
    }
  };

  const playSound = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const generateHomePositionText = (level: number) => {
    const levelConfig = HOME_POSITION_LEVELS[level];
    if (levelConfig.pattern === "random") {
      const chars = "fjdkls;a".split("");
      let result = "";
      for (let i = 0; i < levelConfig.repeat; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    }
    return (levelConfig.pattern + " ").repeat(levelConfig.repeat).trim();
  };

  const startNewTest = () => {
    if (mode === "homeposition") {
      setTargetText(generateHomePositionText(homePositionLevel));
    } else {
      const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
      setTargetText(randomText);
    }
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    setScore(0);
    setCombo(0);
    setCurrentKey("");
    inputRef.current?.focus();
  };

  const selectMode = (selectedMode: "normal" | "homeposition") => {
    setMode(selectedMode);
    if (selectedMode === "homeposition") {
      setHomePositionLevel(0);
    }
  };

  useEffect(() => {
    if (mode !== "select") {
      startNewTest();
    }
  }, [mode, homePositionLevel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const lastChar = value[value.length - 1];
    const expectedChar = targetText[value.length - 1];

    if (startTime === null) {
      setStartTime(Date.now());
    }

    if (lastChar === expectedChar) {
      playSound(800, 0.05);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(score + 10 + Math.floor(newCombo / 5) * 5);
    } else if (lastChar !== undefined) {
      playSound(200, 0.1);
      setCombo(0);
    }

    setUserInput(value);
    setCurrentKey(targetText[value.length] || "");

    const correctChars = value.split("").filter((char, idx) => char === targetText[idx]).length;
    const acc = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
    setAccuracy(acc);

    const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
    const wordsTyped = value.length / 5;
    const calculatedWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(calculatedWpm);

    if (value === targetText) {
      setIsCompleted(true);
      const finalScore = score + 100 + calculatedWpm * 2;
      setScore(finalScore);
      playSound(1000, 0.3);
      saveScore(calculatedWpm, acc, finalScore);
    }
  };

  const nextLevel = () => {
    if (homePositionLevel < HOME_POSITION_LEVELS.length - 1) {
      setHomePositionLevel(homePositionLevel + 1);
    }
  };

  const getCharacterClass = (char: string, index: number) => {
    if (index >= userInput.length) {
      return index === userInput.length ? "text-blue-600 bg-blue-100 dark:bg-blue-900" : "text-gray-400";
    }
    return userInput[index] === char ? "text-green-600" : "text-red-600";
  };

  const getKeyClass = (key: string) => {
    const homeKeys = ["f", "j", "d", "k", "s", "l", "a", ";"];
    const isHomeKey = homeKeys.includes(key.toLowerCase());
    const isCurrentKey = key.toLowerCase() === currentKey.toLowerCase();

    let classes = "rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-mono border-2 transition-all duration-100 ";

    if (isCurrentKey) {
      classes += "bg-yellow-400 border-yellow-600 scale-110 shadow-lg dark:bg-yellow-500";
    } else if (isHomeKey) {
      classes += "bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600";
    } else {
      classes += "bg-gray-200 border-gray-400 dark:bg-gray-700 dark:border-gray-600";
    }

    return classes;
  };

  if (mode === "select") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <main className="w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              あきタイピング
            </h1>
            <p className="text-xl text-center mb-12 text-gray-600 dark:text-gray-300">
              for タイピング部 ⌨️
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => selectMode("homeposition")}
                className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-8 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="text-4xl mb-4">🏠</div>
                <h2 className="text-2xl font-bold mb-2">ホームポジション練習</h2>
                <p className="text-blue-100">小学生向け・段階的に学べる</p>
              </button>

              <button
                onClick={() => selectMode("normal")}
                className="group bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-8 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold mb-2">通常モード</h2>
                <p className="text-purple-100">スピードと正確性を競う</p>
              </button>
            </div>

            {rankings.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                  🏆 ランキング TOP 10
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                        <th className="p-2 text-left">順位</th>
                        <th className="p-2 text-left">得点</th>
                        <th className="p-2 text-left">WPM</th>
                        <th className="p-2 text-left">精度</th>
                        <th className="p-2 text-left">モード</th>
                        <th className="p-2 text-left">日時</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankings.map((rank, idx) => (
                        <tr key={idx} className="border-b border-gray-200 dark:border-gray-800">
                          <td className="p-2">
                            {idx === 0 && "🥇"}
                            {idx === 1 && "🥈"}
                            {idx === 2 && "🥉"}
                            {idx > 2 && `${idx + 1}位`}
                          </td>
                          <td className="p-2 font-bold text-purple-600 dark:text-purple-400">{rank.score}</td>
                          <td className="p-2">{rank.wpm}</td>
                          <td className="p-2">{rank.accuracy}%</td>
                          <td className="p-2 text-xs">{rank.mode}</td>
                          <td className="p-2 text-xs">{rank.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="w-full max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              あきタイピング
            </h1>
            <button
              onClick={() => setMode("select")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← 戻る
            </button>
          </div>

          {mode === "homeposition" && (
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {HOME_POSITION_LEVELS[homePositionLevel].name}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">スピード</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wpm}</p>
              <p className="text-xs text-gray-500">WPM</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">精度</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}</p>
              <p className="text-xs text-gray-500">%</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">得点</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{score}</p>
              <p className="text-xs text-gray-500">pts</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">コンボ</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{combo}</p>
              <p className="text-xs text-gray-500">連続</p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-xl sm:text-2xl font-mono leading-relaxed break-all">
              {targetText.split("").map((char, index) => (
                <span key={index} className={getCharacterClass(char, index)}>
                  {char === " " ? "␣" : char}
                </span>
              ))}
            </p>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isCompleted}
            className="w-full p-4 text-lg font-mono border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white mb-4"
            placeholder="ここにタイピング..."
          />

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4 overflow-x-auto">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center">キーボード</p>
            <div className="flex flex-col items-center gap-1">
              {KEYBOARD_LAYOUT.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1">
                  {row.map((key, keyIdx) => (
                    <div key={keyIdx} className={getKeyClass(key)}>
                      {key === " " ? "Space" : key.toUpperCase()}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {isCompleted && (
            <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 border-2 border-green-500 rounded-lg p-6 mb-4 text-center">
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                🎉 完了！
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                得点: <span className="font-bold text-purple-600 dark:text-purple-400">{score}</span> pts
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                スピード: {wpm} WPM | 精度: {accuracy}%
              </p>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={startNewTest}
              className="flex-1 min-w-[200px] bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isCompleted ? "もう一度" : "リセット"}
            </button>
            {mode === "homeposition" && isCompleted && homePositionLevel < HOME_POSITION_LEVELS.length - 1 && (
              <button
                onClick={nextLevel}
                className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                次のレベルへ ➡️
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
