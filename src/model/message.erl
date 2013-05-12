-module(message, [Id, Author, Text]).
-compile(export_all).

after_create() ->
  boss_mq:push("new-messages", THIS).
