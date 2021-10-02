import "./styles.css";
import React, { useState, useEffect } from "react";

import tomato from "./tomato.png";

import { processTweet } from "./marketingLogic";
import { useDebounce } from "./utils/stateHooks";

const bigtweet =
  "Lorem #tomato dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim";

export default function App() {
  const [tweet, setTweet] = useState(bigtweet);
  const [processedTweet, setProcessedTweet] = useState(tweet);

  const debouncedTweet = useDebounce(tweet, 500);

  useEffect(() => {
    const asyncSetProcessedTweet = async () => {
      const currentProcessedTweet = await processTweet(debouncedTweet);
      setProcessedTweet(currentProcessedTweet);
    };
    asyncSetProcessedTweet();
  }, [debouncedTweet]);

  const onChange = (event) => {
    setTweet(event.target.value);
  };

  return (
    <div className="App">
      <marquee>
        <img className="tomato" src={tomato} alt="drawing of a tomato" />
        Welcome to Tomato Tweet Machine!
        <img className="tomato" src={tomato} alt="drawing of a tomato" />
      </marquee>
      Text to tweetify:
      <textarea id="input" value={tweet} onChange={onChange}></textarea>
      <br />
      Tweetified text:
      <div id="output">{processedTweet}</div>
    </div>
  );
}
