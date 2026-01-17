"use client";

import { useState, useEffect, useRef } from "react";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog",
  "Practice makes perfect in typing speed and accuracy",
  "TypeScript is a superset of JavaScript with static typing",
  "Next.js is a powerful React framework for web applications",
  "Consistent practice improves your typing skills significantly",
];

export default function Home() {
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startNewTest();
  }, []);

  const startNewTest = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setTargetText(randomText);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    const correctChars = value.split("").filter((char, idx) => char === targetText[idx]).length;
    const acc = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
    setAccuracy(acc);

    const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
    const wordsTyped = value.length / 5;
    const calculatedWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(calculatedWpm);

    if (value === targetText) {
      setIsCompleted(true);
    }
  };

  const getCharacterClass = (char: string, index: number) => {
    if (index >= userInput.length) {
      return "text-gray-400";
    }
    return userInput[index] === char ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Typing Speed Test
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Speed</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{wpm} WPM</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{accuracy}%</p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <p className="text-2xl font-mono leading-relaxed">
              {targetText.split("").map((char, index) => (
                <span key={index} className={getCharacterClass(char, index)}>
                  {char}
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
            className="w-full p-4 text-lg font-mono border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-6"
            placeholder="Start typing here..."
          />

          {isCompleted && (
            <div className="bg-green-100 dark:bg-green-900 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                Completed!
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Final Speed: {wpm} WPM | Accuracy: {accuracy}%
              </p>
            </div>
          )}

          <button
            onClick={startNewTest}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            New Test
          </button>
        </div>
      </main>
    </div>
  );
}
