jewel.screens['game-screen'] = (function() {
  var board = jewel.board,
  display = jewel.display


  // this uses the asynchronous initialize function on the board module 
  // this board initialize method is the crazy one with the callback method
  function run() {
    board.initialize(function() {
      //this is the method thats passed to body initialize (aka the callback)
      display.initialize(function() {
        // start the game
        display.redraw(board.getBoard(), function() {
        
        })
      })
    })
  }
  return {
    run : run
  }
})()