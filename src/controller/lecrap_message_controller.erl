-module(lecrap_message_controller, [Req]).
-compile(export_all).

index('GET', []) ->
    Messages = [
    	{struct, [{author, <<"jesse">>},
    	          {text, <<"hi, whats up">>}]},
    	{struct, [{author, <<"manish">>},
    	          {text, <<"no much!">>}]}
    ],
    {output,
    mochijson2:encode({struct, [{messages, Messages}]}),
    [{"Content-Type", "application/json"}]
    }.