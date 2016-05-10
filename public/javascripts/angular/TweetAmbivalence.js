var app = angular.module('TweetAmbivalence', ['ngResource', 'pubnub.angular.service']);

app.controller('TweetChart', function ($scope, $resource, $timeout, $rootScope, PubNub) {

    /**
     *  Initializes PubNub websocket connection
     */
    $scope.init = function () {
        $scope.tweets = [];
        var cachedLovePercent, cachedHatePercent;

        PubNub.init({
            subscribe_key: pubnubConfig.subscribe_key,
            ssl: location.protocol == 'https:'
        });

        PubNub.ngSubscribe({channel: pubnubConfig.channel});

        $rootScope.$on(PubNub.ngMsgEv(pubnubConfig.channel), function (event, payload) {

            var data = payload.message;

            $('#total').html('<h1>' + data.total + '</h1>');

            // Updates the Left column with statistics and tweets with love.
            if (data['text'].toLowerCase().indexOf('love') >= 0) {

                // Shows last 10 love tweets
                if ($('#lbody div').size() > 10) {
                    $('#lbody div:last').remove();
                }
                // Updates image and love tweets
                $('#lbody').prepend('<div><h5>' + '<img src="' + data.url + '">' + '<b> ' + data.name + '</b>' + data['text'] + '</h5></div>');
                // Updates the number of love tweets
                $('#lcount').html('<h4>' + data.l_count + '</h4>');
                // Updates the percentage of love tweets
                //$('#lpercent').html('<h4>' + data.l_percent + '</h4>');

                if(cachedLovePercent != data.l_percent){

                    cachedLovePercent = data.l_percent;
                    var config1 = liquidFillGaugeDefaultSettings();
                    config1.circleColor = "#00D2FF";
                    config1.textColor = "#000000";
                    config1.waveTextColor = "#000000";
                    config1.waveColor = "#73dff6";
                    config1.circleThickness = 0.2;
                    config1.textVertPosition = 0.2;
                    var gauge1 = loadLiquidFillGauge("fillLoveGauge", cachedLovePercent, config1);

                }
            }

            // Updates the right column with statistics and tweets with hate
            if (data['text'].toLowerCase().indexOf('hate') >= 0) {

                // Shows last 10 hate tweets
                if ($('#hbody div').size() > 10) {
                    $('#hbody div:last').remove();
                }
                // Updates image and hates tweets
                $('#hbody').prepend('<div><h5>' + '<img src="' + data.url + '">' + '<b> ' + data.name + '</b>' + data['text'] + '</h5></div>');
                // Updates the number of hate tweets
                $('#hcount').html('<h4>' + data.h_count + '</h4>');
                // Updates percentage of hate tweets
                //$('#hpercent').html('<h4>' + data.h_percent + '</h4>');

                if(cachedHatePercent != data.h_percent){

                    cachedHatePercent = data.h_percent;
                    var config2 = liquidFillGaugeDefaultSettings();
                    config2.circleColor = "#FF0000";
                    config2.textColor = "#000000";
                    config2.waveTextColor = "#000000";
                    config2.waveColor = "#FD9C9C";
                    config2.circleThickness = 0.2;
                    config2.textVertPosition = 0.2;
                    var gauge2 = loadLiquidFillGauge("fillHateGauge", cachedHatePercent, config2);

                }
            }

        });

    };

    $scope.init();

});
