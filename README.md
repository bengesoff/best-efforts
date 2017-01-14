Finding the best time for a distance from a GPX file
====================================================

Strava shows you your "Best Efforts" after an activity for various distances such as 400m, 1k, 1 mile, 5k etc, alongside your segments. After running a 5k, this allows you to clearly see what your best 5k time from the run was, even if you ran further than that. For example, if you ran 5.1k, you can still see what your best 5k time was. I am unsure if any other services provide this information.

On the other hand, RunKeeper does not provide this information. Instead, it will only give you the total recorded distance for the whole activity and the time elapsed between pressing start and stop. Obviously the easy answer would be to just keep using Strava, but I have just started using RunKeeper because it works with my Pebble watch and I would like to make it work for me.

This project is the beginnings of a web app that takes the exported GPX from RunKeeper and tells me my "Best Efforts". Currently it has a manky UI and is hardcoded for a 5k instead of providing option for different distances, but with my limited test from my only RunKeeper activity, it works.

Planning to improve it.

Uses the [mapbox/togeojson](https://github.com/mapbox/togeojson).
Inspired by [Roy van Rijn](http://royvanrijn.com/blog/2014/02/hacking-runkeeper-data/).
