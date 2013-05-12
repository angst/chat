-module(message, [Id, Author, Text]).
-compile(export_all).

after_create() ->
  % FIXME(ja): this knows way too much.. should use boss_mq
  boss_websocket_router:incoming(<<"/websocket/chat">>,
  	                             wtf,
  	                             wtf,
  	                             mochijson:encode({struct, THIS:attributes()})).