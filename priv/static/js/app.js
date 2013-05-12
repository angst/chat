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
	}
})

App.IndexRoute = Ember.Route.extend({
	model: function() {
		return App.Message.all();
	}
})

// App.Router.map(function() {
//   // put your routes here
// });

App.IndexController = Ember.ArrayController.extend({
	send: function() {
		App.Message.add("you", this.get("newMessage"));
		this.set('newMessage', '');
	}
})