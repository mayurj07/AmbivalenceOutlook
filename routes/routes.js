    var express = require('express');
    var router = express.Router();
    var nconf = require('nconf');
    var tweetPublisher = require('./tweet-publisher');
    var path = require('path');


    /**
     * Defines app routes
     */

    router.get('/', function (req, res) {
        var filepath = path.join(__dirname, '../public/main.html');
        res.sendFile(filepath);
    });


    router.get('/globe', function (req, res) {

        // start stream and publishing
        tweetPublisher.start();
        var filepath = path.join(__dirname, '../public/globe');

        // Render PubNub config for client-side javascript to reference
        res.render(filepath, {
            subscribe_key: nconf.get('PUBNUB_SUBSCRIBE_KEY'),
            channel: 'tweet_stream',
            ga_tracking_id: nconf.get('GA_TRACKING_ID')
        });

    });


    router.get('/tweets', function (req, res) {
        var filepath = path.join(__dirname, '../public/ambivalence');

        // Render PubNub config for client-side javascript to reference
        res.render(filepath, {
            subscribe_key: nconf.get('PUBNUB_SUBSCRIBE_KEY'),
            channel: 'tweet_message'
        });
    });


    router.get('/heatmap', function (req, res) {
        var filepath = path.join(__dirname, '../public/heatmap');
        res.render(filepath);
    });


    /**
     * Defines upgrade page route
     */
    router.get('/upgrade', function (req, res) {
        res.render('upgrade');
    });

    /**
     * GET Starts stream
     */
    router.get('/stream/start', function (req, res) {
        res.send(tweetPublisher.start());
    });

    /**
     * GET Stops stream
     */
    router.get('/stream/stop', function (req, res) {
        res.send(tweetPublisher.stop());
    });

    /*
    var trends, trendsTimestamp;

    /!**
     * GET Returns trends from Twitter trends API
     *!/
    router.get('/trends', function (req, res) {

        var now = moment();

        // Only allow request to trends API every 2 minutes to stay within rate limits
        if (trends && trendsTimestamp.diff(now, 'minutes') < 2) {
            // return trends from memory
            res.send(trends);
            return;
        }

        tweetPublisher.twitter.get('trends/place', {id: 1}, function (err, data, response) {

            if (err) {
                res.send(err);
                return;
            }

            trends = data[0].trends;
            trendsTimestamp = moment();

            res.send(trends);
        });
    });*/

    module.exports = router;
