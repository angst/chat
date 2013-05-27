$('#login-name').focus()

function emberize() {

  userName = $('#login-name').val();
  if (userName == '') return;

  $('#ember-app').html("<ul id='chat-list'></ul><input type='text' id='input' /><button id='add-input' />")

  $('#input').focus();

  Chat = Backbone.Model.extend({
    idAttribute: '_id'
  })

  ChatList = Backbone.Collection.extend({
    model: Chat,
    initialize: function() {
      console.log('chatlist.initialize')
    }
  });

  ChatView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'change #input': 'postText',
    },
    initialize: function() {
      this.chatlist = new ChatList;
      _.bindAll(this, 'render');
      var inst = this;
      this.chatlist.bind('add', function(model) {
        inst.render(model);
      });
    },
    postText: function(o) {
      var text = o.target.value;
      if (text) {
        ws.send(JSON.stringify({message: {author: userName, text: text}}));
        o.target.value = '';
      }
    },
    addMessage: function(id, author, text) {
      this.chatlist.add({_id: id, author: author, text: text});
    },
    render: function(model) {
      $('#chat-list').append('<li>'+model.escape('author')+': '+model.escape('text')+'</li>')
    }
  });

  view = new ChatView({el: 'body'});


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
        view.addMessage(d.message.id,
                        d.message.author,
                        d.message.text);
      }
    }
    // FIXME(ja): use exponential backoff?
    ws.onerror = function(e) { console.log('error', e); };
    ws.onclose = function(e) { setTimeout(live, 1000); };
  }

  live();

}