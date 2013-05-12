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
  }
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		return App.Message.all();
	},
});

App.IndexController = Ember.ArrayController.extend({
	send: function() {
		App.Message.add("you", this.get("newMessage"));
		this.set('newMessage', '');
	}
});

setInterval(App.Message.findAll, 1000);
