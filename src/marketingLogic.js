import { useState, useEffect } from "react";

async function addHashtag(tweet) {
  let processedTweet = tweet;

  if (!/#Tomato/i.test(tweet)) {
    if (tweet.length >= 132) {
      processedTweet = tweet.substr(0, 132).trim();
    }
    processedTweet += " #Tomato";
  }
  setTimeout(() => {}, 500);

  return processedTweet;
}

function randomizeDelay() {
  return Math.floor(Math.random() * (2000 + 1));
}

export function processTweet(tweet) {
  if (!tweet) {
    return "";
  }

  return new Promise((resolve) => {
    const delay = randomizeDelay();
    setTimeout(() => {
      resolve(addHashtag(tweet));
    }, delay);
  });
}
