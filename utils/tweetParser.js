var axios = require('axios');
var Sentiment = require('sentiment');
var moment = require('moment');
const db = require('../models/index');
const dbTweet = db.sequelize.models.tweet;

var sentiment = new Sentiment();
let count = 0;
let timeout = null;

module.exports = async function (fromMomentDate) {
  if (!fromMomentDate) fromMomentDate = moment().add(-7, 'days');
  count = 0;
  fetchTweets(fromMomentDate);
}

async function fetchTweets (fromMomentDate, tweets=[]) {
  timeout = setTimeout(() => {
    console.log('fetching');
    count = 0;
    fetchTweets(fromMomentDate);
  }, 15 * 60 * 1000)

  let max_id = null;
  if (tweets.length != 0) max_id = tweets.pop().id
  
  let since_id = null;
  let lastTweet = await dbTweet.findOne({
    order: [ [ 'date', 'DESC' ]],
  });
  if (lastTweet) since_id = lastTweet.tweetId;
  
  axios.get('https://api.twitter.com/1.1/search/tweets.json', {
    params: {
      q: '@hermesparcels',
      result_type: 'recent',
      count: 100,
      tweet_mode: 'extended',
      max_id,
      since_id
    },
    headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER_TOKEN}` }
  })
  .then(function (response) {
    // console.log(response);
    let data = response.data;
    if (data.statuses && data.statuses.length > 0) {
      // tempTweets = [...data.statuses];
      // tempTweets.shift();
      tweets = tweets.concat(data.statuses);
      let firstTweetTime = moment(tweets[tweets.length-1].created_at);
      if (count < 100 && data.statuses.length == 100 && firstTweetTime.isAfter(moment(fromMomentDate))) {
        count++;
        console.log(count);
        fetchTweets(fromMomentDate, tweets)
      } else analyzeData(tweets);
    }
    else analyzeData(tweets);
  })
  .catch(function (error) {
    console.log(error);
    analyzeData(tweets);
  })
  .then(function () {
    // always executed
  });
}

function analyzeData(tweets) {
  if (tweets.length == 0) return;
  // let firstTweetTime = moment(tweets[tweets.length-1].created_at);
  // var startMinute = 30 * Math.floor( moment(firstTweetTime).minute() / 30 );
  // var startTime = moment(firstTweetTime).set({minute: startMinute, second: 0, millisecond:0});
  // var tweetData = {};
  // var dates = [];
  let dbTweets = [];
  // [dates, tweetData] = fillDates(dates, tweetData, startTime);
  for (let i = tweets.length - 1; i >= 0; i--) {
    if (tweets[i].user.screen_name == 'hermesparcels') continue;
    /* [dates, tweetData] = fillDates(dates, tweetData, moment(tweets[i].created_at));
    let lastDate = dates[dates.length - 1];
    tweetData[lastDate].count += 1;
    tweetData[lastDate].cumulativeSentiment += analyzeSentiment(tweets[i].full_text); */
    dbTweets.push({
      tweetId: tweets[i].id,
      userId: tweets[i].user.id,
      user: tweets[i].user.screen_name,
      tweet: tweets[i].full_text,
      date: moment(tweets[i].created_at),
      sentiment: analyzeSentiment(tweets[i].full_text)
    })
  }
  dbTweet.bulkCreate(dbTweets, { ignoreDuplicates: true });
}

function fillDates(dates, tweetData, newDate) {
  if (dates.length == 0) { 
    dates.push(newDate.unix())
    tweetData[newDate.unix()] = { count: 0, cumulativeSentiment: 0};
  } else {
    let lastDate = moment.unix(dates[dates.length - 1]);
    let whileStop = 1000;
    while (moment(newDate).isAfter(moment(lastDate).add(30, 'minutes')) && whileStop > 0) {
      dates.push(moment(lastDate).add(30, 'minutes').unix());
      if (!tweetData[dates[dates.length - 1]]) tweetData[dates[dates.length - 1]] = { count: 0, cumulativeSentiment: 0};
      lastDate = moment.unix(dates[dates.length - 1]);
      whileStop--;
    }
  }
  return [dates, tweetData];
}

function analyzeSentiment(tweet){
  let result = sentiment.analyze(tweet);
  return result.comparative == 0 ? 0 : Math.abs(result.comparative)/result.comparative;
}