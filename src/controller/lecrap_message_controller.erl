-module(lecrap_message_controller, [Req]).
-compile(export_all).

index('GET', []) ->
    Messages = [
    	[{id, 1},
    	          {author, <<"jesse">>},
    	          {text, <<"hi, whats up">>}],
    	[{id, 2},
    	          {author, <<"manish">>},
    	          {text, <<"no much!">>}]
    ],
    {json, [{messages, Messages}]}.