import { languageGuesser } from "./utils/detectLanguage";

const TWEET_LIMIT = 140;

const TOMATO_VARIATIONS = {
  en: "#tomato",
  fr: "#tomate",
  nl: "#tomaat",
  it: "#pomodoro",
  pl: "#pomidor",
};

function buildTomatoRegexp() {
  const matcher = Object.values(TOMATO_VARIATIONS).reduce(
    (acc, it, currentIndex) => {
      if (currentIndex === 0) return `${it}`;
      return `${acc}|${it}`;
    },
    ""
  );

  return new RegExp(matcher, "i");
}

function getLanguage(tweet) {
  let language = "en";
  const tomatoRegexp = buildTomatoRegexp();

  const matchedHashtag = tweet.match(tomatoRegexp);

  if (matchedHashtag) {
    const matchedHashtagValue = matchedHashtag[0].toLowerCase();
    const variation =
      Object.values(TOMATO_VARIATIONS).indexOf(matchedHashtagValue);

    return Object.keys(TOMATO_VARIATIONS)[variation];
  }

  languageGuesser.info(tweet, (info) => {
    console.log(info);
    const match = Object.keys(TOMATO_VARIATIONS).some((lg) => lg === info[0]);
    if (match) {
      language = info[0];
    }
  });

  return language;
}

function getIsOnBrand(tweet, regexp) {
  return regexp.test(tweet);
}

function onBrandProcess({ tweet, regexp, keyword, isWithinLimit }) {
  const keywordPosition = tweet.search(regexp);
  let processedTweet = "";
  const isKeywordOverflowing = keywordPosition >= TWEET_LIMIT - keyword.length;

  /*
    POSSIBLE CASES FOR ON BRAND PROCESSING:
    1 - THE TWEET IS WITHIN THE TWEET LIMIT 
      * ACTION : DO NOTHING
    2 - THE TWEET EXCEEDS THE LIMIT:
      2.1 - THE KEYWORD OVERFLOWS THE TWEET LIMIT (IS PRESENT AFTER OR BEGINS "CROSSES" THE CHARACTER LIMIT) 
        * ACTION: TRUNCATE THE TWEET TO ACCOMODATE THE KEYWORD AT THE END
      2.2 - THE KEYWORD DOESN'T OVERFLOW THE TWEET LIMIT
        * ACTION: TRUNCATE THE TWEET AT THE POSSIBLE LIMIT
  */
  if (isWithinLimit) {
    return tweet;
  }

  if (isKeywordOverflowing) {
    processedTweet =
      // +1 to account for space
      tweet.slice(0, TWEET_LIMIT - (keyword.length + 1)) + ` ${keyword}`;
    return processedTweet;
  }

  return tweet.slice(0, TWEET_LIMIT);
}

function offBrandProcess({ tweet, language, isWithinLimit, keyword }) {
  let processedTweet = tweet;
  if (isWithinLimit) {
    processedTweet += ` ${TOMATO_VARIATIONS[language]}`;
    return processedTweet;
  }

  processedTweet = `${tweet.substr(0, 132).trim()} ${keyword}`;
  return processedTweet;
}

async function addHashtag(tweet) {
  const language = getLanguage(tweet);
  const regexp = new RegExp(`${TOMATO_VARIATIONS[language]}`, "i");
  const isOnBrand = getIsOnBrand(tweet, regexp);
  const keyword = TOMATO_VARIATIONS[language];
  const isWithinLimit = tweet.length <= TWEET_LIMIT;

  const processingPayload = {
    tweet,
    language,
    regexp,
    isOnBrand,
    keyword,
    isWithinLimit,
  };

  if (isOnBrand) {
    return onBrandProcess(processingPayload);
  }

  return offBrandProcess(processingPayload);
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
