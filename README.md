Le Crap
=======

A learning project that combines

 * chicago boss (erlang server side framework)
 * ember.js (client side js)
 * bootstrap / flat-ui (ui style)

The goal is to use advanced features of erlang to have a realtime messaging system (probably websockets) for chat

Install
-------

Install Erlang: `apt-get install -y erlang`

Install Chicago Boss:

    cd ..
    wget http://www.chicagoboss.org/ChicagoBoss-0.8.6.tar.gz
    tar -zxvf ChicagoBoss-0.8.6.tar.gz
    cd ChicagoBoss-0.8.6
    ./rebar compile

Run our app:

    cd ../lecrap
    ./rebar compile
    ./init-dev.sh

Visit http://localhost:8003/ in your browser

NGINX
-----

If you want to put chicago boss behind nginx, you will need need a recent
version (at least 1.3.13) that supports websockets.

    server {
      server_name lechat.example.com;
      listen 80;

      location / {
        proxy_pass http://localhost:8003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
      }
    }


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
