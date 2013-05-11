-module(lecrap_main_controller, [Req]).
-compile(export_all).

home('GET', []) ->
	{ok, []}.
