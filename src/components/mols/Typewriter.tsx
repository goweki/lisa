import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number; // typing speed in ms
}

/**
 * Typewriter component that animates text character by character.
 */
export default function Typewriter({ text, speed = 70 }: TypewriterProps) {
  const displayText = useTyping(text, speed);
  return <p>{displayText}</p>;
}

/**
 * Custom hook that simulates typing effect for a given string.
 *
 * @param {string} text - The full text to display.
 * @param {number} speed - Delay between characters in milliseconds.
 * @returns {string} - The current portion of text being "typed".
 */
function useTyping(text: string, speed: number): string {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayText(""); // Reset when text or speed changes

    const interval = setInterval(() => {
      setDisplayText((prev) => {
        if (index >= text.length) {
          clearInterval(interval);
          return prev;
        }
        const nextChar = text.charAt(index);
        index++;
        return prev + nextChar;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayText;
}
