Le Crap
=======

A learning project that combines

 * chicago boss (erlang server side framework)
 * ember.js (client side js)
 * bootstrap / flat-ui (ui style)

The goal is to use advanced features of erlang to have a realtime messaging system (probably websockets) for chat

Resources
---------

 * http://eviltrout.com/2013/03/23/ember-without-data.html (ember without ember-data)
 * http://www.evanmiller.org/chicago-boss-tutorial.pdf - pretty solid tutorial
 * http://www.freemindsystems.com/blog/post/eunit-testing-with-erlang-and-chicago-boss - testing the boss

Issues
------

 * the models know way to much about websockets... should publish to boss_mq
 * add concept of users
 * messages should be added in pending state on client after hitting return, then updated after sent
 * timestamps for messages
