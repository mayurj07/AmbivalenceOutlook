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

Optionally, install the [Compass](http://compass-style.org/) Ruby Gem.

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