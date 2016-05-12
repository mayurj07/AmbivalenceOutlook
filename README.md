CMPE 280 Project - Ambivalence Outlook
==========

It is based on the idea of creating a real time Tweet visualization in 3-D.
This web app attaches to the Twitter API stream/filter and runs rudimentary sentiment analysis on Tweets with geo data.
Tweets are published via PubNub Web sockets and plotted on to a 3D globe.
It is inspired from WebGL Globe Chrome Experiment and the PubNub Real-Time WebGL Visualization.
A real-time 3D visualization of Tweets from around the world.


Installing and Running
----

Install [Node.js](http://nodejs.org/).

Clone GitHub repo:

```
https://github.com/mayurj07/AmbivalenceOutlook
```

Install the [Compass](http://compass-style.org/) Ruby Gem.

```
gem install compass
```


Install node module dependencies:

```
npm install
```

Run application:

```
npm start
```

Go to [http://localhost:3000](http://localhost:3000) in your browser.


Project Screenshots:
----

Homepage:

![alt tag](https://github.com/mayurj07/AmbivalenceOutlook/blob/master/screenshots/Home.png)

WebGL Globe: The screenshot represents the live tweets with the nature of the tweets on WebGL Globe with the sentiment score. 
             The strand base color is set according to the sentiment score
  a. When tweet.sentiment.score < 0
     Color = Red

  b. When tweet.sentiment.score > 0  
     Color = Yellow;

  c. When tweet.sentiment.score = 0  
     Color = White; 

![alt tag](https://github.com/mayurj07/AmbivalenceOutlook/blob/master/screenshots/globe.png)

Tweets with Liquid Fill Gauge: As the user clicks on Tweets tab it will display detailed description about the tweet. 
                               It is also displaying Count of Tweets with 'Love', Count of Tweets with ‘Hate’, Percentage of Tweets with 'Love', Percentage of Tweets with ‘Hate’ and the total count of the tweets with the help of Liquid Fill Gauge.

![alt tag](https://github.com/mayurj07/AmbivalenceOutlook/blob/master/screenshots/gauge.png)

Heat Map

![alt tag](https://github.com/mayurj07/AmbivalenceOutlook/blob/master/screenshots/HeatMap.png)

![alt tag](https://github.com/mayurj07/AmbivalenceOutlook/blob/master/screenshots/Heatmap2.png)



