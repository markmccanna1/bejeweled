var jewel = {}

importScripts('board.js')


addEventListener('message', function(event) {
  var board = jewel.board, 
  message = event.data

  //when the worker recieves the initialize command, data must contain the settings object
  //from the jewel 
  // when the worker finishes setting up the board, ot calls its own callback function, which posts
  // a message back to the board module
  switch (message.command) {
    case 'initialize': 
      jewel.settings = message.data
      // this sends the worker's callback function to the board module, where its called later
      board.initialize(callback)
    break
    case 'swap':
      board.swap(message.data.x1,
                 message.data.y1,
                 message.data.x2,
                 message.data.y2,
                 callback)
    break
  }

  //when the callback function is called, the data paramater is sent to the main thread as a message
  //the callback is called when the message is received by the main thread
  //to handle this callback, you need to keep track of the messages posted to the worker
  //whenever a message is posted to the worker, the callback is saved in the callbacks array

  function callback(data) {
    postMessage({
      id: message.id,
      data: data,
      jewels: board.getBoard()
    })
  }
}, false)