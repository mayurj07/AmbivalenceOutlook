var sentiment = require('sentiment');
var Twit = require('twit');
var Pubnub = require('pubnub');
var fs = require('fs');
var nconf = require('nconf');

nconf.file({file: 'config.json'}).env();

TweetPublisher = {};

var twitter = TweetPublisher.twitter = new Twit({
    consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
    access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
    access_token_secret: nconf.get('TWITTER_TOKEN_SECRET')
});

var pubnub = TweetPublisher.pubnub = Pubnub({
    publish_key: nconf.get('PUBNUB_PUBLISH_KEY'),
    subscribe_key: nconf.get('PUBNUB_SUBSCRIBE_KEY')
});

var stream, cachedTweet, publishInterval;

var love_count = 0;
var hate_count = 0;
var love_percent = 0;
var hate_percent = 0;
var total = 0;

/**
 * Starts Twitter stream and publish interval
 */
TweetPublisher.start = function () {

    var response = {};

    // If the stream does not exist create it
    if (!stream) {

        // Connect to stream and filter by a geofence that is the size of the Earth
        stream = twitter.stream('statuses/filter', {
            track: ['love', 'hate'],
            locations: '-180,-90,180,90',
            language: 'en'
        });
        //stream = twitter.stream('statuses/filter', { locations: '-180,-90,180,90' } );

        // When Tweet is received only process it if it has geo data
        stream.on('tweet', function (tweet) {
            // calculate sentiment with "sentiment" module
            tweet.sentiment = sentiment(tweet.text);

            //console.log(tweet.text + '\n');

            // save the Tweet so that the very latest Tweet is available and can be published
            cachedTweet = tweet
        });

        response.message = 'Stream created and started.'
    }
    // If the stream exists start it
    else {
        stream.start();
        response.message = 'Stream already exists and started.'
    }

    // Clear publish interval just be sure they don't stack up (probably not necessary)
    if (publishInterval) {
        clearInterval(publishInterval);
    }

    // Only publish a Tweet every 100 millseconds so that the browser view is not overloaded
    // This will provide a predictable and consistent flow of real-time Tweets
    publishInterval = setInterval(function () {
        if (cachedTweet) {
            publishTweet(cachedTweet);
        }
    }, 100); // Adjust the interval to increase or decrease the rate at which Tweets sent to the clients

    return response;
}


/**
 * Stops the stream and publish interval
 **/
TweetPublisher.stop = function () {

    var response = {};

    if (stream) {
        stream.stop();
        clearInterval(publishInterval);
        response.message = 'Stream stopped.'
    }
    else {
        response.message = 'Stream does not exist.'
    }

    return response;
}

var lastPublishedTweetId;

/**
 * Publishes Tweet object through PubNub to all clients
 **/
function publishTweet(tweet) {

    if (tweet.id == lastPublishedTweetId) {
        return;
    }

    lastPublishedTweetId = tweet.id;

    pubnub.publish({
        post: false,
        channel: 'tweet_stream',
        message: tweet,
        callback: function (details) {
            // success
        }
    });

    updateCount(tweet, function(ambivalence){

        //Sending count, image, tweet and percentage to pubnub client
        pubnub.publish({
            post: false,
            channel: 'tweet_message',
            message: ambivalence,
            callback: function (details) {
                // success
            }
        });
    });
}


function updateCount(tweet, cb) {

    if (tweet['text'].toLowerCase().indexOf('love') >= 0) {
        love_count += 1;
    }
    if (tweet['text'].toLowerCase().indexOf('hate') > -1) {
        hate_count += 1;
    }
    total = love_count + hate_count;
    love_percent = Math.round((love_count / total) * 100);
    hate_percent = Math.round((hate_count / total) * 100);

    var message = {
        l_count: love_count,
        h_count: hate_count,
        l_percent: love_percent,
        h_percent: hate_percent,
        total: total,
        text: tweet.text,
        name: tweet.user.screen_name,
        url: tweet.user.profile_image_url
    };

    cb(message);
}

module.exports = TweetPublisher;