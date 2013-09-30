//the worker must be told to call the initialize method on the real board module, 
// to do so you must send messages to the message event handler 

// the board errors out if there are no more combos left:
// Uncaught TypeError: Object #<Object> has no method 'refill' screen.game.js:77
// playBoardEvents screen.game.js:77
// next screen.game.js:66
// moveJewels display.canvas.js:23
// playBoardEvents screen.game.js:71
// next screen.game.js:66
// playBoardEvents screen.game.js:80
// next screen.game.js:66
// removeJewels display.canvas.js:31
// playBoardEvents screen.game.js:74
// messageHandler

// does the inclusion of the callback method make it asynchronous

jewel.board = (function() {
  var dom = jewel.dom, 
  settings, worker,
  messageCount, callbacks

  //this callback right here, i must know where it comes from 
  // the callback function is not called from initialize, the callback must be called before the worker
  // has done its job and posted the response message back to the board module

  function initialize(callback) {
    settings = jewel.settings
    rows = settings.rows
    cols = settings.cols
    messageCount = 0;
    callbacks = []
    worker = new Worker('scripts/board.worker.js')
    dom.bind(worker, 'message', messageHandler)
    //whats this callback?
    post('initialize', jewel.settings, callback)
  }

  //this method is triggered whenever the worker sends the main thread
  // a message
  //first a message event handler is attached to the main thread to deal with when a worker
  // sends the main thread a message
  // then you tell the worker to initialize the board
  // the worker initializes the board by calling the board modules initialize method, and passing in the workers
  // own callback method
  // the board modules initialize method then calls the workers callback function that was passed to it after
  // it does everything else
  // that callback function is handled by this function 'messageHandler'
  function messageHandler(event) {
    var message = event.data
    jewels = message.jewels
    if (callbacks[message.id]) {
      // this executes the callback and passes in the message data as a parameter
      callbacks[message.id](message.data)
      delete callbacks[message.id]
    }
  }
  //main thread sending info to the worker
  //to handle callbacks you need to track the messages posted to the worker
  //whenever a message is posted to the worker, the callback is saved in the callbacks array
  // using the message id as its index

  // when the callback function is passed to post(), it is entered into the
  // callbacks array so it can be fetched whenever the worker posts a response back to the main thread
  // the board module listens for responses by attaching a message
  // event handler in initialize 

  //the worker thread must be told to call the initialize method on the real board module
  // to do so you must send messages to the messae event handler in the interface file
  //
  function post(command, data, callback) {
    //the callback that was passed into the worker is stored in an array, so that
    // it can be called when it needs to be later
    callbacks[messageCount] = callback
    worker.postMessage({
      id: messageCount,
      command: command,
      data: data
    })
    messageCount++
  }

  function getBoard(){
    var copy = [], x

    for (x = 0; x < cols; x++) {
      copy[x] = jewels[x].slice(0)
    }
    return copy
  }

  function getJewel(x,y){
    if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1){
      return -1
    } else {
      return jewels[x][y]
    }
  }

  function print(){
    var str = ''
    for (var y = 0; y < rows; y++){
      for (var x = 0; x < cols; x++){
        str += getJewel(x,y) + ' '
      }
      str += '\r\n'
    }
    console.log(str)
  }


  function swap(x1, y1, x2, y2, callback) {
    post('swap', {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }, callback)
  }


  return {
    initialize: initialize,
    swap: swap,
    getBoard: getBoard,
    print: print
  }
})()








