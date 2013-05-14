App = Ember.Application.create({
  'rootElement': '#ember-app'
});

App.Message = Ember.Object.extend({
  id: null,
  author: null,
  text: null
});

App.Message.reopenClass({
  collection: [],
  collection_by_id: {},
  all: function() {
    return this.collection;
  },
  add: function(id, author, text) {
    // FIXME(ja): should I really have to check manually - no magic?
    if (this.collection_by_id[id]) {
      var msg = this.collection_by_id[id];
      msg.set('author', author);
      msg.set('text', text);
      return;
    }
    var msg = App.Message.create({
      id: id,
      author: author,
      text: text
    });

    this.collection.pushObject(msg);
    this.collection_by_id[msg.id] = msg;
  },
  findAll: function() {
    $.getJSON('/messages').then(function(response) {
      if (response.messages) {
        response.messages.forEach(function(data) {
          App.Message.add(data.id, data.author, data.text);
        })
      }
    });
  },
  post: function(author, text) {
    $.post('/messages', {author: author, text: text}).then(function(d) {
      // FIXME(ja): instead of adding, this should update the state of a 
      // sent message... then we can rely on the websocket below for the action
      if (d.message) {
        App.Message.add(d.message.id, 
                        d.message.author,
                        d.message.text);
      } else {
        console.log(d);
      }
    });
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Message.all();
  },
  init: function() {
    this._super();
    App.Message.findAll();
  }
});

App.IndexController = Ember.ArrayController.extend({
  send: function() {
    // FIXME(ja): we should update the client side as soon as we type
    // but with a state of "sending" until it is recv'd
    App.Message.post(this.get("userName"), this.get("newMessage"));
    this.set('newMessage', '');
  }
});

function live() {
  var loc = window.location
    , ws_url;

  if (loc.protocol === "https:") {
    ws_url = "wss:";
  } else {
    ws_url = "ws:";
  }
  ws_url += "//" + loc.host;
  ws_url += ':' + loc.port;
  ws_url += "/websocket/chat";
  ws = new WebSocket(ws_url, "chat");

  ws.onmessage = function(event) {
    var d = JSON.parse(event.data);
    App.Message.add(d.id, d.author, d.text);
  }
  // FIXME(ja): use exponential backoff?
  ws.onerror = function(e) { console.log('error', e); };
  ws.onclose = function(e) { setTimeout(live, 1000); };
}

live();
