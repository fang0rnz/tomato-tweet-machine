import "./styles.css";
import React, { useState, useEffect, useRef } from "react";

import { processTweet } from "./marketingLogic";
import { useDebounce } from "./utils/stateHooks";
import TextArea from "./components/TextArea/TextArea";

export default function App() {
  const [tweet, setTweet] = useState("");
  const [processedTweet, setProcessedTweet] = useState(tweet);
  const outputRef = useRef();

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
      <div className="container">
        <div className="subTitle">Text to tweetify:</div>
        <TextArea
          name="Tweet input"
          tabIndex="1"
          id="input"
          value={tweet}
          onChange={onChange}
        />
        <br />
        <div className="subTitle">Tweetified text:</div>
        <div
          ref={outputRef}
          onFocus={() => {
            navigator.clipboard.writeText(processedTweet);
          }}
          tabIndex="2"
          data-testid="output"
          id="output"
        >
          {processedTweet}
        </div>
        <span></span>
      </div>
    </div>
  );
}
