$('#login-name').focus()

function bb() {

  userName = $('#login-name').val();
  if (userName == '') return;

  Message = Backbone.Model.extend({});

  ChatRoom = Backbone.Collection.extend({
    model: Message
  });

  ChatView = Backbone.View.extend({
    tagName: 'ul',
    events: {
      'change input': 'postText',
    },
    initialize: function() {
      this.collection.on('add', this.renderOne, this);
      _.bindAll(this, 'render', 'renderOne');
    },
    postText: function(o) {
      var text = o.target.value;
      if (text) {
        // FIXME(ja): the use of view.last & author for status is pretty ghetto
        this.collection.add({author: 'sending...', text: text});
        this.last = this.collection.last()
        ws.send(JSON.stringify({message: {author: userName, text: text}}));
        o.target.value = '';
      }
    },
    render: function() {
      this.$el.append('<input type="text" />');
      this.collection.each(this.renderOne);
      return this;
    },
    renderOne: function(model) {
      var msg = new MsgView({model: model});
      this.$el.append(msg.render().$el);
    }
  });

  MsgView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },
    model: Message,
    render: function() {
      this.$el.html('<li>'+this.model.escape('author')+': '+this.model.escape('text')+'</li>')
      return this;
    }
  });

  room = new ChatRoom();
  view = new ChatView({collection: room});
  $('#bb-app').html(view.render().el);
  $('input').focus();


  function live() {
    var loc = window.location;
    var ws_url;

    if (loc.protocol === "https:") {
      ws_url = "wss:";
    } else {
      ws_url = "ws:";
    }
    ws_url += "//" + loc.host;
    ws_url += "/websocket/chat";
    ws = new WebSocket(ws_url, "chat");

    ws.onmessage = function(event) {
      var d = JSON.parse(event.data);
      if (d.message) {
        if (view.last && d.message.text == view.last.get('text')) {
          view.last.set('author', d.message.author);
          view.last.set('id', d.message.id);
          view.last = null;
        } else {
          room.add(d.message);
        }
      }
    }
    // FIXME(ja): use exponential backoff?
    ws.onerror = function(e) { console.log('error', e); };
    ws.onclose = function(e) { setTimeout(live, 1000); };
  }

  live();

}