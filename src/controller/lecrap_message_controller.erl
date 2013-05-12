-module(lecrap_message_controller, [Req]).
-compile(export_all).

index('GET', []) ->
    Messages = [
    	{struct, [{id, 1},
    	          {author, <<"jesse">>},
    	          {text, <<"hi, whats up">>}]},
    	{struct, [{id, 2},
    	          {author, <<"manish">>},
    	          {text, <<"no much!">>}]}
    ],
    {output,
    mochijson2:encode({struct, [{messages, Messages}]}),
    [{"Content-Type", "application/json"}]
    }.