$('#login-name').focus()

function emberize() {

  userName = $('#login-name').val();
  if (userName == '') return;

  $('#ember-app').html("<div id='chat-list'></div>")

  Message = Backbone.Model.extend({
    idAttribute: '_id'
  })

  ChatRoom = Backbone.Collection.extend({
    model: Message,
    initialize: function() {
      console.log('msglist.initialize');
    }
  });

  ChatView = Backbone.View.extend({
    tagName: 'ul',
    events: {
      'change input': 'postText',
    },
    initialize: function() {
      this.collection.on('add', this.renderOne, this);

      _.bindAll(this, 'render', 'renderOne');
      if (this.model) {
        this.model.on('change', this.render, this);
      }
    },
    postText: function(o) {
      console.log('postText', o)
      var text = o.target.value;
      if (text) {
        ws.send(JSON.stringify({message: {author: userName, text: text}}));
        o.target.value = '';
      }
    },
    addMessage: function(id, author, text) {
      this.chatlist.add({_id: id, author: author, text: text});
    },
    render: function() {
      console.log('chatview.render')
      this.$el.append('<input type="text" />');
      this.collection.each(this.renderOne);
      return this;
    },
    renderOne: function(model) {
      console.log('chatview.renderOne', model);
      var msg = new MsgView({model: model});
      this.$el.append(msg.render().$el);
      return this;
    }
  });

  MsgView = Backbone.View.extend({
    events: {},
    initialize: function() {
      console.log('msgview.init', this.model)
      this.listenTo(this.model, 'change', this.render);
    },
    model: Message,
    render: function() {
      console.log('msgview.render', this.model)
      this.$el.html('<li>'+this.model.escape('author')+': '+this.model.escape('text')+'</li>')
      return this;
    }

  })

  room = new ChatRoom();
  view = new ChatView({collection: room });
  $('#chat-list').append(view.render().el);

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
        room.add(d.message);
      }
    }
    // FIXME(ja): use exponential backoff?
    ws.onerror = function(e) { console.log('error', e); };
    ws.onclose = function(e) { setTimeout(live, 1000); };
  }

  live();

}