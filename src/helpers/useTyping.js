import { useState, useEffect } from "react";

export default function Typewriter({ text, speed }) {
  const displayText = useTyping(text, speed);
  return <p>{displayText}</p>;
}

function useTyping(text, speed = 70) {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prevText) => prevText + text.charAt(i));
        // console.log("index: " +i +", appended: " +text.charAt(i) +", new text: " +displayText);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
}
