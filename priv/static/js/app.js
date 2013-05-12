App = Ember.Application.create({
	'rootElement': '#ember-app'
});

App.Message = Ember.Object.extend({
	author: null,
	text: null
});

App.Message.reopenClass({
	collection: [],
	all: function() {
		return this.collection;
	},
	add: function(author, text) {
		var msg = App.Message.create({
			author: author,
			text: text
		});

		this.collection.pushObject(msg);
	},
  findAll: function() {
    return $.getJSON('/messages').then(function(response) {
      var messages = [];
      if (response.messages) {
        response.messages.forEach(function(data) {
          App.Message.add(data.author, data.text);
        })
      }
      // console.log(messages);
      return messages;
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
		App.Message.add("you", this.get("newMessage"));
		this.set('newMessage', '');
	}
});
