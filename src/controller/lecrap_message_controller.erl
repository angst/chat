-module(lecrap_message_controller, [Req]).
-compile(export_all).

index('GET', []) ->
    Msgs = boss_db:find(message, []),
    {json, [{messages, [Msg:attributes() || Msg <- Msgs]}]};

index('POST', []) ->
    Msg = message:new(id, Req:post_param("author"), Req:post_param("text")),
    case Msg:save() of
        {ok, SavedMsg} ->
            {json, [{message, SavedMsg:attributes()}]};
        {error, Errors} ->
            {json, [{errors, Errors}]}
    end.
