import React from "react";
export function useDate() {
  const locale = "en";
  const [today, setDate] = React.useState(new Date()); // Save the current date in state to be able to trigger an update

  React.useEffect(() => {
    const timer = setInterval(() => {
      // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, []);

  function date() {
    const day = today.toLocaleDateString(locale, { weekday: "long" });
    const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(
      locale,
      {
        month: "long",
      }
    )}`;
    return date;
  }

  function wish() {
    const hour = today.getHours();
    const wish = `Good ${
      (hour < 12 && "morning") || (hour < 17 && "afternoon") || "evening"
    }, `;
    return wish;
  }

  function time() {
    const time = today.toLocaleTimeString(locale, {
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
    return time;
  }

  return {
    date,
    time,
    wish,
  };
}
