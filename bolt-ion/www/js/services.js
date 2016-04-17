angular.module('starter.services', [])



.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Jaime Acevedo',
    lastText: 'Just finised your task!',
    face: 'img/jaime.jpg'
  }, {
    id: 2,
    name: 'Adrian Rodriguez',
    lastText: 'Where do I drop off your groceries?',
    face: 'img/adrian.jpg'
  }, {
    id: 3,
    name: 'Martin Di Diego',
    lastText: 'I heard you needed a fixed computer..',
    face: 'img/martin.jpg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'I love Bolt!',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
