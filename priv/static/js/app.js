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
  post: function(text) {
    $.post('/messages', {author: 'you', text: text}).then(function(d) {
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
});

App.IndexController = Ember.ArrayController.extend({
  send: function() {
    // FIXME(ja): we should update the client side as soon as we type
    // but with a state of "sending" until it is recv'd
    App.Message.post(this.get("newMessage"));
    this.set('newMessage', '');
  }
});

// setInterval(App.Message.findAll, 1000);

ws = new WebSocket("ws://localhost:8001/websocket/chat", "chat");

ws.onmessage = function(event) {
  var d = JSON.parse(event.data);
  App.Message.add(d.id, d.author, d.text);
}


